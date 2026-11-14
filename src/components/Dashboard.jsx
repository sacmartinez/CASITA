import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

function getGreeting(name) {
  const hour = new Date().getHours();
  if (hour < 12) return `¡Buenos días, ${name}! ☀️`;
  if (hour < 20) return `¡Buenas tardes, ${name}! 🌤️`;
  return `¡Buenas noches, ${name}! 🌙`;
}

function getTodayName() {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function Dashboard({ currentUser, onNavigate }) {
  const [shopping, setShopping] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [care, setCare] = useState(null);
  const [planning, setPlanning] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [plates, setPlates] = useState([]);
  const [showPlatesModal, setShowPlatesModal] = useState(false);
  const [oreoActive, setOreoActive] = useState(true);
  const [birthdays, setBirthdays] = useState([]);
  const [gymData, setGymData] = useState({ workouts: [], bodyWeights: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [shopRes, taskRes, careRes, planRes, wRes, platesRes, oreoActiveRes, bdaysRes, gymRes] = await Promise.all([
          fetch(`${API_BASE}/shopping`),
          fetch(`${API_BASE}/tasks`),
          fetch(`${API_BASE}/care`),
          fetch(`${API_BASE}/planning`),
          fetch(`${API_BASE}/warranties`),
          fetch(`${API_BASE}/plates`),
          fetch(`${API_BASE}/pets/oreo/active`),
          fetch(`${API_BASE}/birthdays`),
          fetch(`${API_BASE}/gym`),
        ]);
        setShopping(await shopRes.json());
        setTasks(await taskRes.json());
        setCare(await careRes.json());
        setPlanning(await planRes.json());
        setWarranties(await wRes.json());
        setPlates(await platesRes.json());
        const oreoActiveData = await oreoActiveRes.json();
        setOreoActive(oreoActiveData.active);
        setBirthdays(await bdaysRes.json());
        if (gymRes.ok) {
          setGymData(await gymRes.json());
        }
      } catch (e) {
        console.error('Error cargando datos del dashboard', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleTogglePlate = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/plates/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, user: currentUser })
      });
      if (res.ok) {
        const updatedPlates = await res.json();
        setPlates(updatedPlates);
      }
    } catch (e) {
      console.error('Error conmutando matrícula', e);
    }
  };

  const pendingItems = shopping.filter(i => !i.completed).length;
  const pendingTasks = tasks.length;

  // Today's planning
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayKey = getLocalDateString(new Date());
  const todayPlan = planning.find(d => String(d.dayId) === todayKey);

  // Care summary
  const getLatestLog = (target, action) => {
    if (!Array.isArray(care)) return null;
    return care.find(log => {
      if (target === 'Ratas (Kalu & Lua)' || target === 'Jerbos (Kalu & Lua)') {
        return (
          log.target === 'Ratas (Kalu & Lua)' ||
          log.target === 'Jerbos (Kalu & Lua)' ||
          log.target === 'Kalu' ||
          log.target === 'Lua'
        ) && log.action === action;
      }
      if (target === 'Rata (Oreo)' || target === 'Jerbo (Oreo)') {
        return (
          log.target === 'Rata (Oreo)' ||
          log.target === 'Jerbo (Oreo)' ||
          log.target === 'Oreo'
        ) && log.action === action;
      }
      return log.target === target && log.action === action;
    });
  };

  const formatTimeElapsed = (isoString) => {
    if (!isoString) return 'Nunca';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    return `hace ${diffDays} d`;
  };

  const getCareWarning = (log, maxHours) => {
    if (!log) return true;
    const diffMs = new Date() - new Date(log.timestamp);
    const diffHours = diffMs / 3600000;
    return diffHours >= maxHours;
  };

  const gerbilsWater = getLatestLog('Jerbos (Kalu & Lua)', 'Agua');
  const gerbilsFood = getLatestLog('Jerbos (Kalu & Lua)', 'Comida');
  const oreoWater = getLatestLog('Jerbo (Oreo)', 'Agua');
  const oreoFood = getLatestLog('Jerbo (Oreo)', 'Comida');
  const plantsWater = getLatestLog('Plantas Terraza', 'Riego');

  const gerbilsFoodWarning = getCareWarning(gerbilsFood, 24);
  const gerbilsWaterWarning = getCareWarning(gerbilsWater, 24);
  const oreoFoodWarning = oreoActive ? getCareWarning(oreoFood, 24) : false;
  const oreoWaterWarning = oreoActive ? getCareWarning(oreoWater, 24) : false;
  const plantsWaterWarning = getCareWarning(plantsWater, 72);

  const getUpcomingBirthdays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (birthdays || []).map(b => {
      if (!b.date) return null;
      const parts = b.date.split('-');
      if (parts.length < 3) return null;
      const birthYear = parseInt(parts[0]);
      const birthMonth = parseInt(parts[1]) - 1;
      const birthDay = parseInt(parts[2]);

      const nextBday = new Date(today.getFullYear(), birthMonth, birthDay);
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      
      const diffMs = nextBday.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { ...b, daysLeft, age: nextBday.getFullYear() - birthYear };
    })
    .filter(Boolean)
    .filter(b => b.daysLeft <= 15)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="dashboard-loading">
          <div className="dashboard-spinner" />
          <p>Cargando tu hogar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Saludo */}
      <div className="dashboard-greeting">
        <h2>{getGreeting(currentUser)}</h2>
        <p className="dashboard-date">{getTodayName()}</p>
      </div>

      {/* Cards resumen */}
      <div className="dashboard-cards">

        {/* Card Compras */}
        <button className="dash-card dash-card--shopping" onClick={() => onNavigate('shopping')}>
          <div className="dash-card-icon">🛒</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Compras</h3>
            {pendingItems === 0 ? (
              <p className="dash-card-ok">✅ Todo comprado</p>
            ) : (
              <p className="dash-card-count" style={{ fontSize: '1.05rem', color: 'var(--warning)', fontWeight: '600' }}>
                {pendingItems} artículo{pendingItems !== 1 ? 's' : ''} pendiente{pendingItems !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Tareas */}
        <button className="dash-card dash-card--tasks" onClick={() => onNavigate('tasks')}>
          <div className="dash-card-icon">📋</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Tareas</h3>
            {pendingTasks === 0 ? (
              <p className="dash-card-ok">✅ Sin tareas pendientes</p>
            ) : (
              <>
                <p className="dash-card-count">{pendingTasks} pendiente{pendingTasks !== 1 ? 's' : ''}</p>
                <ul className="dash-card-list">
                  {tasks.slice(0, 3).map(task => (
                    <li key={task.id}>• {task.text}</li>
                  ))}
                  {pendingTasks > 3 && <li className="dash-more">+{pendingTasks - 3} más...</li>}
                </ul>
              </>
            )}
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Planning Hoy */}
        <button className="dash-card dash-card--planning" onClick={() => onNavigate('planning')}>
          <div className="dash-card-icon">📅</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Plan de Hoy</h3>
            {todayPlan ? (
              <>
                {todayPlan.comida && <p className="dash-plan-item">☀️ <strong>Comida:</strong> {todayPlan.comida}</p>}
                {todayPlan.cena && <p className="dash-plan-item">🌙 <strong>Cena:</strong> {todayPlan.cena}</p>}
                {todayPlan.actividad && (
                  <p className="dash-plan-item">
                    ⚡ <strong>Tarea:</strong> {todayPlan.actividad} {todayPlan.actividadCompleted ? '✅' : '⏳'}
                  </p>
                )}
                {!todayPlan.comida && !todayPlan.cena && !todayPlan.actividad && (
                  <p className="dash-card-muted">Sin planificar aún</p>
                )}
              </>
            ) : (
              <p className="dash-card-muted">Sin planificar aún</p>
            )}
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Cuidados */}
        <button className="dash-card dash-card--care" onClick={() => onNavigate('care')}>
          <div className="dash-card-icon">🐹</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Cuidados</h3>
            <div className="dash-care-summary">
              <p className="dash-plan-item">
                🐹 <strong>Comida Jerbos:</strong>{' '}
                <span style={{ color: gerbilsFoodWarning ? 'var(--warning)' : 'var(--success)', fontWeight: '500' }}>
                  {formatTimeElapsed(gerbilsFood?.timestamp)}
                </span>
              </p>
              <p className="dash-plan-item">
                💧 <strong>Agua Jerbos:</strong>{' '}
                <span style={{ color: gerbilsWaterWarning ? 'var(--warning)' : 'var(--success)', fontWeight: '500' }}>
                  {formatTimeElapsed(gerbilsWater?.timestamp)}
                </span>
              </p>
              <p className="dash-plan-item" style={!oreoActive ? { opacity: 0.6 } : {}}>
                🐹 <strong>Comida Oreo:</strong>{' '}
                <span style={{ color: oreoActive ? (oreoFoodWarning ? 'var(--warning)' : 'var(--success)') : 'var(--text-muted)', fontWeight: '500' }}>
                  {oreoActive ? formatTimeElapsed(oreoFood?.timestamp) : 'Pausado'}
                </span>
              </p>
              <p className="dash-plan-item" style={!oreoActive ? { opacity: 0.6 } : {}}>
                💧 <strong>Agua Oreo:</strong>{' '}
                <span style={{ color: oreoActive ? (oreoWaterWarning ? 'var(--warning)' : 'var(--success)') : 'var(--text-muted)', fontWeight: '500' }}>
                  {oreoActive ? formatTimeElapsed(oreoWater?.timestamp) : 'Pausado'}
                </span>
              </p>
              <p className="dash-plan-item">
                🌱 <strong>Riego Plantas:</strong>{' '}
                <span style={{ color: plantsWaterWarning ? 'var(--warning)' : 'var(--success)', fontWeight: '500' }}>
                  {formatTimeElapsed(plantsWater?.timestamp)}
                </span>
              </p>
            </div>
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Garantías */}
        <button className="dash-card dash-card--warranties" onClick={() => onNavigate('warranties')} style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)' }}>
          <div className="dash-card-icon">📄</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Garantías y Vehículos</h3>
            {warranties.length === 0 ? (
              <p className="dash-card-muted">Sin garantías registradas</p>
            ) : (
              <p className="dash-card-count" style={{ fontSize: '1.05rem', color: '#60a5fa', fontWeight: '600' }}>
                {warranties.length} garantía{warranties.length !== 1 ? 's' : ''} activa{warranties.length !== 1 ? 's' : ''}
              </p>
            )}
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              Incluye libro de mantenimiento
            </span>
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Matrículas Minigame */}
        <button className="dash-card dash-card--plates" onClick={() => setShowPlatesModal(true)} style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(202, 138, 4, 0.08) 100%)' }}>
          <div className="dash-card-icon">🚗</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Minijuego: Matrículas</h3>
            <p className="dash-card-count" style={{ fontSize: '1.05rem', color: '#fb923c', fontWeight: '600' }}>
              {plates.filter(p => p.completed).length} / 10 vistas
            </p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              {plates.filter(p => p.completed).length === 10 ? '🎉 ¡Colección completada!' : 'Completa las secuencias repetidas'}
            </span>
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Cumpleaños */}
        <button className="dash-card dash-card--birthdays" onClick={() => onNavigate('planning', 'birthdays')} style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.08) 100%)' }}>
          <div className="dash-card-icon">🎂</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Cumpleaños</h3>
            {upcomingBirthdays.length === 0 ? (
              <p className="dash-card-ok" style={{ fontSize: '0.85rem' }}>✅ Sin cumpleaños cerca</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                {upcomingBirthdays.slice(0, 2).map(b => (
                  <p key={b.id} className="dash-plan-item" style={{ fontSize: '0.75rem', margin: 0 }}>
                    🎈 <strong>{b.name}:</strong> {b.daysLeft === 0 ? '¡Hoy! 🎂' : b.daysLeft === 1 ? 'Mañana ⏰' : `en ${b.daysLeft} d`} ({b.age}a)
                  </p>
                ))}
                {upcomingBirthdays.length > 2 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                    +{upcomingBirthdays.length - 2} más próximamente
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

        {/* Card Gimnasio Marbella & Personal Trainer */}
        <button
          className="dash-card dash-card--gym"
          onClick={() => onNavigate('gym')}
          style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)' }}
        >
          <div className="dash-card-icon">🏋️</div>
          <div className="dash-card-content">
            <h3 className="dash-card-title">Gimnasio Marbella</h3>
            <p className="dash-card-count" style={{ fontSize: '0.98rem', color: '#34d399', fontWeight: '700' }}>
              {(gymData.workouts || []).length} entreno{(gymData.workouts || []).length !== 1 ? 's' : ''} registrado{(gymData.workouts || []).length !== 1 ? 's' : ''}
            </p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              Personal Trainer · Rutinas, máquinas y peso
            </span>
          </div>
          <span className="dash-card-arrow">›</span>
        </button>

      </div>

      {/* Modal del Minijuego de Matrículas */}
      {showPlatesModal && (
        <div className="modal-overlay" onClick={() => setShowPlatesModal(false)} style={{ zIndex: 100 }}>
          <div 
            className="modal-content glass-card" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '550px', 
              width: '95%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              position: 'relative',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="modal-header" style={{ marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>
                <span>🚗</span> Minijuego: Matrículas
              </h2>
              <button 
                className="modal-close" 
                onClick={() => setShowPlatesModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  lineHeight: '1'
                }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Tacha las matrículas con secuencias repetidas que veáis por la calle (desde 0000XXX hasta 9999XXX). ¡El progreso se guarda para ambos!
            </p>

            {/* Grid de matrículas estilo español */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
              gap: '1rem', 
              marginBottom: '1rem' 
            }}>
              {plates.map((p) => {
                const parts = p.plate.split('XXX');
                const num = parts[0];
                
                return (
                  <div 
                    key={p.id}
                    onClick={() => handleTogglePlate(p.id)}
                    style={{
                      position: 'relative',
                      background: '#ffffff',
                      border: '2px solid #1e293b',
                      borderRadius: '6px',
                      padding: '0.35rem 0.5rem 0.35rem 1.6rem', // Espacio para la banda azul europea
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: p.completed 
                        ? 'none' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                      opacity: p.completed ? 0.45 : 1,
                      transform: p.completed ? 'scale(0.96)' : 'none'
                    }}
                    className="plate-card-hover"
                  >
                    {/* Banda Azul Europea (Estilo matrícula de España) */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '1.25rem',
                      background: '#003399',
                      borderTopLeftRadius: '4px',
                      borderBottomLeftRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      boxSizing: 'border-box'
                    }}>
                      {/* Corona de estrellas simplificada */}
                      <span style={{ color: '#ffcc00', fontSize: '0.4rem', lineHeight: 1 }}>✨</span>
                      {/* Letra E de España */}
                      <span style={{ color: '#ffffff', fontSize: '0.62rem', fontWeight: 'bold', fontFamily: 'sans-serif', lineHeight: 1 }}>E</span>
                    </div>

                    {/* Texto de la Matrícula */}
                    <div style={{ 
                      fontFamily: '"Courier New", Courier, monospace, sans-serif',
                      fontWeight: '900',
                      fontSize: '1.15rem',
                      color: '#1e293b',
                      letterSpacing: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: p.completed ? 'line-through' : 'none',
                      textDecorationColor: p.completed ? '#ef4444' : 'transparent',
                      textDecorationThickness: '3px'
                    }}>
                      <span>{num}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>XXX</span>
                    </div>

                    {/* Línea roja diagonal simulada para tachar visualmente si está completada */}
                    {p.completed && (
                      <div style={{
                        position: 'absolute',
                        width: '115%',
                        height: '3px',
                        background: '#ef4444',
                        transform: 'rotate(-10deg)',
                        pointerEvents: 'none',
                        boxShadow: '0 0 2px rgba(239, 68, 68, 0.5)'
                      }} />
                    )}

                    {/* Detalle de quién y cuándo */}
                    {p.completed && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-14px',
                        fontSize: '0.58rem',
                        color: '#94a3b8',
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        zIndex: 2,
                        border: '1px solid var(--glass-border)'
                      }}>
                        {p.completedBy === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}{' '}
                        {new Date(p.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Confetti / Animación de celebración si están todas las matrículas completadas */}
            {plates.filter(p => p.completed).length === 10 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.96)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '16px',
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '0.8rem', animation: 'bounce 1s infinite' }}>🏆</div>
                <h2 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                  ¡Colección Completada!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', marginBottom: '2rem', lineHeight: '1.5' }}>
                  ¡Espectacular! Habéis completado el minijuego avistando las 10 secuencias de matrículas especiales.
                </p>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/plates/reset', { method: 'POST' });
                      if (res.ok) {
                        const data = await res.json();
                        setPlates(data);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="btn-primario"
                  style={{ 
                    padding: '0.65rem 1.6rem', 
                    background: 'linear-gradient(135deg, #ea580c, #ca8a04)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reiniciar Colección
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
