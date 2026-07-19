import React, { useState, useEffect } from 'react';

// Función para comprimir imágenes del lado del cliente
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_width = 1000; // Ancho máximo
        let width = img.width;
        let height = img.height;

        if (width > max_width) {
          height = Math.round((height * max_width) / width);
          width = max_width;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprimir a JPEG con calidad 0.6 (~100KB)
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function WarrantiesManager({ currentUser }) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'moto' | 'coche'
  const [activeCar, setActiveCar] = useState('Ford Focus'); // 'Ford Focus' | 'Ford Fiesta'

  // Datos
  const [warranties, setWarranties] = useState([]);
  const [maintenanceBooks, setMaintenanceBooks] = useState({});
  const [loading, setLoading] = useState(true);

  // Formulario Garantías
  const [wName, setWName] = useState('');
  const [wPurchaseDate, setWPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [wExpirationDate, setWExpirationDate] = useState('');
  const [wImageFile, setWImageFile] = useState(null);
  const [wImageName, setWImageName] = useState('');
  const [submittingW, setSubmittingW] = useState(false);

  // Formulario Mantenimiento (Moto / Coche)
  const [mDate, setMDate] = useState(new Date().toISOString().split('T')[0]);
  const [mKm, setMKm] = useState('');
  const [mType, setMType] = useState('revision'); // 'revision' | 'reparacion' | 'otro'
  const [mDescription, setMDescription] = useState('');
  const [mImageFile, setMImageFile] = useState(null);
  const [mImageName, setMImageName] = useState('');
  const [submittingM, setSubmittingM] = useState(false);

  // Buscadores
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Visor de Factura
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerTitle, setViewerTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wRes, mRes] = await Promise.all([
        fetch('/api/warranties'),
        fetch('/api/maintenance-books')
      ]);
      if (wRes.ok) setWarranties(await wRes.json());
      if (mRes.ok) setMaintenanceBooks(await mRes.json());
    } catch (err) {
      console.error('Error cargando datos de garantías/mantenimientos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar Garantía General
  const handleAddWarranty = async (e) => {
    e.preventDefault();
    if (!wName.trim() || !wPurchaseDate || !wExpirationDate) return;
    setSubmittingW(true);

    try {
      let imageBase64 = null;
      if (wImageFile) {
        imageBase64 = await compressImage(wImageFile);
      }

      const res = await fetch('/api/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wName.trim(),
          purchaseDate: wPurchaseDate,
          expirationDate: wExpirationDate,
          imageBase64,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        setWName('');
        setWExpirationDate('');
        setWImageFile(null);
        setWImageName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingW(false);
    }
  };

  // Borrar Garantía General
  const handleDeleteWarranty = async (id) => {
    if (!confirm('¿Estás seguro de que quieres borrar esta garantía?')) return;
    try {
      const res = await fetch(`/api/warranties/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Guardar Entrada de Mantenimiento (Moto / Coche)
  const handleAddMaintenance = async (e) => {
    e.preventDefault();
    if (!mDate || !mKm || !mType) return;
    setSubmittingM(true);

    const vehicleName = activeTab === 'moto' ? 'Benelli BN 125' : activeCar;

    try {
      let imageBase64 = null;
      if (mImageFile) {
        imageBase64 = await compressImage(mImageFile);
      }

      const res = await fetch(`/api/maintenance-books/${encodeURIComponent(vehicleName)}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: mDate,
          km: parseInt(mKm),
          type: mType,
          description: mDescription.trim(),
          imageBase64,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        setMKm('');
        setMDescription('');
        setMImageFile(null);
        setMImageName('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingM(false);
    }
  };

  // Borrar Entrada de Mantenimiento
  const handleDeleteMaintenance = async (vehicleName, id) => {
    if (!confirm('¿Estás seguro de que quieres borrar este registro de mantenimiento?')) return;
    try {
      const res = await fetch(`/api/maintenance-books/${encodeURIComponent(vehicleName)}/entries/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Calcular tiempo restante de garantía
  const getWarrantyStatus = (expDateStr) => {
    const expDate = new Date(expDateStr);
    const today = new Date();
    const diffMs = expDate - today;

    if (diffMs < 0) {
      return { text: '🛑 Expirada', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' };
    }

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    let textRemaining = '';
    if (diffYears > 0) {
      const remMonths = diffMonths % 12;
      textRemaining = `Quedan ${diffYears} año${diffYears > 1 ? 's' : ''}${remMonths > 0 ? ` y ${remMonths} mes${remMonths > 1 ? 'es' : ''}` : ''}`;
    } else if (diffMonths > 0) {
      textRemaining = `Quedan ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    } else {
      textRemaining = `Quedan ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }

    if (diffMonths <= 6) {
      return { text: `⚠️ ${textRemaining}`, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' };
    }

    return { text: `🟢 ${textRemaining}`, color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' };
  };

  const getMaintenanceTypeLabel = (type) => {
    switch (type) {
      case 'revision': return '🛠️ Revisión';
      case 'reparacion': return '🔧 Reparación';
      default: return '📝 Otro';
    }
  };

  if (loading) {
    return <div className="glass-card"><div className="empty-state"><span>Cargando garantías y vehículos...</span></div></div>;
  }

  const filteredWarranties = warranties.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vehicleName = activeTab === 'moto' ? 'Benelli BN 125' : activeCar;
  const currentVehicleHistory = maintenanceBooks[vehicleName] || [];

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">📄</span>
          Garantías y Vehículos
        </h2>
        <span className="card-subtitle">Administra facturas de compras y el historial de mantenimiento digital.</span>
      </div>

      {/* Tabs Principales */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem' }}>
        {[
          { id: 'general', label: '📄 General', emoji: '📄' },
          { id: 'moto', label: '🏍️ Moto', emoji: '🏍️' },
          { id: 'coche', label: '🚗 Coche', emoji: '🚗' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
            }}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================== PESTAÑA GENERAL ==================== */}
      {activeTab === 'general' && (
        <div>
          {/* Formulario */}
          <form onSubmit={handleAddWarranty} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              📝 Nueva Compra / Garantía
            </h4>
            
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={wName}
                onChange={(e) => setWName(e.target.value)}
                placeholder="Nombre del producto (ej: Lavadora, TV Salón...)"
                className="custom-input"
                style={{ flex: 2, fontSize: '0.8rem', minWidth: '220px' }}
                maxLength={80}
                required
              />
              <div style={{ display: 'flex', flex: 1, gap: '0.4rem', minWidth: '250px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Fecha Compra</label>
                  <input
                    type="date"
                    value={wPurchaseDate}
                    onChange={(e) => setWPurchaseDate(e.target.value)}
                    className="custom-input"
                    style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                    required
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Garantía Hasta</label>
                  <input
                    type="date"
                    value={wExpirationDate}
                    onChange={(e) => setWExpirationDate(e.target.value)}
                    className="custom-input"
                    style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
              {/* File Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  📷 Subir Factura / Ticket
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setWImageFile(e.target.files[0]);
                        setWImageName(e.target.files[0].name);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {wImageName && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {wImageName}</span>}
              </div>

              <button type="submit" className="btn-primario" disabled={submittingW} style={{ padding: '0.45rem 1.2rem', fontSize: '0.78rem' }}>
                {submittingW ? '💾 Guardando...' : '💾 Registrar Garantía'}
              </button>
            </div>
          </form>

          {/* Buscador */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Buscar producto..."
              className="custom-input"
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
            />
          </div>

          {/* Listado */}
          <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
            Listado de Compras y Garantías
          </h4>

          {filteredWarranties.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <span style={{ fontSize: '1.5rem' }}>📋</span>
              <span>Sin registros</span>
              <span className="card-subtitle">Ninguna compra coincide con la búsqueda.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filteredWarranties.map((w) => {
                const status = getWarrantyStatus(w.expirationDate);
                return (
                  <div 
                    key={w.id} 
                    style={{ 
                      padding: '0.8rem', 
                      background: 'rgba(255,255,255,0.015)', 
                      border: '1px solid rgba(255,255,255,0.04)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: 1 }}>
                      {/* Factura Thumbnail */}
                      {w.imageBase64 ? (
                        <div 
                          onClick={() => {
                            setViewerImage(w.imageBase64);
                            setViewerTitle(w.name);
                          }}
                          style={{ width: '45px', height: '45px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <img src={w.imageBase64} alt="Factura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: 'var(--text-muted)' }}>
                          📄
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 550 }}>{w.name}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          Compra: {new Date(w.purchaseDate).toLocaleDateString('es-ES')} | Por {w.addedBy}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '6px', 
                        background: status.bg, 
                        color: status.color, 
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {status.text}
                      </span>
                      <button
                        onClick={() => handleDeleteWarranty(w.id)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.45rem', fontSize: '0.78rem', borderRadius: '6px' }}
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
      )}

      {/* ==================== PESTAÑA MOTO / COCHE ==================== */}
      {(activeTab === 'moto' || activeTab === 'coche') && (
        <div>
          {/* Subselector para Coches */}
          {activeTab === 'coche' && (
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.01)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              {['Ford Focus', 'Ford Fiesta'].map(car => (
                <button
                  key={car}
                  onClick={() => setActiveCar(car)}
                  className={`tab-btn ${activeCar === car ? 'active' : ''}`}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeCar === car ? 'var(--primary)' : 'transparent',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {car}
                </button>
              ))}
            </div>
          )}

          {/* Info Vehículo Activo */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>
                {vehicleName}
              </h3>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Libro de Mantenimiento Digital | <strong>{currentVehicleHistory.length} registros</strong>
              </p>
            </div>
            <span style={{ fontSize: '1.5rem' }}>{activeTab === 'moto' ? '🏍️' : '🚗'}</span>
          </div>

          {/* Formulario de Mantenimiento */}
          <form onSubmit={handleAddMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              🔧 Registrar Mantenimiento / Revisión
            </h4>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', gap: '0.4rem', minWidth: '220px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Fecha</label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="custom-input"
                    style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                    required
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Kilometraje (km)</label>
                  <input
                    type="number"
                    value={mKm}
                    onChange={(e) => setMKm(e.target.value)}
                    placeholder="Ej: 15400"
                    min="0"
                    className="custom-input"
                    style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
                <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Tipo Intervención</label>
                <select
                  value={mType}
                  onChange={(e) => setMType(e.target.value)}
                  className="custom-select"
                  style={{ fontSize: '0.78rem', padding: '0.4rem' }}
                >
                  <option value="revision">🛠️ Revisión</option>
                  <option value="reparacion">🔧 Reparación</option>
                  <option value="otro">📝 Otro / Observación</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              value={mDescription}
              onChange={(e) => setMDescription(e.target.value)}
              placeholder="Detalles / Observaciones (ej: Cambio de aceite y filtro, bujía nueva...)"
              className="custom-input"
              style={{ fontSize: '0.8rem', width: '100%' }}
              maxLength={150}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
              {/* File Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  📷 Subir Factura / Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setMImageFile(e.target.files[0]);
                        setMImageName(e.target.files[0].name);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                {mImageName && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📎 {mImageName}</span>}
              </div>

              <button type="submit" className="btn-primario" disabled={submittingM} style={{ padding: '0.45rem 1.2rem', fontSize: '0.78rem' }}>
                {submittingM ? '💾 Guardando...' : '💾 Registrar Entrada'}
              </button>
            </div>
          </form>

          {/* Historial Timeline */}
          <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
            Historial de Mantenimientos
          </h4>

          {currentVehicleHistory.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <span style={{ fontSize: '1.5rem' }}>🔧</span>
              <span>Sin registros</span>
              <span className="card-subtitle">Ninguna entrada registrada en el libro de este vehículo.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', paddingLeft: '1.2rem', borderLeft: '2px dashed var(--glass-border)' }}>
              {currentVehicleHistory.map((entry) => (
                <div 
                  key={entry.id}
                  style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.012)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  {/* Círculo Timeline */}
                  <span style={{
                    position: 'absolute',
                    left: '-1.65rem',
                    top: '0.9rem',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: entry.type === 'revision' ? 'var(--primary)' : entry.type === 'reparacion' ? 'var(--warning)' : 'var(--text-muted)',
                    border: '2px solid var(--glass-card-bg)'
                  }} />

                  {/* Header Entrada */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                        {getMaintenanceTypeLabel(entry.type)}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {new Date(entry.date).toLocaleDateString('es-ES')} | Por {entry.addedBy}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '6px', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        border: '1px solid var(--glass-border)',
                        color: '#ffffff', 
                        fontWeight: 700 
                      }}>
                        🚗 {entry.km.toLocaleString('es-ES')} km
                      </span>
                      <button
                        onClick={() => handleDeleteMaintenance(vehicleName, entry.id)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.4rem', fontSize: '0.72rem', borderRadius: '6px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Detalles / Notas */}
                  {entry.description && (
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.78)', lineHeight: '1.4' }}>
                      {entry.description}
                    </p>
                  )}

                  {/* Factura Adjunta */}
                  {entry.imageBase64 && (
                    <div 
                      onClick={() => {
                        setViewerImage(entry.imageBase64);
                        setViewerTitle(`${vehicleName} - ${new Date(entry.date).toLocaleDateString('es-ES')}`);
                      }}
                      style={{ 
                        marginTop: '0.4rem',
                        width: '100%', 
                        maxHeight: '120px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--glass-border)', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.01)'
                      }}
                    >
                      <img src={entry.imageBase64} alt="Factura de mantenimiento" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODAL VISOR DE IMAGEN A PANTALLA COMPLETA ==================== */}
      {viewerImage && (
        <div 
          className="modal-overlay" 
          onClick={() => setViewerImage(null)} 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'rgba(0,0,0,0.92)', 
            zIndex: 9999, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Header del Visor */}
          <div style={{ width: '100%', maxWidth: '700px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>📄 {viewerTitle}</span>
            <button 
              onClick={() => setViewerImage(null)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.8rem', cursor: 'pointer', padding: '0.2rem' }}
            >
              &times;
            </button>
          </div>

          {/* Imagen Zoom */}
          <div style={{ maxWidth: '700px', width: '100%', maxHeight: '75vh', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: '#000000', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={viewerImage} alt="Visor de factura" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
          </div>

          {/* Botón Descargar */}
          <a 
            href={viewerImage} 
            download={`Factura_${viewerTitle.replace(/\s+/g, '_')}.jpg`}
            className="btn-primario"
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            📥 Descargar Imagen
          </a>
        </div>
      )}
    </div>
  );
}
