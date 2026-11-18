import React, { useState, useEffect, useMemo } from 'react';
import './CasitaLauncher.css';

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  if (diffMins < 2) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function getNotifIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('lluvia') || t.includes('tiempo')) return '🌧️';
  if (t.includes('compra') || t.includes('súper')) return '🛒';
  if (t.includes('tarea')) return '📋';
  if (t.includes('kalu') || t.includes('lua') || t.includes('jerbo') || t.includes('agua') || t.includes('planta')) return '🐾';
  if (t.includes('gym') || t.includes('entreno')) return '🏋️';
  if (t.includes('cumple')) return '🎂';
  return '🔔';
}

export default function CasitaLauncher({
  currentUser,
  onOpenApp,
  onOpenSettings,
  onOpenPlates
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  });

  // Métricas para los Badges sobre los iconos (solo cuando haya algo pendiente)
  const [shoppingCount, setShoppingCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [careAlertBadge, setCareAlertBadge] = useState(null);
  const [platesProgress, setPlatesProgress] = useState(0);
  const [weatherBadge, setWeatherBadge] = useState(() => {
    try {
      const p = localStorage.getItem('casita_weather_today_rain_prob');
      return p && Number(p) >= 40 ? `🌧️ ${p}%` : null;
    } catch (_) {
      return null;
    }
  });
  const [quickWeather, setQuickWeather] = useState(null);

  // Centro de Notificaciones Pasadas
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Reloj digital en vivo
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carga del tiempo para alerta de lluvia en launcher en base a ubicación GPS real
  useEffect(() => {
    let isMounted = true;

    const getDistanceKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const resolveLocationLabel = (lat, lon) => {
      if (getDistanceKm(lat, lon, 40.3833, -3.7333) < 4.0) return 'Carabanchel';
      if (getDistanceKm(lat, lon, 40.5475, -3.6420) < 4.0) return 'Alcobendas';
      if (getDistanceKm(lat, lon, 40.4316, -3.6635) < 4.0) return 'Ventas';
      return 'Tu ubicación';
    };

    const fetchWeatherForCoords = async (lat, lon, label) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=precipitation_probability_max,precipitation_sum&timezone=Europe%2FMadrid`;
        const res = await fetch(url);
        if (res.ok && isMounted) {
          const data = await res.json();
          const prob = data.daily?.precipitation_probability_max?.[0] || 0;
          const temp = Math.round(data.current?.temperature_2m || 15);
          const isRain = prob >= 40;
          setQuickWeather({ temp, prob, isRain, label });
          if (isRain) {
            setWeatherBadge(`🌧️ ${prob}%`);
          } else {
            setWeatherBadge(null);
          }
          try {
            localStorage.setItem('casita_weather_today_rain_prob', prob);
            localStorage.setItem('casita_last_weather_label', label);
          } catch (_) {}
        }
      } catch (_) {}
    };

    // Intentar geolocalización del navegador
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const label = resolveLocationLabel(lat, lon);
          fetchWeatherForCoords(lat, lon, label);
        },
        () => {
          // Fallback en caso de permiso denegado o timeout
          fetchWeatherForCoords(40.3833, -3.7333, 'Carabanchel');
        },
        { timeout: 6000, maximumAge: 300000 }
      );
    } else {
      fetchWeatherForCoords(40.3833, -3.7333, 'Carabanchel');
    }

    return () => { isMounted = false; };
  }, []);

  // Carga de badges de notificación en tiempo real
  useEffect(() => {
    let isMounted = true;
    const fetchBadges = async () => {
      try {
        const [shopRes, taskRes, careRes, platesRes] = await Promise.all([
          fetch('/api/shopping').catch(() => null),
          fetch('/api/tasks').catch(() => null),
          fetch('/api/care').catch(() => null),
          fetch('/api/plates').catch(() => null)
        ]);

        if (shopRes && shopRes.ok) {
          const shopData = await shopRes.json();
          if (isMounted) setShoppingCount(shopData.filter(i => !i.completed).length);
        }

        if (taskRes && taskRes.ok) {
          const taskData = await taskRes.json();
          if (isMounted) setTasksCount(Array.isArray(taskData) ? taskData.length : 0);
        }

        if (careRes && careRes.ok) {
          const careData = await careRes.json();
          if (isMounted && Array.isArray(careData)) {
            const isJerboTarget = (t) => {
              if (!t) return false;
              const s = t.toLowerCase();
              return s.includes('jerbo') || s.includes('kalu') || s.includes('lua') || s.includes('rata') || s.includes('oreo');
            };
            const lastWater = careData.find(c => isJerboTarget(c.target) && (c.action?.toLowerCase() === 'agua' || c.action?.toLowerCase() === 'water'));
            const lastFood = careData.find(c => isJerboTarget(c.target) && (c.action?.toLowerCase() === 'comida' || c.action?.toLowerCase() === 'food'));

            const now = Date.now();
            const hoursWater = lastWater ? (now - new Date(lastWater.timestamp).getTime()) / 3600000 : 999;
            const hoursFood = lastFood ? (now - new Date(lastFood.timestamp).getTime()) / 3600000 : 999;

            const waterPending = hoursWater >= 24;
            const foodPending = hoursFood >= 24;

            if (waterPending && foodPending) {
              setCareAlertBadge('⚠️ Agua y Comida');
            } else if (waterPending) {
              setCareAlertBadge('⚠️ Agua');
            } else if (foodPending) {
              setCareAlertBadge('⚠️ Comida');
            } else {
              setCareAlertBadge(null); // ¡Sin burbuja si está atendido hoy!
            }
          }
        }

        if (platesRes && platesRes.ok) {
          const platesData = await platesRes.json();
          if (isMounted && Array.isArray(platesData)) {
            setPlatesProgress(platesData.filter(p => p.completed).length);
          }
        }

        // Cargar historial de notificaciones
        try {
          const notifRes = await fetch(`/api/notifications/history?user=${currentUser}`);
          if (notifRes.ok && isMounted) {
            const notifData = await notifRes.json();
            const list = notifData.history || [];
            setNotificationHistory(list);
            setUnreadNotifCount(list.filter(n => !n.read).length);
          }
        } catch (_) {}
      } catch (err) {
        console.error('Error cargando badges del launcher:', err);
      }
    };

    fetchBadges();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Funciones de gestión del Centro de Notificaciones
  const fetchNotificationHistory = async () => {
    try {
      const res = await fetch(`/api/notifications/history?user=${currentUser}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.history || [];
        setNotificationHistory(list);
        setUnreadNotifCount(list.filter(n => !n.read).length);
      }
    } catch (_) {}
  };

  const handleMarkAsRead = async (id = 'all') => {
    try {
      if (id === 'all') {
        setNotificationHistory(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadNotifCount(0);
      } else {
        setNotificationHistory(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
        setUnreadNotifCount(prev => Math.max(0, prev - 1));
      }
      await fetch('/api/notifications/history/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, user: currentUser })
      });
    } catch (_) {}
  };

  const handleClearHistory = async () => {
    try {
      setNotificationHistory([]);
      setUnreadNotifCount(0);
      await fetch('/api/notifications/history/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
    } catch (_) {}
  };

  // Catálogo unificado y refinado de Apps CasitaOS (Sin burbujas falsas)
  const allApps = useMemo(() => {
    const apps = [
      {
        id: 'organizer',
        name: 'Mi Día',
        icon: '🧭',
        gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        badge: null,
        badgeType: 'normal',
        keywords: ['dia', 'rutina', 'cronometro', 'cv', 'somosgamberros', 'soundpulse', 'proyectos'],
        action: () => onOpenApp('organizer')
      },
      {
        id: 'gym',
        name: 'Casita Gym',
        icon: '🏋️',
        gradient: 'linear-gradient(135deg, #059669, #047857)',
        badge: null,
        badgeType: 'normal',
        keywords: ['gym', 'entrenamiento', 'pesas', 'casitagym', 'casita gym', 'fuerza', 'adan', 'cardio'],
        action: () => onOpenApp('gym')
      },
      {
        id: 'shopping',
        name: 'Supermercado',
        icon: '🛒',
        gradient: 'linear-gradient(135deg, #d97706, #b45309)',
        badge: shoppingCount > 0 ? `${shoppingCount}` : null,
        badgeType: 'normal',
        keywords: ['compra', 'supermercado', 'mercadona', 'lista', 'despensa'],
        action: () => onOpenApp('shopping')
      },
      {
        id: 'expenses',
        name: 'Finanzas',
        icon: '💰',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        badge: null,
        badgeType: 'normal',
        keywords: ['gastos', 'finanzas', 'dinero', 'tickets', 'cuentas', 'pagos'],
        action: () => onOpenApp('expenses')
      },
      {
        id: 'comidas',
        name: 'Comidas',
        icon: '🍽️',
        gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        badge: null,
        badgeType: 'normal',
        keywords: ['comidas', 'cenas', 'menu', 'planning', 'recetas', 'recetario', 'cocina'],
        action: () => onOpenApp('planning', 'weekly')
      },
      {
        id: 'tareas',
        name: 'Tareas',
        icon: '📋',
        gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
        badge: tasksCount > 0 ? `${tasksCount}` : null,
        badgeType: 'normal',
        keywords: ['tareas', 'hogar', 'limpieza', 'bitacora', 'averias', 'estadisticas'],
        action: () => onOpenApp('tasks', 'chores')
      },
      {
        id: 'jerbis',
        name: 'Jerbis',
        icon: '🐹',
        gradient: 'linear-gradient(135deg, #db2777, #be185d)',
        badge: careAlertBadge,
        badgeType: 'warning',
        keywords: ['jerbis', 'mascotas', 'kalu', 'lua', 'oreo', 'agua', 'comida', 'diario'],
        action: () => onOpenApp('care', 'logs')
      },
      {
        id: 'vehiculos',
        name: 'Vehículos',
        icon: '🏍️',
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        badge: null,
        badgeType: 'normal',
        keywords: ['vehiculos', 'moto', 'coche', 'kawasaki', 'ninja', 'benelli', 'focus', 'fiesta', 'taller', 'itv'],
        action: () => onOpenApp('warranties')
      },
      {
        id: 'garantias',
        name: 'Garantías',
        icon: '🛡️',
        gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        badge: null,
        badgeType: 'normal',
        keywords: ['garantias', 'facturas', 'tickets', 'compras', 'electrodomesticos'],
        action: () => onOpenApp('warranties')
      },
      {
        id: 'matriculas',
        name: 'Matrículas',
        icon: '🚘',
        gradient: 'linear-gradient(135deg, #ca8a04, #a16207)',
        badge: null,
        badgeType: 'normal',
        keywords: ['matriculas', 'juego', 'avistamiento', 'coche'],
        action: onOpenPlates
      },
      {
        id: 'notas',
        name: 'Notas',
        icon: '📝',
        gradient: 'linear-gradient(135deg, #9333ea, #7e22ce)',
        badge: null,
        badgeType: 'normal',
        keywords: ['notas', 'apuntes', 'ideas', 'compartidas', 'recordatorios'],
        action: () => onOpenApp('notes')
      },
      {
        id: 'calendario',
        name: 'Calendario',
        icon: '📅',
        gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
        badge: null,
        badgeType: 'normal',
        keywords: ['calendario', 'cumpleanos', 'eventos', 'fechas', 'aniversario'],
        action: () => onOpenApp('calendar')
      },
      {
        id: 'weather',
        name: 'El Tiempo',
        icon: '🌦️',
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        badge: weatherBadge,
        badgeType: weatherBadge ? 'warning' : 'normal',
        keywords: ['tiempo', 'clima', 'lluvia', 'temperatura', 'carabanchel', 'alcobendas', 'ventas', 'madrid', 'paraguas', 'prevision'],
        action: () => onOpenApp('weather')
      },
      {
        id: 'ajustes',
        name: 'Ajustes',
        icon: '⚙️',
        gradient: 'linear-gradient(135deg, #334155, #1e293b)',
        badge: null,
        badgeType: 'normal',
        keywords: ['ajustes', 'configuracion', 'notificaciones', 'perfil', 'tickets', 'bugs'],
        action: onOpenSettings
      }
    ];

    return apps;
  }, [currentUser, shoppingCount, tasksCount, careAlert, platesProgress, weatherBadge, onOpenApp, onOpenSettings, onOpenPlates]);

  // Filtrado reactivo en la barra de búsqueda
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return allApps;
    const q = searchQuery.toLowerCase().trim();
    return allApps.filter(app => {
      const matchName = app.name.toLowerCase().includes(q);
      const matchKeywords = app.keywords.some(k => k.includes(q));
      return matchName || matchKeywords;
    });
  }, [allApps, searchQuery]);

  // Dock inferior personalizado por usuario
  const dockApps = useMemo(() => {
    if (currentUser === 'Ismael') {
      return [
        allApps.find(a => a.id === 'organizer'),
        allApps.find(a => a.id === 'gym'),
        allApps.find(a => a.id === 'shopping'),
        allApps.find(a => a.id === 'expenses')
      ].filter(Boolean);
    } else {
      // Para Sandra
      return [
        allApps.find(a => a.id === 'shopping'),
        allApps.find(a => a.id === 'comidas'),
        allApps.find(a => a.id === 'expenses'),
        allApps.find(a => a.id === 'jerbis')
      ].filter(Boolean);
    }
  }, [currentUser, allApps]);

  const dateFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="casita-os-root">
      {/* Reloj y Fecha (Pantalla de Inicio Móvil Real) */}
      <div className="os-top-clock-section">
        <div className="os-big-digital-time">{currentTime}</div>
        <div className="os-date-and-greeting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span>{dateFormatted}</span>
          <span className="os-greeting-pill">
            <span>{currentUser === 'Ismael' ? '👦' : '👧'}</span>
            <span>Hola, {currentUser}</span>
          </span>

          {/* Botón Campana Centro de Notificaciones */}
          <button
            type="button"
            onClick={() => {
              setShowNotificationCenter(true);
              fetchNotificationHistory();
            }}
            style={{
              background: unreadNotifCount > 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: unreadNotifCount > 0 ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              padding: '0.22rem 0.65rem',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease',
              boxShadow: unreadNotifCount > 0 ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none'
            }}
            title="Ver Centro de Notificaciones pasadas"
          >
            <span>🔔</span>
            {unreadNotifCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 900,
                borderRadius: '999px',
                padding: '0.05rem 0.35rem',
                minWidth: '14px',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {unreadNotifCount}
              </span>
            )}
          </button>
        </div>

        {quickWeather && (
          <button
            type="button"
            onClick={() => onOpenApp('weather')}
            style={{
              marginTop: '0.4rem',
              background: quickWeather.isRain ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: quickWeather.isRain ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Abrir El Tiempo (Previsión 7 días)"
          >
            <span>📍 {quickWeather.label || 'Ubicación'} · {quickWeather.temp}°C {quickWeather.isRain ? '🌧️' : '⛅'}</span>
            {quickWeather.isRain ? (
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>({quickWeather.prob}% lluvia hoy)</span>
            ) : (
              <span style={{ color: '#94a3b8' }}>({quickWeather.prob}% lluvia)</span>
            )}
          </button>
        )}

        {/* Barra de Notificación Reciente si hay pendientes */}
        {unreadNotifCount > 0 && notificationHistory[0] && (
          <button
            type="button"
            onClick={() => {
              setShowNotificationCenter(true);
              fetchNotificationHistory();
            }}
            style={{
              marginTop: '0.45rem',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.45), rgba(88, 28, 135, 0.35))',
              border: '1px solid rgba(147, 197, 253, 0.35)',
              borderRadius: '12px',
              padding: '0.4rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              cursor: 'pointer',
              maxWidth: '380px',
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            title="Abrir aviso en Centro de Notificaciones"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span>{getNotifIcon(notificationHistory[0].title)}</span>
              <strong style={{ color: '#93c5fd' }}>{notificationHistory[0].title}:</strong>
              <span style={{ color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notificationHistory[0].body}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: 800, flexShrink: 0 }}>
              Ver ({unreadNotifCount})
            </span>
          </button>
        )}
      </div>

      {/* Buscador de Apps y Servicios */}
      <div className="os-search-bar-wrapper">
        <span className="os-search-mag-icon">🔍</span>
        <input
          type="text"
          className="os-search-input-box"
          placeholder="Buscar app o servicio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        {searchQuery && (
          <button
            className="os-search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Borrar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Cuadrícula de Apps CasitaOS */}
      <div className="os-grid-layout">
        {filteredApps.map((app) => (
          <button
            key={app.id}
            className="os-app-tile"
            onClick={app.action}
            title={app.name}
          >
            <div className="os-icon-holder">
              <div
                className="os-icon-squircle"
                style={{ background: app.gradient }}
              >
                <span>{app.icon}</span>
              </div>
              {app.badge && (
                <span className={`os-tile-badge ${app.badgeType}`}>
                  {app.badge}
                </span>
              )}
            </div>
            <span className="os-app-name">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Dock Inferior Fijo Personalizado */}
      <div className="os-floating-dock" aria-label="Dock favorito">
        {dockApps.map((app) => (
          <button
            key={app.id}
            className="os-dock-app-btn"
            onClick={app.action}
            title={app.name}
          >
            <div
              className="os-dock-squircle"
              style={{ background: app.gradient }}
            >
              <span>{app.icon}</span>
            </div>
            <span className="os-dock-indicator" />
          </button>
        ))}
      </div>

      {/* Modal / Cajón del Centro de Notificaciones Pasadas */}
      {showNotificationCenter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            overflow: 'hidden'
          }}>
            {/* Cabecera */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📬</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    Centro de Notificaciones
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Historial de avisos de CasitaOS para {currentUser}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNotificationCenter(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Barra de Acciones Rápidas */}
            <div style={{
              padding: '0.6rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {unreadNotifCount > 0 ? `${unreadNotifCount} pendientes de leer` : 'Todo al día'}
              </span>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead('all')}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '8px',
                      color: '#60a5fa',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Marcar todas leídas
                  </button>
                )}
                {notificationHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#94a3b8',
                      fontSize: '0.72rem',
                      padding: '0.25rem 0.6rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Notificaciones */}
            <div style={{
              padding: '1rem 1.25rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              {notificationHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✨</span>
                  <strong style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Sin notificaciones pendientes
                  </strong>
                  <span style={{ fontSize: '0.76rem', marginTop: '0.2rem', display: 'block' }}>
                    Cuando Sandra o tú recibáis avisos de compras, lluvia o tareas, quedarán guardados aquí para revisarlos.
                  </span>
                </div>
              ) : (
                notificationHistory.map((n) => {
                  const timeFormatted = formatTimeAgo(n.timestamp);
                  return (
                    <div
                      key={n.id}
                      style={{
                        background: n.read ? 'rgba(255, 255, 255, 0.025)' : 'rgba(59, 130, 246, 0.12)',
                        border: n.read ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(59, 130, 246, 0.35)',
                        borderRadius: '14px',
                        padding: '0.8rem',
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem', lineHeight: 1, marginTop: '2px' }}>
                        {getNotifIcon(n.title)}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{
                            fontSize: '0.85rem',
                            color: n.read ? '#cbd5e1' : '#ffffff',
                            fontWeight: n.read ? 600 : 800,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {n.title}
                          </strong>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                            {timeFormatted}
                          </span>
                        </div>

                        <p style={{
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.76rem',
                          color: n.read ? '#94a3b8' : '#e2e8f0',
                          lineHeight: 1.35
                        }}>
                          {n.body}
                        </p>
                      </div>

                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(n.id)}
                          title="Marcar como leída"
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            color: '#60a5fa',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
