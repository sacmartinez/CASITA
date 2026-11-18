import React, { useState, useEffect } from 'react';

export default function SettingsApp({
  currentUser,
  onUserChange,
  isBetaLauncher,
  onToggleLauncher,
  onOpenTickets,
  onClose
}) {
  const [pushStatus, setPushStatus] = useState('checking'); // 'enabled' | 'disabled' | 'unsupported'
  const [pushLoading, setPushLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // Notificaciones por aplicación
  const [appNotifications, setAppNotifications] = useState({
    weather: true,
    shopping: true,
    tasks: true,
    care: true,
    gym: true,
    birthdays: true
  });
  const [testingWeather, setTestingWeather] = useState(false);
  const [weatherFeedback, setWeatherFeedback] = useState('');

  // Cargar estado de notificaciones push del navegador
  useEffect(() => {
    checkPushStatus();
  }, [currentUser]);

  // Cargar preferencias por aplicación desde el backend
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/notifications/settings?user=${currentUser}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && data.settings) {
            setAppNotifications(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (err) {
        console.warn('Error cargando preferencias de notificaciones:', err);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleToggleAppNotification = async (key) => {
    const updated = { ...appNotifications, [key]: !appNotifications[key] };
    setAppNotifications(updated);
    try {
      await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, settings: { [key]: updated[key] } })
      });
    } catch (e) {
      console.warn('Error guardando preferencia de notificación:', e);
    }
  };

  const handleTestWeatherAlert = async () => {
    setTestingWeather(true);
    setWeatherFeedback('⏳ Comprobando previsión de hoy en Carabanchel, Alcobendas y Ventas...');
    try {
      const res = await fetch('/api/push/test-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, force: true })
      });
      const data = await res.json();
      if (res.ok && data?.result?.message) {
        setWeatherFeedback(`📨 ${data.result.message}`);
      } else {
        setWeatherFeedback('🚀 Aviso de lluvia enviado a tu dispositivo.');
      }
      setTimeout(() => setWeatherFeedback(''), 10000);
    } catch (err) {
      setWeatherFeedback('❌ Error al conectar con el servicio meteorológico.');
      setTimeout(() => setWeatherFeedback(''), 5000);
    } finally {
      setTestingWeather(false);
    }
  };

  const checkPushStatus = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushStatus('unsupported');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        setPushStatus('disabled');
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      setPushStatus(sub ? 'enabled' : 'disabled');
    } catch (e) {
      console.error(e);
      setPushStatus('disabled');
    }
  };

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      if (pushStatus === 'enabled') {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            await fetch('/api/push/unsubscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ endpoint: sub.endpoint })
            });
            await sub.unsubscribe();
          }
        }
        setPushStatus('disabled');
      } else {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          alert('Debes permitir las notificaciones en el navegador para activarlas.');
          setPushLoading(false);
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        const KNOWN_VAPID_PUBLIC_KEY = 'BCBMbxMgpZPqp0JOT3YiIc8o7Xy0jjU6B1CkqoQCWfc4fQ7wD6r_UMzqY1DJtKY3jxSz92EpwC27KvMA9cHJkLE';
        let publicKey = null;

        try {
          const keyRes = await fetch('/api/push/vapid-public-key');
          const cType = keyRes.headers.get('content-type') || '';
          if (keyRes.ok && (cType.includes('application/json') || cType === '')) {
            const raw = await keyRes.text();
            if (raw && !raw.trim().startsWith('<')) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.publicKey) publicKey = parsed.publicKey;
            }
          }
        } catch (_) {}

        if (!publicKey) publicKey = KNOWN_VAPID_PUBLIC_KEY;

        // Convertir clave base64 a Uint8Array
        const padding = '='.repeat((4 - (publicKey.length % 4)) % 4);
        const base64 = (publicKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray
        });

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub, user: currentUser })
        }).catch(() => null);

        setPushStatus('enabled');
      }
    } catch (err) {
      console.error('Error conmutando push:', err);
      alert('Error al configurar notificaciones push: ' + (err.message || err));
    } finally {
      setPushLoading(false);
    }
  };

  const handleTestPush = async () => {
    setTestSent(true);
    try {
      await fetch('/api/push/test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      setTimeout(() => setTestSent(false), 3000);
    } catch (err) {
      console.error(err);
      setTestSent(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%', padding: '1.5rem', borderRadius: '20px' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.6rem' }}>⚙️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Ajustes del Ecosistema</h2>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Configuración de perfil, notificaciones y sistema</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>
            &times;
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Sección: Perfil de Usuario */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
            👤 Perfil Activo en este Móvil
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
            {['Ismael', 'Sandra'].map((user) => (
              <button
                key={user}
                onClick={() => onUserChange(user)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: currentUser === user ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: currentUser === user ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
              >
                <span>{user === 'Ismael' ? '👦' : '👧'}</span>
                <span>{user}</span>
                {currentUser === user && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Sección: Notificaciones Push 24/7 */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                🔔 Notificaciones Push 24/7
              </span>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: pushStatus === 'enabled' ? '#34d399' : 'var(--text-muted)' }}>
                {pushStatus === 'enabled' ? '🟢 Notificaciones Activadas para este móvil' : pushStatus === 'unsupported' ? '⚠️ Navegador incompatible' : '⚪ Notificaciones Desactivadas'}
              </p>
            </div>

            <button
              onClick={handleTogglePush}
              disabled={pushLoading || pushStatus === 'unsupported'}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                background: pushStatus === 'enabled' ? 'rgba(239, 68, 68, 0.2)' : '#10b981',
                color: pushStatus === 'enabled' ? '#f87171' : '#ffffff',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {pushLoading ? 'Cargando...' : pushStatus === 'enabled' ? 'Desactivar' : 'Activar Push'}
            </button>
          </div>

          {pushStatus === 'enabled' && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={handleTestPush}
                disabled={testSent}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {testSent ? '🚀 ¡Notificación enviada!' : '📲 Probar Notificación Ahora'}
              </button>
            </div>
          )}
        </div>

        {/* Sección: Notificaciones por Aplicación */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              🎛️ Notificaciones por Aplicación
            </span>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Activa o desactiva qué avisos deseas recibir en este dispositivo ({currentUser})
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* App: El Tiempo (Lluvias 06:00 AM) */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: appNotifications.weather ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🌧️</span>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#fff', display: 'block' }}>
                      El Tiempo (Aviso de Lluvia 06:00 AM)
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35, display: 'block', marginTop: '0.15rem' }}>
                      Avisa a las 06:00 si ese día se prevén lluvias en Carabanchel, Alcobendas o Ventas y en qué franjas horarias.
                    </span>
                  </div>
                </div>

                {/* Slider / Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!appNotifications.weather}
                  onClick={() => handleToggleAppNotification('weather')}
                  title={appNotifications.weather ? 'Desactivar avisos de lluvia' : 'Activar avisos de lluvia'}
                  style={{
                    width: '46px',
                    height: '26px',
                    borderRadius: '999px',
                    background: appNotifications.weather ? '#10b981' : 'rgba(255,255,255,0.18)',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.25s ease',
                    padding: '2px',
                    flexShrink: 0
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      transform: appNotifications.weather ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform 0.25s ease'
                    }}
                  />
                </button>
              </div>

              {/* Botón de prueba en vivo para El Tiempo */}
              {appNotifications.weather && (
                <div style={{ marginTop: '0.7rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    type="button"
                    onClick={handleTestWeatherAlert}
                    disabled={testingWeather}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '8px',
                      color: '#38bdf8',
                      padding: '0.35rem 0.8rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{testingWeather ? '⏳ Consultando previsión...' : '🧪 Probar Alerta de Lluvia de las 06:00 Ahora'}</span>
                  </button>
                  {weatherFeedback && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#bae6fd', lineHeight: 1.35 }}>
                      {weatherFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Otras Aplicaciones */}
            {[
              { key: 'shopping', icon: '🛒', name: 'Lista de la Compra', desc: 'Avisos cuando se añaden o tachan productos en el súper.' },
              { key: 'tasks', icon: '📋', name: 'Tareas del Hogar', desc: 'Avisos cuando se completan o reasignan tareas.' },
              { key: 'care', icon: '🐾', name: 'Cuidados Jerbis y Plantas', desc: 'Aviso matinal (06:00) si llevan >2 días sin cambio de agua o riego.' },
              { key: 'gym', icon: '🏋️', name: 'Casita Gym (Entrenos)', desc: 'Avisos de entrenos finalizados y alertas de entrenamiento en pareja.' },
              { key: 'birthdays', icon: '🎂', name: 'Cumpleaños y Eventos', desc: 'Avisos el mismo día y con 3 días de antelación.' }
            ].map(app => {
              const isChecked = appNotifications[app.key] !== false;
              return (
                <div
                  key={app.key}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '0.75rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{app.icon}</span>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>
                        {app.name}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block', marginTop: '0.1rem' }}>
                        {app.desc}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isChecked}
                    onClick={() => handleToggleAppNotification(app.key)}
                    title={isChecked ? `Desactivar ${app.name}` : `Activar ${app.name}`}
                    style={{
                      width: '46px',
                      height: '26px',
                      borderRadius: '999px',
                      background: isChecked ? '#10b981' : 'rgba(255,255,255,0.18)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.25s ease',
                      padding: '2px',
                      flexShrink: 0
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                        transform: isChecked ? 'translateX(20px)' : 'translateX(0)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección: Modo de Visualización */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              📱 Interfaz del Sistema
            </span>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
              {isBetaLauncher ? 'Modo Ecosistema (CasitaOS)' : 'Vista Clásica (Pestañas)'}
            </p>
          </div>

          <button
            onClick={onToggleLauncher}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isBetaLauncher ? 'Cambiar a Vista Clásica' : 'Activar CasitaOS'}
          </button>
        </div>

        {/* Sección: Buzón de Incidencias y Sugerencias */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              🛠️ Buzón y Sugerencias
            </span>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ¿Falla algo o quieres añadir una app nueva?
            </p>
          </div>

          <button
            onClick={onOpenTickets}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reportar Idea / Bug
          </button>
        </div>

        {/* Info del Sistema */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
          CasitaOS v7.3.0 · Conectado 24/7 con MongoDB Atlas &amp; Vercel
        </div>
      </div>
    </div>
  );
}
