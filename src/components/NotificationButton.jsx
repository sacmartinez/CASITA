import React, { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationButton({ currentUser }) {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setLoading(false);
      return;
    }

    setPermission(Notification.permission);
    checkSubscription();

    // Temporizador de seguridad: si iOS congela el serviceWorker.ready, desbloquea el botón en 3 segundos
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Volver a suscribirse automáticamente si cambia el usuario y ya está activado
  useEffect(() => {
    if (isSubscribed && permission === 'granted') {
      registerSubscriptionOnServer();
    }
  }, [currentUser]);

  const getRegistration = async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs && regs.length > 0) return regs[0];
    } catch (e) {
      console.warn('Error fetching registrations:', e);
    }
    return await navigator.serviceWorker.ready;
  };

  const checkSubscription = async () => {
    try {
      const reg = await getRegistration();
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      }
    } catch (err) {
      console.error('Error comprobando suscripción push:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerSubscriptionOnServer = async () => {
    try {
      const reg = await getRegistration();
      if (!reg) return;
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
        // 1. Obtener la clave pública VAPID
        const keyRes = await fetch('/api/push/vapid-public-key');
        const { publicKey } = await keyRes.json();

        // 2. Suscribirse en el navegador
        const convertedKey = urlBase64ToUint8Array(publicKey);
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });
      }

      // 3. Registrar en el servidor con el usuario actual
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: sub,
          user: currentUser
        })
      });

      setIsSubscribed(true);
    } catch (err) {
      console.error('Error al registrar suscripción en servidor:', err);
    }
  };

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    if (isSubscribed) {
      // Desactivar notificaciones
      try {
        const reg = await getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            await sub.unsubscribe();
          }
        }
        setIsSubscribed(false);
      } catch (err) {
        console.error('Error desuscribiendo de notificaciones:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Activar notificaciones
      try {
        const reqPermission = await Notification.requestPermission();
        setPermission(reqPermission);

        if (reqPermission === 'granted') {
          await registerSubscriptionOnServer();
        } else {
          alert('Has denegado el permiso de notificaciones. Por favor, actívalo en los ajustes de tu navegador.');
        }
      } catch (err) {
        console.error('Error activando notificaciones:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return null; // El navegador no soporta notificaciones
  }

  return (
    <div className="notification-btn-container">
      <button
        onClick={handleToggle}
        className={`notification-toggle-btn ${isSubscribed ? 'active' : ''}`}
        disabled={loading}
        title={isSubscribed ? 'Notificaciones activadas. Haz clic para desactivar.' : 'Notificaciones desactivadas. Haz clic para activar.'}
        aria-label={isSubscribed ? 'Desactivar notificaciones' : 'Activar notificaciones'}
      >
        <span className="bell-icon">{isSubscribed ? '🔔' : '🔕'}</span>
        {isSubscribed && <span className="bell-badge-dot" />}
      </button>
    </div>
  );
}
