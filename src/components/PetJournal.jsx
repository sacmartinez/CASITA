import React, { useState, useEffect } from 'react';

export default function PetJournal({ currentUser }) {
  const [pets, setPets] = useState(null);
  const [activePet, setActivePet] = useState('Kalu');
  const [loading, setLoading] = useState(true);

  // Formulario único de cuidados
  const [observation, setObservation] = useState('');
  const [weight, setWeight] = useState('');

  const petList = ['Kalu', 'Lua', 'Oreo'];
  const petEmojis = { Kalu: '🐹', Lua: '🐭', Oreo: '🐼' };

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch('/api/pets');
      if (res.ok) {
        const data = await res.json();
        setPets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCareRecord = async (e) => {
    e.preventDefault();
    if (!observation.trim()) return;

    try {
      const formattedNote = weight ? `Peso: ${weight}g` : '';
      
      // 1. Guardar la observación en el historial de cuidados (medicalLog en base de datos)
      const resMedical = await fetch(`/api/pets/${activePet}/medical`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: observation.trim(),
          note: formattedNote,
          addedBy: currentUser
        })
      });

      // 2. Si se ha especificado un peso, registrarlo también en el historial de pesos por separado
      if (weight) {
        await fetch(`/api/pets/${activePet}/weight`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight: parseFloat(weight) / 1000, // Lo convertimos a kg para la base de datos (ej: 75g -> 0.075kg)
            addedBy: currentUser
          })
        });
      }

      if (resMedical.ok) {
        setObservation('');
        setWeight('');
        fetchPets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAge = (bdayStr) => {
    if (!bdayStr) return 'Fecha de nacimiento sin registrar';
    const bday = new Date(bdayStr);
    const now = new Date();
    const diffMs = now - bday;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0) {
      const remMonths = diffMonths % 12;
      return `${diffYears} año${diffYears !== 1 ? 's' : ''}${remMonths > 0 ? ` y ${remMonths} mes${remMonths !== 1 ? 'es' : ''}` : ''}`;
    }
    if (diffMonths > 0) {
      return `${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    }
    return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  };

  if (loading || !pets) {
    return <div className="glass-card"><div className="empty-state"><span>Cargando diario de mascotas...</span></div></div>;
  }

  const currentPetData = pets[activePet] || { birthday: '', weightLog: [], medicalLog: [] };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">🐹</span>
          Diario de Mascotas
        </h2>
        <span className="card-subtitle">Historial de salud, cuidados y peso de Kalu, Lua y Oreo.</span>
      </div>

      {/* Selector de Mascota */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
        {petList.map(name => (
          <button
            key={name}
            onClick={() => setActivePet(name)}
            className={`tab-btn ${activePet === name ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              background: activePet === name ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{petEmojis[name]}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Info Mascota Seleccionada */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {petEmojis[activePet]} {activePet}
          </h3>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Categoría: <strong>Jerbo</strong>
          </p>
        </div>
        {currentPetData.birthday && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            🎂 {calculateAge(currentPetData.birthday)}
          </span>
        )}
      </div>

      {/* Registro de Cuidado */}
      <form onSubmit={handleAddCareRecord} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          📝 Nuevo Control o Cuidado
        </h4>
        
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Observación / Cuidados (ej: Limpieza de nido, dosis de antiparasitario...)"
            className="custom-input"
            style={{ flex: 2, fontSize: '0.8rem', minWidth: '220px' }}
            maxLength={100}
            required
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Peso en gramos (opcional)..."
            min="1"
            max="1000"
            className="custom-input"
            style={{ flex: 1, fontSize: '0.8rem', minWidth: '120px' }}
          />
        </div>
        
        <button type="submit" className="btn-primario" style={{ alignSelf: 'flex-end', padding: '0.45rem 1.2rem', fontSize: '0.78rem' }}>
          💾 Registrar Cuidado
        </button>
      </form>

      {/* Historial de Observaciones/Cuidados */}
      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
        📅 Historial de Observaciones y Cuidados
      </h4>

      {currentPetData.medicalLog.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 0' }}>
          <span style={{ fontSize: '1.5rem' }}>📋</span>
          <span>Sin observaciones</span>
          <span className="card-subtitle">Registra el primer cuidado o control arriba.</span>
        </div>
      ) : (
        <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px' }}>
          {currentPetData.medicalLog.map((log, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: '0.75rem', 
                background: 'rgba(255,255,255,0.015)', 
                border: '1px solid rgba(255,255,255,0.04)', 
                borderRadius: '10px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 500 }}>{log.title}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Registrado por <strong>{log.addedBy || 'Casa'}</strong>
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {new Date(log.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
                {log.note && (
                  <span style={{ 
                    fontSize: '0.72rem', 
                    padding: '0.15rem 0.4rem', 
                    borderRadius: '6px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    border: '1px solid rgba(16, 185, 129, 0.2)', 
                    color: '#34d399',
                    fontWeight: 700 
                  }}>
                    ⚖️ {log.note.replace('Peso: ', '')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
