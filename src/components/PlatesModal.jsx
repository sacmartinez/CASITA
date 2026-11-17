import React from 'react';

export default function PlatesModal({ isOpen, onClose, plates, onTogglePlate, currentUser, onReset }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
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
          background: 'rgba(15, 23, 42, 0.92)', 
          backdropFilter: 'blur(20px)' 
        }}
      >
        <div className="modal-header" style={{ marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>
            <span>🚗</span> Minijuego: Matrículas
          </h2>
          <button 
            className="modal-close" 
            onClick={onClose} 
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
                onClick={() => onTogglePlate(p.id)}
                style={{
                  position: 'relative',
                  background: '#ffffff',
                  border: '2px solid #1e293b',
                  borderRadius: '6px',
                  padding: '0.35rem 0.5rem 0.35rem 1.6rem',
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
                {/* Banda Azul Europea */}
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
                  <span style={{ color: '#ffcc00', fontSize: '0.4rem', lineHeight: 1 }}>✨</span>
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

                {p.completed && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-14px',
                    fontSize: '0.58rem',
                    color: '#94a3b8',
                    background: 'rgba(15, 23, 42, 0.95)',
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
              onClick={onReset}
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
  );
}
