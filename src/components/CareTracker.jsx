import React, { useState, useEffect } from 'react';

export default function CareTracker({ currentUser }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/care');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error al cargar logs de cuidado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogCare = async (target, action) => {
    try {
      const res = await fetch('/api/care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          action,
          performedBy: currentUser
        })
      });

      if (res.ok) {
        fetchLogs();
      }
    } catch (err) {
      console.error('Error al registrar cuidado:', err);
    }
  };

  // Helper to find the latest action log
  const getLatestLog = (target, action) => {
    // Para retrocompatibilidad si hubiese registros anteriores de 'Kalu' o 'Lua',
    // buscamos por el nuevo target 'Jerbos (Kalu & Lua)' o los antiguos 'Kalu' / 'Lua'.
    return logs.find(log => {
      if (target === 'Jerbos (Kalu & Lua)') {
        return (log.target === 'Jerbos (Kalu & Lua)' || log.target === 'Kalu' || log.target === 'Lua') && log.action === action;
      }
      return log.target === target && log.action === action;
    });
  };

  // Helper to format date nicely
  const formatTime = (isoString) => {
    if (!isoString) return { text: 'Nunca', warning: true, hours: 999 };
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return { text: 'Hace un momento', hours: 0 };
    if (diffMins < 60) return { text: `Hace ${diffMins} min`, hours: diffHours };
    if (diffHours < 24) return { text: `Hace ${diffHours} h`, hours: diffHours };
    return { text: `Hace ${diffDays} d`, hours: diffHours };
  };

  // Status check for alerts
  const getStatus = (latestLog, maxHours = 24) => {
    if (!latestLog) return { label: 'Pendiente', type: 'warning' };
    const timeInfo = formatTime(latestLog.timestamp);
    if (timeInfo.hours >= maxHours) {
      return { label: `¡Hace ${Math.floor(timeInfo.hours)}h!`, type: 'warning' };
    }
    return { label: 'OK', type: 'good' };
  };

  // Jerbos logs
  const gerbilsWater = getLatestLog('Jerbos (Kalu & Lua)', 'Agua');
  const gerbilsFood = getLatestLog('Jerbos (Kalu & Lua)', 'Comida');
  // Oreo logs
  const oreoWater = getLatestLog('Jerbo (Oreo)', 'Agua');
  const oreoFood = getLatestLog('Jerbo (Oreo)', 'Comida');
  // Plant logs
  const plantsWater = getLatestLog('Plantas Terraza', 'Riego');

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">🐹</span>
          Cuidado de Mascotas y Plantas
        </h2>
      </div>

      <div className="care-grid">
        
        {/* SECCIÓN JERBOS (UNIFICADA) */}
        <div className="care-section">
          <div className="care-section-title">
            <span>🐹</span> Jerbos (Kalu & Lua)
          </div>
          <div className="care-buttons">
            <button 
              onClick={() => handleLogCare('Jerbos (Kalu & Lua)', 'Agua')}
              className="btn-care agua"
              title="Registrar que has cambiado el agua a Kalu y Lua"
            >
              <span className="btn-care-icon">💧</span>
              <span>Cambiar Agua</span>
            </button>
            <button 
              onClick={() => handleLogCare('Jerbos (Kalu & Lua)', 'Comida')}
              className="btn-care comida"
              title="Registrar que has puesto comida a Kalu y Lua"
            >
              <span className="btn-care-icon">🌾</span>
              <span>Echar Comida</span>
            </button>
          </div>
          
          <div className="care-status">
            <div className="status-row">
              <span>Agua:</span>
              <span className="status-value">
                {gerbilsWater ? `${formatTime(gerbilsWater.timestamp).text} (${gerbilsWater.performedBy})` : 'Sin registro'}
              </span>
              <span className={`status-alert ${getStatus(gerbilsWater, 24).type}`}>
                {getStatus(gerbilsWater, 24).label}
              </span>
            </div>
            <div className="status-row">
              <span>Comida:</span>
              <span className="status-value">
                {gerbilsFood ? `${formatTime(gerbilsFood.timestamp).text} (${gerbilsFood.performedBy})` : 'Sin registro'}
              </span>
              <span className={`status-alert ${getStatus(gerbilsFood, 24).type}`}>
                {getStatus(gerbilsFood, 24).label}
              </span>
            </div>
          </div>
        </div>

        {/* SECCIÓN JERBO OREO (VACACIONAL) */}
        <div className="care-section">
          <div className="care-section-title">
            <span>🐹</span> Jerbo (Oreo) <small style={{ fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8 }}>(Vacacional)</small>
          </div>
          <div className="care-buttons">
            <button 
              onClick={() => handleLogCare('Jerbo (Oreo)', 'Agua')}
              className="btn-care agua"
              title="Registrar que has cambiado el agua a Oreo"
            >
              <span className="btn-care-icon">💧</span>
              <span>Cambiar Agua</span>
            </button>
            <button 
              onClick={() => handleLogCare('Jerbo (Oreo)', 'Comida')}
              className="btn-care comida"
              title="Registrar que has puesto comida a Oreo"
            >
              <span className="btn-care-icon">🌾</span>
              <span>Echar Comida</span>
            </button>
          </div>
          
          <div className="care-status">
            <div className="status-row">
              <span>Agua:</span>
              <span className="status-value">
                {oreoWater ? `${formatTime(oreoWater.timestamp).text} (${oreoWater.performedBy})` : 'Sin registro'}
              </span>
              <span className={`status-alert ${getStatus(oreoWater, 24).type}`}>
                {getStatus(oreoWater, 24).label}
              </span>
            </div>
            <div className="status-row">
              <span>Comida:</span>
              <span className="status-value">
                {oreoFood ? `${formatTime(oreoFood.timestamp).text} (${oreoFood.performedBy})` : 'Sin registro'}
              </span>
              <span className={`status-alert ${getStatus(oreoFood, 24).type}`}>
                {getStatus(oreoFood, 24).label}
              </span>
            </div>
          </div>
        </div>

        {/* SECCIÓN PLANTAS TERRAZA */}
        <div className="care-section">
          <div className="care-section-title">
            <span>🪴</span> Plantas Terraza
          </div>
          <div className="care-buttons single">
            <button 
              onClick={() => handleLogCare('Plantas Terraza', 'Riego')}
              className="btn-care riego"
              title="Registrar que has regado las plantas de la terraza"
            >
              <span className="btn-care-icon">🚿</span>
              <span>Regar Plantas</span>
            </button>
          </div>
          
          <div className="care-status">
            <div className="status-row">
              <span>Riego:</span>
              <span className="status-value">
                {plantsWater ? `${formatTime(plantsWater.timestamp).text} (${plantsWater.performedBy})` : 'Sin registro'}
              </span>
              <span className={`status-alert ${getStatus(plantsWater, 72).type}`}>
                {getStatus(plantsWater, 72).label}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Historial Reciente de Cuidados */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Historial de Cuidados</h3>
        {loading ? (
          <div className="empty-state" style={{ padding: '0.5rem 0' }}>
            <span>Cargando historial...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state" style={{ padding: '0.5rem 0' }}>
            <span>No hay registros aún.</span>
          </div>
        ) : (
          <div className="history-list" style={{ maxHeight: '180px' }}>
            {logs.slice(0, 15).map((log) => {
              const displayTarget = log.target === 'Kalu' || log.target === 'Lua' ? 'Jerbos (Kalu & Lua)' : log.target;
              return (
                <div key={log.id} className="history-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{displayTarget === 'Plantas Terraza' ? '🪴' : '🐹'}</span>
                    <span className="history-text" style={{ fontWeight: 500 }}>
                      {displayTarget}: {log.action === 'Riego' ? 'Regado' : log.action === 'Agua' ? 'Agua cambiada' : 'Comida puesta'}
                    </span>
                  </div>
                  <div className="history-item-meta">
                    <span className={`history-tag ${log.performedBy.toLowerCase()}`}>
                      {log.performedBy}
                    </span>
                    <div>{formatTime(log.timestamp).text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
