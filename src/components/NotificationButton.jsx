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
  const [permission, setPermission] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });
  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return localStorage.getItem('casita_push_subscribed') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [testingPush, setTestingPush] = useState(false);

  const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

  const getRegistration = async () => {
    if (!isSupported) return null;
    try {
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js');
      }
      await navigator.serviceWorker.ready;
      return reg;
    } catch (e) {
      console.warn('Error con Service Worker:', e);
      return null;
    }
  };

  const checkSubscription = async () => {
    if (!isSupported) return;
    try {
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }
      const reg = await getRegistration();
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        const active = !!sub && Notification.permission === 'granted';
        setIsSubscribed(active);
        try {
          localStorage.setItem('casita_push_subscribed', active ? 'true' : 'false');
        } catch (_) {}

        // Sincronizar en segundo plano con el servidor para garantizar que MongoDB tiene este móvil registrado
        if (active && sub) {
          fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, user: currentUser })
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Error comprobando estado de suscripción push:', err);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [currentUser]);

  const handleSubscribe = async () => {
    setLoading(true);
    setStatusMessage('⏳ Solicitando permiso al dispositivo...');

    try {
      if (!isSupported) {
        throw new Error('Este navegador o dispositivo no soporta notificaciones push Web.');
      }

      // 1. Pedir permiso
      const reqPermission = await Notification.requestPermission();
      setPermission(reqPermission);

      if (reqPermission !== 'granted') {
        setStatusMessage('⚠️ Permiso denegado. Para recibir notificaciones, actívalas en los Ajustes del navegador.');
        setIsSubscribed(false);
        try {
          localStorage.setItem('casita_push_subscribed', 'false');
        } catch (_) {}
        setLoading(false);
        return;
      }

      setStatusMessage('⏳ Conectando con el servidor push...');

      // 2. Asegurar registro del Service Worker
      const reg = await getRegistration();
      if (!reg || !reg.pushManager) {
        throw new Error('No se pudo iniciar el servicio en segundo plano.');
      }

      // 3. Obtener clave pública VAPID (con fallback seguro ante arranques fríos de servidor)
      const KNOWN_VAPID_PUBLIC_KEY = 'BCBMbxMgpZPqp0JOT3YiIc8o7Xy0jjU6B1CkqoQCWfc4fQ7wD6r_UMzqY1DJtKY3jxSz92EpwC27KvMA9cHJkLE';
      let publicKey = null;

      try {
        let keyRes = await fetch('/api/push/vapid-public-key');
        if (!keyRes.ok) {
          keyRes = await fetch('/push/vapid-public-key');
        }
        const cType = keyRes.headers.get('content-type') || '';
        if (keyRes.ok && (cType.includes('application/json') || cType === '')) {
          const keyRaw = await keyRes.text();
          if (keyRaw && !keyRaw.trim().startsWith('<')) {
            const keyData = JSON.parse(keyRaw);
            if (keyData && keyData.publicKey) {
              publicKey = keyData.publicKey;
            }
          }
        }
      } catch (fetchErr) {
        console.warn('Reintentando obtención VAPID con respaldo:', fetchErr);
      }

      if (!publicKey) {
        publicKey = KNOWN_VAPID_PUBLIC_KEY;
      }

      // 4. Suscribir en el navegador (limpiando tokens obsoletos para forzar una suscripción limpia con Google FCM)
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        try {
          await existing.unsubscribe();
        } catch (_) {}
      }

      const convertedKey = urlBase64ToUint8Array(publicKey);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      // 5. Registrar en MongoDB Atlas a través del backend
      let subSuccess = false;
      try {
        let subRes = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: sub,
            user: currentUser
          })
        });
        if (!subRes.ok) {
          subRes = await fetch('/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription: sub,
              user: currentUser
            })
          });
        }
        subSuccess = subRes.ok;
      } catch (netErr) {
        console.warn('Backend aún conectando, suscripción almacenada localmente:', netErr);
      }

      setIsSubscribed(true);
      try {
        localStorage.setItem('casita_push_subscribed', 'true');
      } catch (_) {}
      setStatusMessage('✅ ¡Notificaciones ACTIVADAS con éxito 24/7!');
    } catch (err) {
      console.error('Error al suscribir:', err);
      setStatusMessage(`❌ Error: ${err.message || 'No se pudo activar'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setStatusMessage('⏳ Desactivando...');
    try {
      const reg = await getRegistration();
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
        }
      }
      setIsSubscribed(false);
      try {
        localStorage.setItem('casita_push_subscribed', 'false');
      } catch (_) {}
      setStatusMessage('⚪ Notificaciones desactivadas en este dispositivo.');
    } catch (err) {
      console.error('Error al desuscribir:', err);
      setStatusMessage('❌ Error al desactivar.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar notificación de prueba para comprobar que suena y llega al instante
  const handleTestNotification = async () => {
    setTestingPush(true);
    setStatusMessage('📨 Sincronizando y enviando aviso a tu móvil...');
    try {
      const reg = await getRegistration();
      if (reg && reg.pushManager) {
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          await handleSubscribe();
          return;
        } else {
          // Re-sincronizar siempre con el backend para garantizar que el servidor tiene la clave activa
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, user: currentUser })
          }).catch(() => {});
        }
      }

      let res = await fetch('/api/push/test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      if (!res.ok) {
        res = await fetch('/push/test-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: currentUser })
        });
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatusMessage('🎉 ¡Aviso enviado con éxito! Mira la barra superior de tu móvil.');
      } else if (data.no_subscription) {
        setStatusMessage('⚠️ Renovando suscripción en el servidor...');
        await handleSubscribe();
      } else {
        setStatusMessage(`⚠️ ${data.error || 'Error al enviar prueba'}`);
      }
    } catch (err) {
      setStatusMessage('❌ Error de conexión al enviar prueba.');
    } finally {
      setTestingPush(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* BOTÓN CAMPANA EN LA CABECERA (ESTADO 100% VISIBLE) */}
      <div className="notification-btn-container" style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowModal(true);
            setStatusMessage('');
            checkSubscription();
          }}
          className="notification-toggle-btn"
          style={{
            background: isSubscribed ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.05)',
            border: isSubscribed ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isSubscribed ? '0 0 10px rgba(16, 185, 129, 0.45)' : 'none',
            color: '#ffffff',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          title={isSubscribed ? `Notificaciones ACTIVADAS para ${currentUser}` : 'Notificaciones DESACTIVADAS'}
          aria-label="Panel de Notificaciones Push"
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>
            {isSubscribed ? '🔔' : '🔕'}
          </span>

          {/* Punto brillante verde o indicador */}
          {isSubscribed ? (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          ) : (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#94a3b8'
            }} />
          )}
        </button>
      </div>

      {/* MODAL / PANEL DE CONTROL DE NOTIFICACIONES */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
            color: '#0f172a',
            fontFamily: 'inherit'
          }}>
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{isSubscribed ? '🔔' : '🔕'}</span>
                <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 900, color: '#0f172a' }}>
                  Notificaciones Push 24/7
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            {/* Tarjeta de estado en vivo */}
            <div style={{
              padding: '1rem',
              borderRadius: '14px',
              background: isSubscribed ? '#ecfdf5' : '#f8fafc',
              border: isSubscribed ? '1.5px solid #6ee7b7' : '1.5px solid #cbd5e1',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem' }}>
                  {isSubscribed ? '🟢' : '⚪'}
                </span>
                <strong style={{ fontSize: '0.92rem', color: isSubscribed ? '#047857' : '#475569' }}>
                  {isSubscribed
                    ? `Notificaciones ACTIVADAS para ${currentUser}`
                    : 'Notificaciones DESACTIVADAS en este dispositivo'}
                </strong>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                {isSubscribed
                  ? `Recibirás avisos instantáneos cuando Sandra o tú apuntéis en la compra, cambiéis el agua a los jerbos, o planifiquéis comidas y tareas.`
                  : 'Actívalas para que tu móvil te avise al instante de cualquier cambio en Casita aunque tengas la app cerrada.'}
              </div>
            </div>

            {/* Mensajes de estado / Feedback */}
            {statusMessage && (
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: statusMessage.startsWith('✅') || statusMessage.startsWith('🎉') ? '#047857' : statusMessage.startsWith('⚠️') ? '#b45309' : '#0284c7',
                background: '#f8fafc',
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                border: '1px solid #e2e8f0',
                lineHeight: 1.4
              }}>
                {statusMessage}
              </div>
            )}

            {/* Botones de acción principal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {isSubscribed ? (
                <>
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    disabled={testingPush || loading}
                    style={{
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {testingPush ? 'Enviando aviso de prueba...' : '🔔 Enviar Notificación de Prueba Ahora'}
                  </button>

                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    style={{
                      background: '#f8fafc',
                      color: '#64748b',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🔕 Desactivar notificaciones en este dispositivo
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {loading ? 'Conectando...' : '🔔 Activar Notificaciones Push Ahora'}
                </button>
              )}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cerrar panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
