import React, { useState, useEffect } from 'react';

function BirthdayManager() {
  const [birthdays, setBirthdays] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBirthdays = async () => {
    try {
      const res = await fetch('/api/birthdays');
      if (res.ok) {
        setBirthdays(await res.json());
      }
    } catch (e) {
      console.error('Error al cargar cumpleaños:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !date) return;
    try {
      const res = await fetch('/api/birthdays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, notes })
      });
      if (res.ok) {
        setName('');
        setDate('');
        setNotes('');
        setBirthdays(await res.json());
      }
    } catch (err) {
      console.error('Error al añadir cumpleaños:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este cumpleaños?')) return;
    try {
      const res = await fetch(`/api/birthdays/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBirthdays(await res.json());
      }
    } catch (err) {
      console.error('Error al borrar cumpleaños:', err);
    }
  };

  const getBirthdayInfo = (dateStr) => {
    if (!dateStr) return { daysLeft: 999, age: 0, label: '', type: 'future', formattedDate: '' };
    const parts = dateStr.split('-');
    if (parts.length < 3) return { daysLeft: 999, age: 0, label: '', type: 'future', formattedDate: '' };
    const birthYear = parseInt(parts[0]);
    const birthMonth = parseInt(parts[1]) - 1;
    const birthDay = parseInt(parts[2]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextBday = new Date(today.getFullYear(), birthMonth, birthDay);
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffMs = nextBday.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const age = nextBday.getFullYear() - birthYear;

    let label = '';
    let type = 'future'; // 'today' | 'tomorrow' | 'soon' | 'future'
    if (daysLeft === 0 || daysLeft === 365) {
      label = '¡Hoy! 🎂';
      type = 'today';
    } else if (daysLeft === 1) {
      label = 'Mañana ⏰';
      type = 'tomorrow';
    } else if (daysLeft <= 7) {
      label = `En ${daysLeft} días ⚡`;
      type = 'soon';
    } else if (daysLeft <= 30) {
      label = `En ${daysLeft} días`;
      type = 'soon';
    } else {
      const months = Math.floor(daysLeft / 30);
      if (months === 1) {
        label = 'En 1 mes';
      } else {
        label = `En ${months} meses`;
      }
    }

    const formattedDate = `${String(birthDay).padStart(2, '0')}/${String(birthMonth + 1).padStart(2, '0')}`;
    return { daysLeft, age, label, type, formattedDate };
  };

  // Procesar y ordenar cumpleaños
  const processedBirthdays = birthdays.map(b => ({
    ...b,
    info: getBirthdayInfo(b.date)
  })).sort((a, b) => a.info.daysLeft - b.info.daysLeft);

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">🎂</span>
          Gestor de Cumpleaños
        </h2>
        <span className="card-subtitle">Registra cumpleaños importantes y recibe avisos con antelación.</span>
      </div>

      {/* Formulario de Registro */}
      <form onSubmit={handleAdd} style={{
        background: 'rgba(255, 255, 255, 0.01)',
        padding: '1.2rem',
        borderRadius: '16px',
        border: '1px solid var(--glass-border)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          ➕ Añadir Cumpleaños
        </h3>
        
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nombre de la persona..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="custom-input"
            style={{ flex: '1.5', minWidth: '180px', fontSize: '0.8rem' }}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="custom-input"
            style={{ flex: '1', minWidth: '140px', fontSize: '0.8rem' }}
            required
          />
          <input
            type="text"
            placeholder="Notas (ideas de regalo, detalles...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="custom-input"
            style={{ flex: '2', minWidth: '220px', fontSize: '0.8rem' }}
          />
          <button
            type="submit"
            className="btn-primario"
            style={{
              padding: '0.5rem 1.2rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Añadir
          </button>
        </div>
      </form>

      {/* Listado de Cumpleaños */}
      <div>
        <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>Cumpleaños Registrados</h3>
        
        {loading ? (
          <div className="empty-state">
            <span>Cargando cumpleaños...</span>
          </div>
        ) : processedBirthdays.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <span>No hay ningún cumpleaños registrado todavía.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {processedBirthdays.map((b) => {
              const { daysLeft, age, label, type, formattedDate } = b.info;
              
              // Estilos según cercanía
              const badgeStyle = {
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              };

              if (type === 'today') {
                badgeStyle.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                badgeStyle.color = '#f87171';
                badgeStyle.border = '1px solid rgba(239, 68, 68, 0.3)';
              } else if (type === 'tomorrow') {
                badgeStyle.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                badgeStyle.color = '#fbbf24';
                badgeStyle.border = '1px solid rgba(245, 158, 11, 0.3)';
              } else if (type === 'soon') {
                badgeStyle.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                badgeStyle.color = '#34d399';
                badgeStyle.border = '1px solid rgba(16, 185, 129, 0.3)';
              } else {
                badgeStyle.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                badgeStyle.color = 'var(--text-muted)';
                badgeStyle.border = '1px solid var(--glass-border)';
              }

              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: type === 'today' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: type === 'today' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)',
                    transition: 'all 0.2s',
                    flexWrap: 'wrap',
                    gap: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: '150px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{type === 'today' ? '🥳' : '👤'}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>{b.name}</h4>
                      <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Fecha: <strong>{formattedDate}</strong> • Cumple <strong>{age} años</strong>
                      </p>
                    </div>
                  </div>

                  {/* Notas */}
                  <div style={{ flex: 1, minWidth: '180px', fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {b.notes ? `💡 ${b.notes}` : <span style={{ opacity: 0.3 }}>Sin notas de regalo</span>}
                  </div>

                  {/* Badge y Botones */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={badgeStyle}>{label}</span>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(239, 68, 68, 0.6)',
                        cursor: 'pointer',
                        padding: '0.3rem',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                      }}
                      title="Eliminar cumpleaños"
                    >
                      🗑️
                    </button>
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

export default BirthdayManager;
