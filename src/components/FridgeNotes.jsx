import React, { useState, useEffect } from 'react';

export default function FridgeNotes({ currentUser }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [color, setColor] = useState('yellow'); // yellow, green, pink, blue
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), color, addedBy: currentUser })
      });

      if (res.ok) {
        const newNote = await res.json();
        setNotes(prev => [...prev, newNote]);
        setText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const colorsMap = {
    yellow: { bg: '#fff9a6', text: '#5c4e00', border: '#e6db55' },
    green: { bg: '#c8f7c5', text: '#1b4a18', border: '#9ce097' },
    pink: { bg: '#ffc6ff', text: '#5c005c', border: '#f39eff' },
    blue: { bg: '#a0e7e5', text: '#004a48', border: '#70dbd8' }
  };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">📝</span>
          Nevera Virtual
        </h2>
        <span className="card-subtitle">Dejad notas rápidas en la puerta de la nevera.</span>
      </div>

      {/* Selector y Creador */}
      <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={100}
          placeholder="Escribe una nota rápida... (ej: He dejado las llaves puestas)"
          className="custom-input"
          style={{ width: '100%' }}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color:</span>
            {Object.keys(colorsMap).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: colorsMap[c].bg,
                  border: color === c ? '2px solid #ffffff' : `1px solid ${colorsMap[c].border}`,
                  cursor: 'pointer',
                  transform: color === c ? 'scale(1.15)' : 'none',
                  transition: 'all 0.1s'
                }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <button type="submit" className="btn-primario" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            📌 Pegar Nota
          </button>
        </div>
      </form>

      {/* Puerta de Nevera */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1e2022 0%, #151618 100%)', 
          minHeight: '250px', 
          borderRadius: '16px', 
          padding: '1.2rem', 
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          alignContent: 'flex-start'
        }}
      >
        {loading ? (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 'auto' }}>Limpiando nevera...</span>
        ) : notes.length === 0 ? (
          <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.3)' }}>
            <span style={{ fontSize: '2.5rem' }}>❄️</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Puerta de la nevera despejada</span>
          </div>
        ) : (
          notes.map((note, index) => {
            const styles = colorsMap[note.color] || colorsMap.yellow;
            const rotations = ['-2deg', '3deg', '-1deg', '2deg', '-3deg'];
            const rot = rotations[index % rotations.length];
            return (
              <div
                key={note.id}
                style={{
                  width: '140px',
                  minHeight: '140px',
                  background: styles.bg,
                  color: styles.text,
                  padding: '1rem 0.8rem 0.8rem 0.8rem',
                  borderRadius: '1px',
                  boxShadow: '3px 6px 12px rgba(0,0,0,0.3)',
                  transform: `rotate(${rot})`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  borderTop: `1px solid ${styles.border}`
                }}
              >
                {/* Imán en la parte superior central */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #f34235 0%, #b71c1c 80%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }} 
                />

                <p 
                  style={{ 
                    fontSize: '0.82rem', 
                    margin: 0, 
                    lineHeight: '1.3', 
                    wordBreak: 'break-word',
                    fontFamily: 'Comic Sans MS, Chalkboard SE, sans-serif', 
                    fontWeight: 600,
                    paddingTop: '0.4rem'
                  }}
                >
                  {note.text}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: `1px solid rgba(0,0,0,0.06)`, paddingTop: '0.3rem' }}>
                  <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 700, textTransform: 'uppercase' }}>
                    {note.addedBy}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      opacity: 0.6,
                      padding: '0 0.1rem',
                      color: '#b71c1c',
                      transition: 'opacity 0.2s'
                    }}
                    title="Quitar de la nevera"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
