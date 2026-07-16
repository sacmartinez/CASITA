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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [shopRes, taskRes, careRes, planRes] = await Promise.all([
          fetch(`${API_BASE}/shopping`),
          fetch(`${API_BASE}/tasks`),
          fetch(`${API_BASE}/care`),
          fetch(`${API_BASE}/planning`),
        ]);
        setShopping(await shopRes.json());
        setTasks(await taskRes.json());
        setCare(await careRes.json());
        setPlanning(await planRes.json());
      } catch (e) {
        console.error('Error cargando datos del dashboard', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
      if (target === 'Jerbos (Kalu & Lua)') {
        return (log.target === 'Jerbos (Kalu & Lua)' || log.target === 'Kalu' || log.target === 'Lua') && log.action === action;
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
  const oreoFoodWarning = getCareWarning(oreoFood, 24);
  const oreoWaterWarning = getCareWarning(oreoWater, 24);
  const plantsWaterWarning = getCareWarning(plantsWater, 72);

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
              <p className="dash-plan-item">
                🐹 <strong>Comida Oreo:</strong>{' '}
                <span style={{ color: oreoFoodWarning ? 'var(--warning)' : 'var(--success)', fontWeight: '500' }}>
                  {formatTimeElapsed(oreoFood?.timestamp)}
                </span>
              </p>
              <p className="dash-plan-item">
                💧 <strong>Agua Oreo:</strong>{' '}
                <span style={{ color: oreoWaterWarning ? 'var(--warning)' : 'var(--success)', fontWeight: '500' }}>
                  {formatTimeElapsed(oreoWater?.timestamp)}
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

      </div>
    </div>
  );
}

export default Dashboard;
