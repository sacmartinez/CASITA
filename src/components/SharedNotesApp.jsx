import React, { useState, useEffect } from 'react';

export default function SharedNotesApp({ currentUser }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState('yellow'); // yellow, purple, green, blue, rose
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error al cargar notas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          color,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes(prev => [newNote, ...prev]);
        setText('');
      }
    } catch (err) {
      console.error('Error al crear nota:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar nota:', err);
    }
  };

  const colorPalettes = {
    yellow: { bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.35)', badge: '#eab308' },
    purple: { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', badge: '#a855f7' },
    green: { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.35)', badge: '#22c55e' },
    blue: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.35)', badge: '#3b82f6' },
    rose: { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', badge: '#f43f5e' }
  };

  const filteredNotes = notes.filter(n => 
    !search.trim() || (n.text && n.text.toLowerCase().includes(search.toLowerCase())) || (n.addedBy && n.addedBy.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', width: '100%', padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <span>📝</span>
            <span>Notas Compartidas</span>
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Ideas, recordatorios y notas rápidas sincronizadas entre Ismael &amp; Sandra
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '12px', color: 'var(--text-muted)' }}>
          {notes.length} notas
        </span>
      </div>

      {/* Editor para nueva nota */}
      <form onSubmit={handleAddNote} style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <textarea
          rows={3}
          placeholder="Escribe una nota rápida, lista de cosas para casa o idea..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '0.75rem',
            color: '#fff',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Selector de color */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>Color:</span>
            {Object.keys(colorPalettes).map((cKey) => (
              <button
                type="button"
                key={cKey}
                onClick={() => setColor(cKey)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: colorPalettes[cKey].badge,
                  border: color === cKey ? '2px solid #ffffff' : 'none',
                  cursor: 'pointer',
                  transform: color === cKey ? 'scale(1.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="btn-primario"
            style={{
              padding: '0.45rem 1.2rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              opacity: !text.trim() || submitting ? 0.5 : 1
            }}
          >
            {submitting ? 'Guardando...' : '➕ Guardar Nota'}
          </button>
        </div>
      </form>

      {/* Buscador de notas */}
      {notes.length > 3 && (
        <div style={{ marginBottom: '1.2rem' }}>
          <input
            type="text"
            placeholder="🔍 Buscar en las notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '0.5rem 0.8rem',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* Grid de Notas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Cargando notas...</div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
          <span style={{ fontSize: '2rem' }}>📝</span>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {search ? 'No se encontraron notas con esa búsqueda' : 'No hay notas aún. ¡Escribe la primera arriba!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {filteredNotes.map((note) => {
            const palette = colorPalettes[note.color] || colorPalettes.yellow;
            return (
              <div
                key={note.id}
                style={{
                  background: palette.bg,
                  border: `1px solid ${palette.border}`,
                  borderRadius: '14px',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem',
                  position: 'relative',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                  {note.text}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>{note.addedBy === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}</span>
                  </span>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      padding: '2px 4px'
                    }}
                    title="Eliminar nota"
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
  );
}
