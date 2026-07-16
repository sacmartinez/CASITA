import React, { useState, useEffect } from 'react';

export default function MaintenanceLog({ currentUser }) {
  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/maintenance');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          addedBy: currentUser
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">🔧</span>
          Bitácora de la Casa
        </h2>
        <span className="card-subtitle">Registro de mantenimientos, reparaciones y mejoras en el hogar.</span>
      </div>

      {/* Creador de registros */}
      <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué has hecho en casa? (ej: Limpieza de caldera, pintura del salón...)"
          className="custom-input"
          style={{ fontSize: '0.85rem' }}
          maxLength={60}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notas adicionales o detalles sobre el trabajo realizado (opcional)..."
          className="custom-input"
          rows={2}
          style={{ fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }}
          maxLength={200}
        />
        <button type="submit" className="btn-primario" style={{ alignSelf: 'flex-end', padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}>
          💾 Registrar Trabajo
        </button>
      </form>

      {/* Línea temporal */}
      <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>Historial del Hogar</h3>

      {loading ? (
        <div className="empty-state"><span>Cargando bitácora...</span></div>
      ) : logs.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 0' }}>
          <span style={{ fontSize: '1.5rem' }}>🏡</span>
          <span>Bitácora vacía</span>
          <span className="card-subtitle">Ningún mantenimiento guardado todavía.</span>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '1.2rem', borderLeft: '2px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1.2rem', margin: '0.5rem 0 0.5rem 0.5rem' }}>
          {logs.slice().reverse().map((log) => (
            <div key={log.id} style={{ position: 'relative' }}>
              {/* Punto circular en la línea temporal */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: 'calc(-1.2rem - 6px)', 
                  top: '4px',
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  boxShadow: '0 0 6px var(--primary)',
                  border: '2px solid #1c1d22'
                }} 
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{log.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    📅 {new Date(log.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Registrado por <strong>{log.addedBy}</strong>
                </span>
                {log.description && (
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                    {log.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
