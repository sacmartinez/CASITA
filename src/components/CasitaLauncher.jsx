import React, { useState, useMemo, useEffect } from 'react';
import './CasitaLauncher.css';

export default function CasitaLauncher({
  currentUser,
  onOpenApp,
  onToggleClassicMode,
  onOpenTickets,
  onOpenPlates,
  isBetaActive = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Datos para widgets y badges
  const [shoppingCount, setShoppingCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [careStatus, setCareStatus] = useState({ waterOk: true, foodOk: true });
  const [platesCompleted, setPlatesCompleted] = useState(0);
  const [todayMeal, setTodayMeal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const [shopRes, taskRes, careRes, platesRes, planRes] = await Promise.all([
          fetch('/api/shopping').catch(() => null),
          fetch('/api/tasks').catch(() => null),
          fetch('/api/care').catch(() => null),
          fetch('/api/plates').catch(() => null),
          fetch('/api/planning').catch(() => null)
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
            // Verificar último registro de agua en Kalu & Lua
            const lastWater = careData.find(c => c.action === 'agua' || c.action === 'water');
            const waterHoursAgo = lastWater ? (Date.now() - new Date(lastWater.timestamp).getTime()) / 3600000 : 99;
            setCareStatus({
              waterOk: waterHoursAgo < 24,
              foodOk: true
            });
          }
        }

        if (platesRes && platesRes.ok) {
          const platesData = await platesRes.json();
          if (isMounted && Array.isArray(platesData)) {
            setPlatesCompleted(platesData.filter(p => p.completed).length);
          }
        }

        if (planRes && planRes.ok) {
          const planData = await planRes.json();
          if (isMounted && Array.isArray(planData)) {
            const todayStr = new Date().toISOString().split('T')[0];
            const found = planData.find(d => String(d.dayId) === todayStr);
            if (found && (found.comida || found.lunch)) {
              setTodayMeal(found.comida || found.lunch);
            }
          }
        }
      } catch (e) {
        console.error('Error cargando métricas en el launcher:', e);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  // Catálogo completo de aplicaciones del ecosistema CasitaOS
  const apps = useMemo(() => {
    const list = [
      {
        id: 'organizer',
        name: 'Mi Día',
        description: 'Organizador 06:00 - 22:15, proyectos y hábitos',
        category: 'essentials',
        icon: '🧭',
        gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        shadow: 'rgba(37, 99, 235, 0.45)',
        badge: currentUser === 'Ismael' ? '06-22' : null,
        keywords: ['dia', 'rutina', 'cronometro', 'cv', 'somosgamberros', 'soundpulse', 'curro', 'tiempo'],
        action: () => onOpenApp('organizer')
      },
      {
        id: 'gym',
        name: 'Marbella Fit',
        description: 'Gimnasio con Adán, rutinas de fuerza y descanso',
        category: 'fitness',
        icon: '🏋️',
        gradient: 'linear-gradient(135deg, #059669, #047857)',
        shadow: 'rgba(5, 150, 105, 0.45)',
        badge: 'Gym',
        keywords: ['gym', 'fitness', 'adan', 'rutina', 'marbella', 'pesas', 'entreno', 'fuerza', 'peso'],
        action: () => onOpenApp('gym')
      },
      {
        id: 'shopping',
        name: 'Supermercado',
        description: 'Lista de la compra compartida en tiempo real',
        category: 'essentials',
        icon: '🛒',
        gradient: 'linear-gradient(135deg, #d97706, #b45309)',
        shadow: 'rgba(217, 119, 6, 0.45)',
        badge: shoppingCount > 0 ? `${shoppingCount}` : null,
        keywords: ['compra', 'supermercado', 'mercadona', 'comida', 'productos', 'lista'],
        action: () => onOpenApp('shopping')
      },
      {
        id: 'expenses',
        name: 'Finanzas',
        description: 'Gastos compartidos 50/50 y control de tickets',
        category: 'essentials',
        icon: '💰',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        shadow: 'rgba(16, 185, 129, 0.45)',
        badge: '50/50',
        keywords: ['gastos', 'dinero', 'finanzas', 'tickets', 'cuentas', 'pagos', 'deudas'],
        action: () => onOpenApp('expenses')
      },
      {
        id: 'planning_weekly',
        name: 'Planning Menú',
        description: 'Menú semanal, comidas y cenas compartidas',
        category: 'home',
        icon: '📅',
        gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        shadow: 'rgba(124, 58, 237, 0.45)',
        badge: todayMeal ? 'Hoy' : null,
        keywords: ['menu', 'planning', 'comida', 'cena', 'semana', 'almuerzo'],
        action: () => onOpenApp('planning', 'weekly')
      },
      {
        id: 'planning_recipes',
        name: 'Recetario',
        description: 'Platos caseros, ingredientes e ideas culinarias',
        category: 'home',
        icon: '🍽️',
        gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
        shadow: 'rgba(234, 88, 12, 0.45)',
        badge: null,
        keywords: ['recetas', 'cocina', 'platos', 'ingredientes', 'recetario'],
        action: () => onOpenApp('planning', 'recipes')
      },
      {
        id: 'tasks_chores',
        name: 'Tareas Hogar',
        description: 'Limpieza, reparaciones y distribución justa',
        category: 'home',
        icon: '📋',
        gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
        shadow: 'rgba(8, 145, 178, 0.45)',
        badge: tasksCount > 0 ? `${tasksCount}` : null,
        keywords: ['tareas', 'limpieza', 'casa', 'hogar', 'reparto', 'chores'],
        action: () => onOpenApp('tasks', 'chores')
      },
      {
        id: 'tasks_maintenance',
        name: 'Bitácora Casa',
        description: 'Historial de averías y mantenimiento del hogar',
        category: 'home',
        icon: '🔧',
        gradient: 'linear-gradient(135deg, #475569, #334155)',
        shadow: 'rgba(71, 85, 105, 0.45)',
        badge: null,
        keywords: ['averias', 'mantenimiento', 'fontanero', 'electricidad', 'reparacion'],
        action: () => onOpenApp('tasks', 'maintenance')
      },
      {
        id: 'care_logs',
        name: 'Mascotas',
        description: 'Kalu, Lua y Oreo: agua fresca, comida y limpieza',
        category: 'pets',
        icon: '🐹',
        gradient: 'linear-gradient(135deg, #db2777, #be185d)',
        shadow: 'rgba(219, 39, 119, 0.45)',
        badge: careStatus.waterOk ? '💧 OK' : '⚠️ Agua',
        keywords: ['mascotas', 'kalu', 'lua', 'oreo', 'jerbos', 'ratas', 'agua', 'comida'],
        action: () => onOpenApp('care', 'logs')
      },
      {
        id: 'care_journal',
        name: 'Diario Mascotas',
        description: 'Bitácora fotográfica y salud de los roedores',
        category: 'pets',
        icon: '📖',
        gradient: 'linear-gradient(135deg, #e11d48, #be123c)',
        shadow: 'rgba(225, 29, 72, 0.45)',
        badge: null,
        keywords: ['diario', 'fotos', 'veterinario', 'mascotas', 'historia'],
        action: () => onOpenApp('care', 'journal')
      },
      {
        id: 'warranties',
        name: 'Taller & Motor',
        description: 'Libro de mantenimiento Focus, Fiesta y Moto',
        category: 'vehicles',
        icon: '🚗',
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        shadow: 'rgba(2, 132, 199, 0.45)',
        badge: 'ITV',
        keywords: ['coche', 'moto', 'focus', 'fiesta', 'itv', 'taller', 'aceite', 'km'],
        action: () => onOpenApp('warranties')
      },
      {
        id: 'warranties_bills',
        name: 'Garantías',
        description: 'Facturas, tickets y garantías de compra',
        category: 'vehicles',
        icon: '🛡️',
        gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)',
        shadow: 'rgba(79, 70, 229, 0.45)',
        badge: null,
        keywords: ['garantias', 'facturas', 'tickets', 'seguros', 'electrodomesticos'],
        action: () => onOpenApp('warranties')
      },
      {
        id: 'plates',
        name: 'Matrículas',
        description: 'Minijuego de avistamiento 0000 a 9999',
        category: 'games',
        icon: '🚘',
        gradient: 'linear-gradient(135deg, #ca8a04, #a16207)',
        shadow: 'rgba(202, 138, 4, 0.45)',
        badge: `${platesCompleted}/10`,
        keywords: ['matriculas', 'juego', 'coche', 'avistamiento', 'puntos'],
        action: onOpenPlates
      },
      {
        id: 'fridge',
        name: 'Nevera',
        description: 'Post-its rápidos y notas en la nevera de casa',
        category: 'home',
        icon: '📝',
        gradient: 'linear-gradient(135deg, #9333ea, #7e22ce)',
        shadow: 'rgba(147, 51, 234, 0.45)',
        badge: null,
        keywords: ['nevera', 'notas', 'postit', 'mensajes', 'recordatorio'],
        action: () => onOpenApp('home')
      },
      {
        id: 'planning_birthdays',
        name: 'Cumpleaños',
        description: 'Calendario de cumpleaños de amigos y familia',
        category: 'home',
        icon: '🎂',
        gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
        shadow: 'rgba(244, 63, 94, 0.45)',
        badge: null,
        keywords: ['cumpleanos', 'fiesta', 'regalos', 'aniversario', 'fechas'],
        action: () => onOpenApp('planning', 'birthdays')
      },
      {
        id: 'tasks_stats',
        name: 'Estadísticas',
        description: 'Métricas de productividad y reparto del hogar',
        category: 'home',
        icon: '📊',
        gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)',
        shadow: 'rgba(56, 189, 248, 0.45)',
        badge: null,
        keywords: ['estadisticas', 'graficos', 'progreso', 'puntos'],
        action: () => onOpenApp('tasks', 'stats')
      },
      {
        id: 'tickets',
        name: 'Buzón Casita',
        description: 'Reportar errores o solicitar nuevas apps',
        category: 'system',
        icon: '🛠️',
        gradient: 'linear-gradient(135deg, #334155, #1e293b)',
        shadow: 'rgba(51, 65, 85, 0.45)',
        badge: 'Ideas',
        keywords: ['ticket', 'soporte', 'bug', 'fallo', 'mejora', 'sugerencia'],
        action: onOpenTickets
      }
    ];

    return list;
  }, [currentUser, shoppingCount, tasksCount, careStatus, platesCompleted, todayMeal, onOpenApp, onOpenTickets, onOpenPlates]);

  // Filtrado reactivo en tiempo real
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // Filtro de categoría
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'essentials' && app.category !== 'essentials') return false;
        if (selectedCategory === 'home' && app.category !== 'home') return false;
        if (selectedCategory === 'pets' && app.category !== 'pets') return false;
        if (selectedCategory === 'vehicles' && (app.category !== 'vehicles' && app.category !== 'fitness')) return false;
      }

      // Filtro de búsqueda
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = app.name.toLowerCase().includes(q);
      const matchDesc = app.description.toLowerCase().includes(q);
      const matchKeywords = app.keywords.some(k => k.includes(q));
      return matchName || matchDesc || matchKeywords;
    });
  }, [apps, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'Todas las Apps', icon: '📱' },
    { id: 'essentials', label: '⭐ Esenciales', icon: '⭐' },
    { id: 'home', label: '🏠 Hogar & Cocina', icon: '🏠' },
    { id: 'pets', label: '🐾 Mascotas', icon: '🐾' },
    { id: 'vehicles', label: '🚗 Motor & Fitness', icon: '🚗' },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="casita-launcher-root">
      {/* Barra de cabecera OS */}
      <div className="os-header-bar">
        <div className="os-header-date">
          <span className="os-date-text">{currentDateFormatted}</span>
          <div className="os-greeting-text">
            <span>{currentUser === 'Ismael' ? '👦' : '👧'}</span>
            <span>¡Hola, {currentUser}!</span>
          </div>
        </div>

        <div className="os-header-actions">
          <button
            onClick={onToggleClassicMode}
            className="os-beta-badge"
            title="Cambiar a la vista clásica por pestañas"
          >
            <span>🧪 Beta Launcher</span>
            <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>✕ Volver</span>
          </button>
        </div>
      </div>

      {/* Buscador de Apps y Funcionalidades (Estilo Phone App Drawer) */}
      <div className="os-search-container">
        <div className="os-search-input-wrapper">
          <span className="os-search-icon">🔍</span>
          <input
            type="text"
            className="os-search-input"
            placeholder="Buscar apps, tareas o servicios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button
              className="os-search-clear"
              onClick={() => setSearchQuery('')}
              title="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Widgets de vistazo rápido inteligente */}
      <div className="os-widgets-row">
        <div className="os-widget-card" onClick={() => onOpenApp('shopping')}>
          <div className="os-widget-top">
            <span className="os-widget-icon">🛒</span>
            <span className={`os-widget-badge ${shoppingCount > 0 ? 'alert' : 'success'}`}>
              {shoppingCount > 0 ? `${shoppingCount} pendientes` : 'Al día'}
            </span>
          </div>
          <span className="os-widget-title">Supermercado</span>
          <span className="os-widget-value">
            {shoppingCount > 0 ? `${shoppingCount} productos` : 'Despensa llena'}
          </span>
        </div>

        <div className="os-widget-card" onClick={() => onOpenApp('care', 'logs')}>
          <div className="os-widget-top">
            <span className="os-widget-icon">🐹</span>
            <span className={`os-widget-badge ${careStatus.waterOk ? 'success' : 'alert'}`}>
              {careStatus.waterOk ? '💧 OK' : '⚠️ Revisar'}
            </span>
          </div>
          <span className="os-widget-title">Kalu, Lua & Oreo</span>
          <span className="os-widget-value">
            {careStatus.waterOk ? 'Agua y comida al día' : 'Poner agua fresca'}
          </span>
        </div>

        <div className="os-widget-card" onClick={() => onOpenApp('organizer')}>
          <div className="os-widget-top">
            <span className="os-widget-icon">🧭</span>
            <span className="os-widget-badge success">06:00-22:15</span>
          </div>
          <span className="os-widget-title">Mi Día Ismael</span>
          <span className="os-widget-value">Cronómetro & Vida</span>
        </div>

        <div className="os-widget-card" onClick={() => onOpenApp('gym')}>
          <div className="os-widget-top">
            <span className="os-widget-icon">🏋️</span>
            <span className="os-widget-badge">Fit</span>
          </div>
          <span className="os-widget-title">Marbella Fit</span>
          <span className="os-widget-value">Rutina con Adán</span>
        </div>
      </div>

      {/* Categorías / Filtros rápidos */}
      <div className="os-categories-scroll">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`os-chip ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Aplicaciones del Ecosistema */}
      <div className="os-apps-grid">
        {filteredApps.map((app) => (
          <button
            key={app.id}
            className="os-app-item"
            onClick={app.action}
            title={app.description}
          >
            <div className="os-app-icon-wrapper">
              <div
                className="os-app-icon-squircle"
                style={{
                  background: app.gradient,
                  '--tile-shadow': app.shadow
                }}
              >
                <span>{app.icon}</span>
              </div>
              {app.badge && <span className="os-app-badge">{app.badge}</span>}
            </div>
            <span className="os-app-label">{app.name}</span>
          </button>
        ))}
      </div>

      {/* Dock Inferior Fijo con las 4 apps principales */}
      <div className="os-dock-container" aria-label="Dock rápido CasitaOS">
        <button
          className="os-dock-item"
          onClick={() => onOpenApp('organizer')}
          title="Mi Día"
        >
          <div
            className="os-dock-icon"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            <span>🧭</span>
          </div>
          <span className="os-dock-dot" />
        </button>

        <button
          className="os-dock-item"
          onClick={() => onOpenApp('shopping')}
          title="Supermercado"
        >
          <div
            className="os-dock-icon"
            style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}
          >
            <span>🛒</span>
          </div>
          <span className="os-dock-dot" />
        </button>

        <button
          className="os-dock-item"
          onClick={() => onOpenApp('gym')}
          title="Marbella Fit"
        >
          <div
            className="os-dock-icon"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            <span>🏋️</span>
          </div>
          <span className="os-dock-dot" />
        </button>

        <button
          className="os-dock-item"
          onClick={() => onOpenApp('expenses')}
          title="Finanzas 50/50"
        >
          <div
            className="os-dock-icon"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <span>💰</span>
          </div>
          <span className="os-dock-dot" />
        </button>
      </div>
    </div>
  );
}
