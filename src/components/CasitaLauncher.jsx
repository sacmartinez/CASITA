import React, { useState, useEffect, useMemo } from 'react';
import './CasitaLauncher.css';

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

  // Métricas para los Badges sobre los iconos
  const [shoppingCount, setShoppingCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [careAlert, setCareAlert] = useState(false);
  const [platesProgress, setPlatesProgress] = useState(0);

  // Reloj digital en vivo
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
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
            const lastWater = careData.find(c => c.action === 'agua' || c.action === 'water');
            const hoursAgo = lastWater ? (Date.now() - new Date(lastWater.timestamp).getTime()) / 3600000 : 99;
            setCareAlert(hoursAgo >= 24);
          }
        }

        if (platesRes && platesRes.ok) {
          const platesData = await platesRes.json();
          if (isMounted && Array.isArray(platesData)) {
            setPlatesProgress(platesData.filter(p => p.completed).length);
          }
        }
      } catch (err) {
        console.error('Error cargando badges del launcher:', err);
      }
    };

    fetchBadges();
    return () => { isMounted = false; };
  }, []);

  // Catálogo unificado y refinado de Apps CasitaOS
  const allApps = useMemo(() => {
    const apps = [
      {
        id: 'organizer',
        name: 'Mi Día',
        icon: '🧭',
        gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        badge: currentUser === 'Ismael' ? '06-22' : null,
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
        badge: '50/50',
        badgeType: 'success',
        keywords: ['gastos', 'finanzas', 'dinero', 'tickets', 'cuentas', 'pagos'],
        action: () => onOpenApp('expenses')
      },
      {
        id: 'comidas',
        name: 'Comidas',
        icon: '🍽️',
        gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        badge: 'Menú',
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
        badge: careAlert ? '⚠️ Agua' : '💧 OK',
        badgeType: careAlert ? 'warning' : 'success',
        keywords: ['jerbis', 'mascotas', 'kalu', 'lua', 'oreo', 'agua', 'comida', 'diario'],
        action: () => onOpenApp('care', 'logs')
      },
      {
        id: 'vehiculos',
        name: 'Vehículos',
        icon: '🏍️',
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        badge: 'Ninja 650',
        badgeType: 'success',
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
        badge: `${platesProgress}/10`,
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
        badge: 'Eventos',
        badgeType: 'normal',
        keywords: ['calendario', 'cumpleanos', 'eventos', 'fechas', 'aniversario'],
        action: () => onOpenApp('calendar')
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
  }, [currentUser, shoppingCount, tasksCount, careAlert, platesProgress, onOpenApp, onOpenSettings, onOpenPlates]);

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
        <div className="os-date-and-greeting">
          <span>{dateFormatted}</span>
          <span className="os-greeting-pill">
            <span>{currentUser === 'Ismael' ? '👦' : '👧'}</span>
            <span>Hola, {currentUser}</span>
          </span>
        </div>
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
    </div>
  );
}
