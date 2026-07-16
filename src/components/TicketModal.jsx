import React, { useState } from 'react';

export default function TicketModal({ isOpen, onClose, currentUser }) {
  const [type, setType] = useState('bug'); // 'bug' | 'feature'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          description,
          reportedBy: currentUser
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setTitle('');
          setDescription('');
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error al enviar ticket:', err);
      alert('Error de conexión al enviar el ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', width: '90%' }}>
        <div className="modal-header" style={{ marginBottom: '1.2rem' }}>
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem' }}>
            <span>🛠️</span> Reportar Bug / Función
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">&times;</button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <span style={{ fontSize: '3rem' }}>🎉</span>
            <h3 style={{ color: 'var(--success)', marginTop: '1rem', fontSize: '1.1rem' }}>¡Ticket enviado con éxito!</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.5rem' }}>Se ha enviado una notificación push al otro móvil.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Tipo de Ticket</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setType('bug')}
                  className={`btn-filter ${type === 'bug' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  🐛 Reportar Bug
                </button>
                <button
                  type="button"
                  onClick={() => setType('feature')}
                  className={`btn-filter ${type === 'feature' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  💡 Proponer Función
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ticket-title" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Título</label>
              <input
                id="ticket-title"
                type="text"
                placeholder="Ej. La campana de aviso no vibra en mi móvil"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="custom-input"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ticket-desc" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Descripción / Detalles</label>
              <textarea
                id="ticket-desc"
                placeholder="Describe los pasos del error o qué te gustaría añadir..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="custom-input"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secundario"
                style={{ flex: 1, padding: '0.6rem' }}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primario"
                style={{ flex: 1, padding: '0.6rem' }}
                disabled={submitting || !title.trim()}
              >
                {submitting ? 'Enviando...' : 'Enviar Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
