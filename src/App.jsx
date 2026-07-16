import React, { useState, useEffect, useRef } from 'react';
import UserSelector from './components/UserSelector';
import ShoppingList from './components/ShoppingList';
import TaskManager from './components/TaskManager';
import CareTracker from './components/CareTracker';
import WeeklyPlanner from './components/WeeklyPlanner';
import Dashboard from './components/Dashboard';
import NotificationButton from './components/NotificationButton';
import TicketModal from './components/TicketModal';
import ExpensesManager from './components/ExpensesManager';
import FridgeNotes from './components/FridgeNotes';
import RecipeBook from './components/RecipeBook';
import PetJournal from './components/PetJournal';
import MaintenanceLog from './components/MaintenanceLog';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hogar_user');
    return (saved === 'Ismael' || saved === 'Sandra') ? saved : 'Ismael';
  });
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'shopping' | 'planning' | 'tasks' | 'care'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDailySummaryModal, setShowDailySummaryModal] = useState(false);
  const [dailySummaryData, setDailySummaryData] = useState(null);
  
  // Sub-tabs para agrupar las nuevas herramientas en las pestañas principales
  const [planningSubTab, setPlanningSubTab] = useState('weekly'); // 'weekly' | 'recipes'
  const [tasksSubTab, setTasksSubTab] = useState('chores'); // 'chores' | 'maintenance' | 'stats'
  const [careSubTab, setCareSubTab] = useState('logs'); // 'logs' | 'journal'

  const fetchDailySummary = async () => {
    try {
      const res = await fetch('/api/daily-summary');
      if (res.ok) {
        const data = await res.json();
        setDailySummaryData(data);
        setShowDailySummaryModal(true);
      }
    } catch (err) {
      console.error('Error al cargar resumen diario:', err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openDailySummary') === 'true') {
      fetchDailySummary();
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Registrar Service Worker para notificaciones push
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
        .catch(err => console.error('Error al registrar Service Worker:', err));
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // En móvil: solo renderiza el tab activo
  // En escritorio: renderiza el home o el dashboard normal
  const showSection = (tab) => {
    if (isMobile) {
      return activeTab === tab;
    }
    // En escritorio:
    // Si la pestaña activa es 'home', mostramos el Dashboard general.
    // Si es otra pestaña, mostramos esa sección expandida.
    if (activeTab === 'home') {
      return false; // Mostraremos el Dashboard component en su lugar
    }
    return activeTab === tab;
  };

  return (
    <div className="app-container">
      {/* Cabecera Principal */}
      <header className="app-header">
        <div className="logo-section">
          <h1 onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>Casita Hub</h1>
          <p>El espacio compartido de Ismael &amp; Sandra</p>
        </div>
        <div className="header-actions">
          <button 
            className="header-tool-btn" 
            onClick={() => setShowTicketModal(true)} 
            title="Reportar bug o proponer función"
            aria-label="Reportar bug o proponer función"
          >
            🛠️
          </button>
          <NotificationButton currentUser={currentUser} />
          <UserSelector currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </div>
      </header>

      {/* Contenido según pestaña */}
      {activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <Dashboard currentUser={currentUser} onNavigate={(tab) => setActiveTab(tab)} />
          
          <div style={{ width: '100%' }}>
            <FridgeNotes currentUser={currentUser} />
          </div>
        </div>
      )}

      {/* Planificador Semanal / Recetario */}
      {showSection('planning') && (
        <div className="weekly-planner-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* Sub-tab Selector */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <button 
              onClick={() => setPlanningSubTab('weekly')} 
              className={`tab-btn ${planningSubTab === 'weekly' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: planningSubTab === 'weekly' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
            >
              📅 Plan Semanal
            </button>
            <button 
              onClick={() => setPlanningSubTab('recipes')} 
              className={`tab-btn ${planningSubTab === 'recipes' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: planningSubTab === 'recipes' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
            >
              🍽️ Recetario
            </button>
          </div>
          
          {planningSubTab === 'weekly' ? (
            <WeeklyPlanner currentUser={currentUser} />
          ) : (
            <RecipeBook currentUser={currentUser} />
          )}
        </div>
      )}

      {/* Grid del Dashboard en Escritorio (cuando no estamos en 'home' ni en 'planning') */}
      {activeTab !== 'home' && activeTab !== 'planning' && (
        <main className={`dashboard-grid ${isMobile ? 'mobile-tab-view' : ''}`}>
          {/* PESTAÑA 1: LISTA DE COMPRAS */}
          {showSection('shopping') && (
            <div className="glass-card-wrapper active-tab">
              <ShoppingList currentUser={currentUser} />
            </div>
          )}

          {/* PESTAÑA EXTRA: GASTOS COMPARTIDOS */}
          {showSection('expenses') && (
            <div className="glass-card-wrapper active-tab">
              <ExpensesManager currentUser={currentUser} />
            </div>
          )}

          {/* PESTAÑA 2: TAREAS DOMÉSTICAS, BITÁCORA Y ESTADÍSTICAS */}
          {showSection('tasks') && (
            <div className="glass-card-wrapper active-tab" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.02)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', width: '100%', margin: '0 auto' }}>
                <button 
                  onClick={() => setTasksSubTab('chores')} 
                  className={`tab-btn ${tasksSubTab === 'chores' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.72rem', border: 'none', background: tasksSubTab === 'chores' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  📋 Tareas
                </button>
                <button 
                  onClick={() => setTasksSubTab('maintenance')} 
                  className={`tab-btn ${tasksSubTab === 'maintenance' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.72rem', border: 'none', background: tasksSubTab === 'maintenance' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  🔧 Bitácora
                </button>
                <button 
                  onClick={() => setTasksSubTab('stats')} 
                  className={`tab-btn ${tasksSubTab === 'stats' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.72rem', border: 'none', background: tasksSubTab === 'stats' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  📊 Estadísticas
                </button>
              </div>

              {tasksSubTab === 'chores' && <TaskManager currentUser={currentUser} />}
              {tasksSubTab === 'maintenance' && <MaintenanceLog currentUser={currentUser} />}
              {tasksSubTab === 'stats' && <StatsDashboard />}
            </div>
          )}

          {/* PESTAÑA 3: CUIDADO DE MASCOTAS Y PLANTAS */}
          {showSection('care') && (
            <div className="glass-card-wrapper active-tab" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', width: '100%', margin: '0 auto' }}>
                <button 
                  onClick={() => setCareSubTab('logs')} 
                  className={`tab-btn ${careSubTab === 'logs' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: careSubTab === 'logs' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                >
                  💧 Registro Rápido
                </button>
                <button 
                  onClick={() => setCareSubTab('journal')} 
                  className={`tab-btn ${careSubTab === 'journal' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: careSubTab === 'journal' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                >
                  Diario Mascotas
                </button>
              </div>

              {careSubTab === 'logs' ? (
                <CareTracker currentUser={currentUser} />
              ) : (
                <PetJournal currentUser={currentUser} />
              )}
            </div>
          )}
        </main>
      )}

      {/* Barra de navegación inferior (o superior para escritorio) */}
      <nav className="mobile-nav-bar" aria-label="Navegación móvil">
        <button
          onClick={() => setActiveTab('home')}
          className={`mobile-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          aria-label="Ver inicio"
        >
          <span className="mobile-nav-icon">🏠</span>
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          className={`mobile-nav-btn ${activeTab === 'shopping' ? 'active' : ''}`}
          aria-label="Ver lista de la compra"
        >
          <span className="mobile-nav-icon">🛒</span>
          <span>Compras</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`mobile-nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          aria-label="Ver gastos compartidos"
        >
          <span className="mobile-nav-icon">💰</span>
          <span>Gastos</span>
        </button>

        <button
          onClick={() => setActiveTab('planning')}
          className={`mobile-nav-btn ${activeTab === 'planning' ? 'active' : ''}`}
          aria-label="Ver planificación semanal"
        >
          <span className="mobile-nav-icon">📅</span>
          <span>Planning</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`mobile-nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          aria-label="Ver tareas domésticas e historial"
        >
          <span className="mobile-nav-icon">📋</span>
          <span>Tareas</span>
        </button>

        <button
          onClick={() => setActiveTab('care')}
          className={`mobile-nav-btn ${activeTab === 'care' ? 'active' : ''}`}
          aria-label="Ver cuidado de mascotas y plantas"
        >
          <span className="mobile-nav-icon">🐹</span>
          <span>Cuidados</span>
        </button>
      </nav>

      {/* Modal de Tickets (Pulsación larga en el logo) */}
      <TicketModal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)} 
        currentUser={currentUser} 
      />

      {/* Modal Resumen Diario (Al pulsar la notificación de la mañana) */}
      {showDailySummaryModal && dailySummaryData && (
        <div className="modal-overlay" onClick={() => setShowDailySummaryModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.2rem' }}>
                <span>☀️</span> Hoy: {dailySummaryData.date}
              </h2>
              <button className="modal-close" onClick={() => setShowDailySummaryModal(false)}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Frase célebre aleatoria */}
              <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
                {dailySummaryData.quote}
              </div>

              {/* Comidas y Actividades */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🍳</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Almuerzo / Comida</span>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>{dailySummaryData.planning.comida}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🍲</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Cena</span>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>{dailySummaryData.planning.cena}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🏖️</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Actividad o Nota del Día</span>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff' }}>{dailySummaryData.planning.actividad}</span>
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', margin: '0.2rem 0' }} />

              {/* Tareas del Hogar Pendientes */}
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>
                  📋 Tareas aún pendientes en casa
                </h3>
                {dailySummaryData.pendingTasks.length === 0 ? (
                  <p style={{ color: 'var(--success)', fontSize: '0.88rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    ✅ ¡Gran trabajo! No quedan tareas pendientes.
                  </p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {dailySummaryData.pendingTasks.map((taskText, idx) => (
                      <li key={idx} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.6rem' }}>●</span> {taskText}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botón de cierre */}
              <button 
                onClick={() => setShowDailySummaryModal(false)}
                className="btn-primario" 
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                ¡A por el día! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
