import React, { useState, useEffect } from 'react';
import BirthdayManager from './BirthdayManager';

export default function CalendarEventsApp({ currentUser }) {
  const [subTab, setSubTab] = useState('events'); // 'events' | 'birthdays'
  const [planning, setPlanning] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      const res = await fetch('/api/planning');
      if (res.ok) {
        setPlanning(await res.json());
      }
    } catch (e) {
      console.error('Error cargando eventos:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', padding: '1.25rem' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📅</span>
            <span>Calendario &amp; Eventos</span>
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Citas compartidas, planes especiales y cumpleaños
          </p>
        </div>

        {/* Sub-selector */}
        <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <button
            onClick={() => setSubTab('events')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: subTab === 'events' ? 'var(--primary)' : 'transparent',
              color: '#fff',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🗓️ Actividades
          </button>
          <button
            onClick={() => setSubTab('birthdays')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: subTab === 'birthdays' ? 'var(--primary)' : 'transparent',
              color: '#fff',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🎂 Cumpleaños
          </button>
        </div>
      </div>

      {subTab === 'birthdays' ? (
        <BirthdayManager />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
            Próximas Actividades Registradas en la Semana
          </span>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando eventos...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {planning.map((d) => {
                const dayName = new Date(d.dayId + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
                const hasAct = d.actividad && d.actividad.trim().length > 0;
                return (
                  <div
                    key={d.dayId}
                    style={{
                      background: hasAct ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: hasAct ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#fff', textTransform: 'capitalize' }}>
                        {dayName}
                      </span>
                      {hasAct && <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>Plan</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: hasAct ? '#93c5fd' : 'var(--text-muted)', fontStyle: hasAct ? 'normal' : 'italic' }}>
                      {hasAct ? d.actividad : 'Sin eventos programados'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
