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
import WarrantiesManager from './components/WarrantiesManager';
import BirthdayManager from './components/BirthdayManager';
import IsmaelLifeOrganizer from './components/IsmaelLifeOrganizer';
import GymApp from './GymApp';
import CasitaLauncher from './components/CasitaLauncher';
import PlatesModal from './components/PlatesModal';
import SharedNotesApp from './components/SharedNotesApp';
import CalendarEventsApp from './components/CalendarEventsApp';
import SettingsApp from './components/SettingsApp';
import WeatherApp from './components/WeatherApp';

const APP_NAMES = {
  organizer: '🧭 Mi Día',
  gym: '🏋️ Casita Gym',
  shopping: '🛒 Supermercado',
  expenses: '💰 Finanzas',
  planning: '🍽️ Comidas y Menú',
  tasks: '📋 Tareas del Hogar',
  care: '🐹 Jerbis',
  warranties: '🏍️ Vehículos y Garantías',
  notes: '📝 Notas Compartidas',
  calendar: '📅 Calendario y Eventos',
  weather: '🌦️ El Tiempo',
  settings: '⚙️ Ajustes del Sistema'
};


function App() {
  const [isGymApp, setIsGymApp] = useState(() => {
    const p = window.location.pathname.toLowerCase();
    const q = new URLSearchParams(window.location.search).get('app');
    return p.startsWith('/gym') || q === 'gym';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hogar_user');
    return (saved === 'Ismael' || saved === 'Sandra') ? saved : 'Ismael';
  });

  // Modo Ecosistema / Launcher Beta (Persistido por usuario/navegador)
  const [isBetaLauncher, setIsBetaLauncher] = useState(() => {
    const saved = localStorage.getItem('casita_ecosystem_beta');
    return saved === null ? true : saved === 'true'; // Activo por defecto en fase beta
  });

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('casita_ecosystem_beta');
    return (saved === null || saved === 'true') ? 'launcher' : 'home';
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDailySummaryModal, setShowDailySummaryModal] = useState(false);
  const [dailySummaryData, setDailySummaryData] = useState(null);

  // Minijuego Matrículas
  const [plates, setPlates] = useState([]);
  const [showPlatesModal, setShowPlatesModal] = useState(false);
  
  // Sub-tabs para agrupar las herramientas en las pestañas principales
  const [planningSubTab, setPlanningSubTab] = useState('weekly'); // 'weekly' | 'recipes' | 'birthdays'
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

  const fetchPlates = async () => {
    try {
      const res = await fetch('/api/plates');
      if (res.ok) {
        setPlates(await res.json());
      }
    } catch (e) {
      console.error('Error al cargar matrículas:', e);
    }
  };

  const handleTogglePlate = async (id) => {
    try {
      const res = await fetch('/api/plates/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, user: currentUser })
      });
      if (res.ok) {
        setPlates(await res.json());
      }
    } catch (e) {
      console.error('Error conmutando matrícula:', e);
    }
  };

  const handleResetPlates = async () => {
    try {
      const res = await fetch('/api/plates/reset', { method: 'POST' });
      if (res.ok) {
        setPlates(await res.json());
      }
    } catch (e) {
      console.error('Error al reiniciar matrículas:', e);
    }
  };

  const openPlatesModal = () => {
    fetchPlates();
    setShowPlatesModal(true);
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

  const toggleBetaLauncher = () => {
    setIsBetaLauncher(prev => {
      const next = !prev;
      localStorage.setItem('casita_ecosystem_beta', String(next));
      if (next) {
        setActiveTab('launcher');
      } else {
        setActiveTab('home');
      }
      return next;
    });
  };

  const handleOpenLauncherApp = (tab, subTab) => {
    if (tab === 'gym') {
      openStandaloneGymApp();
      return;
    }
    setActiveTab(tab);
    if (tab === 'planning' && subTab) {
      setPlanningSubTab(subTab);
    } else if (tab === 'tasks' && subTab) {
      setTasksSubTab(subTab);
    } else if (tab === 'care' && subTab) {
      setCareSubTab(subTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // En móvil: solo renderiza el tab activo
  // En escritorio: renderiza el home o el dashboard normal
  const showSection = (tab) => {
    if (isMobile) {
      return activeTab === tab;
    }
    if (activeTab === 'home' || activeTab === 'launcher') {
      return false;
    }
    return activeTab === tab;
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      const q = new URLSearchParams(window.location.search).get('app');
      setIsGymApp(p.startsWith('/gym') || q === 'gym');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openStandaloneGymApp = () => {
    window.history.pushState({}, 'Entrenamiento', '/gym');
    setIsGymApp(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeStandaloneGymApp = () => {
    window.history.pushState({}, 'CasitaOS', '/');
    document.title = 'CasitaOS';
    setIsGymApp(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isGymApp) {
    return <GymApp onBackToCasita={closeStandaloneGymApp} />;
  }

  return (
    <div className="app-container">
      {/* Cabecera Clásica: SOLO se muestra si NO estamos en Modo Ecosistema */}
      {!isBetaLauncher && (
        <header className="app-header">
          <div className="logo-section">
            <h1 onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>Casita Hub</h1>
            <p>El espacio compartido de Ismael &amp; Sandra</p>
          </div>
          <div className="header-actions">
            <button
              className="header-tool-btn"
              onClick={toggleBetaLauncher}
              title="Activar Ecosistema CasitaOS (Beta Launcher)"
              aria-label="Conmutar Modo Ecosistema Beta"
            >
              📱
            </button>
            {currentUser === 'Ismael' && (
              <button
                className="header-tool-btn"
                onClick={() => setActiveTab('organizer')}
                title="Organizador Diario de Ismael (06:00 a 22:15)"
                aria-label="Abrir Organizador Diario de Ismael"
                style={{
                  background: activeTab === 'organizer' ? 'rgba(59, 130, 246, 0.35)' : undefined,
                  borderColor: activeTab === 'organizer' ? '#38bdf8' : undefined
                }}
              >
                🧭
              </button>
            )}
            <button 
              className="header-tool-btn" 
              onClick={openStandaloneGymApp} 
              title="Abrir App Entrenamiento"
              aria-label="Abrir App Entrenamiento"
            >
              🏋️
            </button>
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
      )}

      {/* Barra superior nativa de retorno cuando estamos dentro de una app en Modo Ecosistema */}
      {isBetaLauncher && activeTab !== 'launcher' && (
        <div className="os-in-app-bar">
          <button 
            className="os-in-app-back-btn" 
            onClick={() => {
              setActiveTab('launcher');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Volver al menú de CasitaOS"
          >
            <span className="os-back-arrow">‹</span>
            <span className="os-back-text">Inicio</span>
          </button>
          <div className="os-in-app-current-pill">
            {APP_NAMES[activeTab] || 'CasitaOS'}
          </div>
        </div>
      )}

      {/* Pantalla Principal del Ecosistema Beta (Launcher) */}
      {isBetaLauncher && activeTab === 'launcher' && (
        <CasitaLauncher
          currentUser={currentUser}
          onOpenApp={handleOpenLauncherApp}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenPlates={openPlatesModal}
        />
      )}

      {/* App: Ajustes y Configuración del Sistema */}
      {activeTab === 'settings' && (
        <div style={{ padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <SettingsApp
            currentUser={currentUser}
            onUserChange={(newUser) => {
              setCurrentUser(newUser);
              localStorage.setItem('hogar_user', newUser);
            }}
            isBetaLauncher={isBetaLauncher}
            onToggleLauncher={toggleBetaLauncher}
            onOpenTickets={() => setShowTicketModal(true)}
            onClose={() => setActiveTab(isBetaLauncher ? 'launcher' : 'home')}
          />
        </div>
      )}

      {/* App: Notas Compartidas (sustituye nevera) */}
      {activeTab === 'notes' && (
        <div style={{ padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <SharedNotesApp currentUser={currentUser} />
        </div>
      )}

      {/* App: Calendario & Eventos (fusiona eventos y cumpleaños) */}
      {activeTab === 'calendar' && (
        <div style={{ padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <CalendarEventsApp currentUser={currentUser} />
        </div>
      )}

      {/* App: El Tiempo (Previsión 7 días en Carabanchel, Alcobendas, Ventas, Centro) */}
      {activeTab === 'weather' && (
        <div style={{ padding: '0 0.5rem 2rem 0.5rem', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <WeatherApp />
        </div>
      )}

      {/* Vista Clásica del Dashboard (Home) */}
      {!isBetaLauncher && activeTab === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <Dashboard 
            currentUser={currentUser} 
            onNavigate={(tab, subTab) => {
              if (tab === 'gym') {
                openStandaloneGymApp();
                return;
              }
              setActiveTab(tab);
              if (tab === 'planning' && subTab) {
                setPlanningSubTab(subTab);
              }
            }} 
          />
          
          <div style={{ width: '100%' }}>
            <FridgeNotes currentUser={currentUser} />
          </div>
        </div>
      )}

      {/* Organizador Diario de Vida y Proyectos de Ismael (06:00 a 22:15) */}
      {activeTab === 'organizer' && (
        <div style={{ padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <IsmaelLifeOrganizer
            onNavigate={(tab) => {
              if (tab === 'gym') {
                openStandaloneGymApp();
                return;
              }
              setActiveTab(tab);
            }}
          />
        </div>
      )}

      {/* Vehículos, Motos y Libro de Mantenimiento (Kawasaki Ninja 650, Benelli, Focus, Fiesta) */}
      {activeTab === 'warranties' && (
        <div style={{ padding: '0 1rem 1.5rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <WarrantiesManager currentUser={currentUser} />
        </div>
      )}

      {/* Comidas: Planificador Semanal + Recetario Casero */}
      {showSection('planning') && (
        <div className="weekly-planner-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* Sub-tab Selector */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
            <button 
              onClick={() => setPlanningSubTab('weekly')} 
              className={`tab-btn ${planningSubTab === 'weekly' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.45rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: planningSubTab === 'weekly' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
            >
              📅 Menú Semanal
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

      {/* Grid de herramientas principales (Shopping, Expenses, Tasks, Jerbis) */}
      {activeTab !== 'home' && activeTab !== 'launcher' && activeTab !== 'planning' && activeTab !== 'gym' && activeTab !== 'warranties' && activeTab !== 'organizer' && activeTab !== 'notes' && activeTab !== 'calendar' && activeTab !== 'settings' && activeTab !== 'weather' && (
        <main className={`dashboard-grid ${isMobile ? 'mobile-tab-view' : ''}`}>
          {/* LISTA DE COMPRAS */}
          {showSection('shopping') && (
            <div className="glass-card-wrapper active-tab">
              <ShoppingList currentUser={currentUser} />
            </div>
          )}

          {/* GASTOS COMPARTIDOS 50/50 */}
          {showSection('expenses') && (
            <div className="glass-card-wrapper active-tab">
              <ExpensesManager currentUser={currentUser} />
            </div>
          )}

          {/* TAREAS DOMÉSTICAS, BITÁCORA Y ESTADÍSTICAS */}
          {showSection('tasks') && (
            <div className="glass-card-wrapper active-tab" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
                  🔧 Bitácora Casa
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

          {/* JERBIS: CUIDADO DE ROEDORES Y DIARIO */}
          {showSection('care') && (
            <div className="glass-card-wrapper active-tab" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', width: '100%', margin: '0 auto' }}>
                <button 
                  onClick={() => setCareSubTab('logs')} 
                  className={`tab-btn ${careSubTab === 'logs' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: careSubTab === 'logs' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                >
                  💧 Registro Agua &amp; Comida
                </button>
                <button 
                  onClick={() => setCareSubTab('journal')} 
                  className={`tab-btn ${careSubTab === 'journal' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.75rem', border: 'none', background: careSubTab === 'journal' ? 'var(--primary)' : 'transparent', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                >
                  📖 Diario Jerbis
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

      {/* Barra de navegación clásica inferior (SOLO se muestra en Vista Clásica) */}
      {!isBetaLauncher && (
        <nav className="mobile-nav-bar" aria-label="Navegación móvil">
          <button
            onClick={() => setActiveTab('home')}
            className={`mobile-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            aria-label="Ver inicio"
          >
            <span className="mobile-nav-icon">🏠</span>
            <span>Inicio</span>
          </button>

          {currentUser === 'Ismael' && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={`mobile-nav-btn ${activeTab === 'organizer' ? 'active' : ''}`}
              aria-label="Ver organizador de mi día"
            >
              <span className="mobile-nav-icon">🧭</span>
              <span>Mi Día</span>
            </button>
          )}

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
            aria-label="Ver comidas"
          >
            <span className="mobile-nav-icon">🍽️</span>
            <span>Comidas</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`mobile-nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            aria-label="Ver tareas"
          >
            <span className="mobile-nav-icon">📋</span>
            <span>Tareas</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`mobile-nav-btn ${activeTab === 'care' ? 'active' : ''}`}
            aria-label="Ver jerbis"
          >
            <span className="mobile-nav-icon">🐹</span>
            <span>Jerbis</span>
          </button>
        </nav>
      )}

      {/* Modal de Tickets (Buzón de Ideas e Incidencias) */}
      <TicketModal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)} 
        currentUser={currentUser} 
      />

      {/* Modal de Matrículas (Minijuego) */}
      <PlatesModal
        isOpen={showPlatesModal}
        onClose={() => setShowPlatesModal(false)}
        plates={plates}
        onTogglePlate={handleTogglePlate}
        currentUser={currentUser}
        onReset={handleResetPlates}
      />

      {/* Modal Resumen Diario */}
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
              <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontSize: '0.88rem', lineHeight: '1.4' }}>
                {dailySummaryData.quote}
              </div>

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
