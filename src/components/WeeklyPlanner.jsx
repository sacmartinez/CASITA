import React, { useState, useEffect } from 'react';

export default function WeeklyPlanner({ currentUser }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null); // Para mostrar un indicador visual de guardado

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      const res = await fetch('/api/planning');
      if (res.ok) {
        const data = await res.json();
        setDays(data);
      }
    } catch (err) {
      console.error('Error al cargar la planificación semanal:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar los cambios de un día al perder el foco (onBlur) o presionar Enter
  const handleFieldSave = async (dayId, comidaVal, cenaVal, actividadVal) => {
    setSavingId(dayId);
    try {
      const res = await fetch(`/api/planning/${dayId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comida: comidaVal,
          cena: cenaVal,
          actividad: actividadVal,
          updatedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedDay = await res.json();
        setDays(prev => prev.map(d => d.dayId === dayId ? updatedDay : d));
      }
    } catch (err) {
      console.error('Error al guardar el día:', err);
    } finally {
      // Pequeño retardo visual para simular el guardado
      setTimeout(() => setSavingId(null), 400);
    }
  };

  // Guardado rápido al presionar Enter en un input
  const handleKeyDown = (e, dayId, comidaVal, cenaVal, actividadVal) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Esto dispara automáticamente el evento onBlur
    }
  };

  // Actualización del estado local de los inputs (mientras escriben)
  const handleInputChange = (dayId, field, val) => {
    setDays(prev => prev.map(d => d.dayId === dayId ? { ...d, [field]: val } : d));
  };

  // Completar o desmarcar la actividad del día
  const handleToggleActivity = async (dayId, currentCompleted) => {
    try {
      const nextCompleted = !currentCompleted;
      const res = await fetch(`/api/planning/${dayId}/complete-activity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: nextCompleted,
          completedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedDay = await res.json();
        setDays(prev => prev.map(d => d.dayId === dayId ? updatedDay : d));
        // Si hay una función en el contexto para recargar el historial global, se podría llamar aquí,
        // pero dado que el componente TaskManager se recargará solo al cambiar de pestaña o refrescar, 
        // se actualizará de forma natural.
      }
    } catch (err) {
      console.error('Error al cambiar estado de actividad del plan:', err);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">📅</span>
          Planificación Semanal
        </h2>
        <span className="card-subtitle" style={{ fontSize: '0.8rem' }}>
          * Los cambios se guardan solos al hacer clic fuera o presionar Enter.
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          <span>Cargando planning semanal...</span>
        </div>
      ) : (
        <div className="planner-weekly-grid">
          {days.map((day) => (
            <div 
              key={day.dayId} 
              className={`planner-day-card ${savingId === day.dayId ? 'saving' : ''}`}
            >
              <div className="planner-day-header">
                <span className="planner-day-name">{day.dayName}</span>
                {savingId === day.dayId && <span className="planner-saving-indicator">💾</span>}
              </div>

              <div className="planner-day-body">
                {/* COMIDA */}
                <div className="planner-input-wrapper">
                  <label className="planner-label">☀️ Almuerzo / Comida</label>
                  <input
                    type="text"
                    value={day.comida || ''}
                    onChange={(e) => handleInputChange(day.dayId, 'comida', e.target.value)}
                    onBlur={() => handleFieldSave(day.dayId, day.comida, day.cena, day.actividad)}
                    onKeyDown={(e) => handleKeyDown(e, day.dayId, day.comida, day.cena, day.actividad)}
                    placeholder="¿Qué comemos?"
                    className="planner-input"
                    maxLength={50}
                  />
                </div>

                {/* CENA */}
                <div className="planner-input-wrapper">
                  <label className="planner-label">🌙 Cena</label>
                  <input
                    type="text"
                    value={day.cena || ''}
                    onChange={(e) => handleInputChange(day.dayId, 'cena', e.target.value)}
                    onBlur={() => handleFieldSave(day.dayId, day.comida, day.cena, day.actividad)}
                    onKeyDown={(e) => handleKeyDown(e, day.dayId, day.comida, day.cena, day.actividad)}
                    placeholder="¿Qué cenamos?"
                    className="planner-input"
                    maxLength={50}
                  />
                </div>

                {/* ACTIVIDAD / TAREA DEL DÍA */}
                <div className="planner-input-wrapper" style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.6rem' }}>
                  <label className="planner-label">✨ Actividad o Tarea</label>
                  <input
                    type="text"
                    value={day.actividad || ''}
                    onChange={(e) => handleInputChange(day.dayId, 'actividad', e.target.value)}
                    onBlur={() => handleFieldSave(day.dayId, day.comida, day.cena, day.actividad)}
                    onKeyDown={(e) => handleKeyDown(e, day.dayId, day.comida, day.cena, day.actividad)}
                    placeholder="Ej: Regar plantas terraza"
                    className="planner-input"
                    maxLength={60}
                    disabled={day.actividadCompleted}
                  />
                  
                  {/* Mostrar Checkbox de Actividad si hay texto escrito */}
                  {day.actividad && day.actividad.trim() !== '' && (
                    <div 
                      className={`planner-activity-status ${day.actividadCompleted ? 'completed' : ''}`}
                      onClick={() => handleToggleActivity(day.dayId, day.actividadCompleted)}
                    >
                      <div className="planner-checkbox" />
                      <span className="planner-checkbox-label">
                        {day.actividadCompleted 
                          ? `Hecha por: ${day.actividadCompletedBy}` 
                          : 'Marcar como hecha'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pie con metadatos */}
              {day.updatedBy && (
                <div className="planner-day-footer">
                  Edita: {day.updatedBy} ({new Date(day.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
