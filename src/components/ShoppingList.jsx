import React, { useState, useEffect, useRef } from 'react';

const SUPERMARKET_LOGOS = {
  LIDL: "https://e7.pngegg.com/pngimages/106/455/png-clipart-yellow-red-and-blue-lidl-logo-lidl-logo-retail-supermarket-toru%C5%84-lidl-food-text-thumbnail.png",
  MERCADONA: "https://logos-world.net/wp-content/uploads/2022/04/Mercadona-Symbol.png",
  AHORRAMAS: "https://www.laelipa.es/wp-content/uploads/ahorramas.png",
  PRIMAPRIX: "https://yt3.googleusercontent.com/-JDAOR7LpwSwdCPkRxAdla-Iy5sLapNxNaHcemHCaYyG_cWVQiZz9im1nSak-XeabKrVLMl_=s900-c-k-c0x00ffffff-no-rj"
};

const getSupermarketColor = (supermarket) => {
  switch (supermarket) {
    case 'LIDL': return '#2563eb'; // Azul LIDL
    case 'MERCADONA': return '#10b981'; // Verde Mercadona
    case 'AHORRAMAS': return '#ef4444'; // Rojo Ahorramas
    case 'PRIMAPRIX': return '#f43f5e'; // Naranja/Rosa Primaprix
    default: return 'var(--primary)'; // Púrpura primario para otros
  }
};

const getSupermarketBgColor = (supermarket) => {
  switch (supermarket) {
    case 'LIDL': return 'rgba(37, 99, 235, 0.12)';
    case 'MERCADONA': return 'rgba(16, 185, 129, 0.12)';
    case 'AHORRAMAS': return 'rgba(239, 68, 68, 0.12)';
    case 'PRIMAPRIX': return 'rgba(244, 63, 94, 0.12)';
    default: return 'rgba(139, 92, 246, 0.12)'; // Soft purple for custom supermarkets
  }
};

export default function ShoppingList({ currentUser }) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados de Supermercados
  const [supermarkets, setSupermarkets] = useState(["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"]);
  const [selectedTab, setSelectedTab] = useState("TODOS");
  const [newSupermarket, setNewSupermarket] = useState('');
  const [showAddSupermarketForm, setShowAddSupermarketForm] = useState(false);
  const [itemSupermarket, setItemSupermarket] = useState('');
  const [customSupermarket, setCustomSupermarket] = useState('');

  // Estados para la edición por pulsación larga
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editSupermarket, setEditSupermarket] = useState('');
  const [editCustomSupermarket, setEditCustomSupermarket] = useState('');

  const pressTimerRef = useRef(null);
  const isLongPressRef = useRef(false);

  // Cargar lista al montar el componente
  useEffect(() => {
    fetchShopping();
    fetchSupermarkets();
  }, []);

  const fetchShopping = async () => {
    try {
      const res = await fetch('/api/shopping');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error al cargar lista de la compra:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const res = await fetch('/api/supermarkets');
      if (res.ok) {
        const data = await res.json();
        setSupermarkets(data);
      }
    } catch (err) {
      console.error('Error al cargar supermercados:', err);
    }
  };

  const handleAddSupermarket = async (e) => {
    e.preventDefault();
    if (!newSupermarket.trim()) return;
    const name = newSupermarket.trim().toUpperCase();

    try {
      const res = await fetch('/api/supermarkets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        const data = await res.json();
        setSupermarkets(data);
        setSelectedTab(name);
        setItemSupermarket(name);
        setNewSupermarket('');
        setShowAddSupermarketForm(false);
      }
    } catch (err) {
      console.error('Error al añadir supermercado:', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    let supermarketToSave = itemSupermarket;
    if (itemSupermarket === "OTRO") {
      if (!customSupermarket.trim()) return;
      supermarketToSave = customSupermarket.trim().toUpperCase();
      
      // Auto-añadir súper nuevo
      try {
        const res = await fetch('/api/supermarkets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: supermarketToSave })
        });
        if (res.ok) {
          const data = await res.json();
          setSupermarkets(data);
        }
      } catch (err) {
        console.error('Error al auto-añadir súper:', err);
      }
    }

    try {
      const res = await fetch('/api/shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newItemText.trim(),
          note: newItemNote.trim(),
          supermarket: supermarketToSave,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        const addedItem = await res.json();
        setItems(prev => [...prev, addedItem]);
        setNewItemText('');
        setNewItemNote('');
        setCustomSupermarket('');
        if (selectedTab !== "TODOS" && selectedTab !== "OTRO") {
          setItemSupermarket(selectedTab);
        } else {
          setItemSupermarket("");
        }
      }
    } catch (err) {
      console.error('Error al añadir item:', err);
    }
  };

  const handleToggleItem = async (id, currentCompleted) => {
    try {
      const nextCompleted = !currentCompleted;
      const res = await fetch(`/api/shopping/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: nextCompleted,
          completedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      }
    } catch (err) {
      console.error('Error al cambiar estado de item:', err);
    }
  };

  const handleStartPress = (item) => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setEditingItem(item);
      setEditTitle(item.text);
      setEditNote(item.note || '');
      
      const isStandard = supermarkets.includes(item.supermarket);
      if (isStandard) {
        setEditSupermarket(item.supermarket);
        setEditCustomSupermarket('');
      } else {
        setEditSupermarket("OTRO");
        setEditCustomSupermarket(item.supermarket);
      }
    }, 750); // 750ms para disparar edición
  };

  const handleCancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  };

  const handleItemClick = (item) => {
    if (!isLongPressRef.current) {
      handleToggleItem(item.id, item.completed);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editingItem) return;

    let finalSupermarket = editSupermarket;
    if (editSupermarket === "OTRO") {
      if (!editCustomSupermarket.trim()) return;
      finalSupermarket = editCustomSupermarket.trim().toUpperCase();

      // Auto-registrar supermercado
      try {
        const res = await fetch('/api/supermarkets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: finalSupermarket })
        });
        if (res.ok) {
          const data = await res.json();
          setSupermarkets(data);
        }
      } catch (err) {
        console.error('Error al auto-añadir súper:', err);
      }
    }

    try {
      const res = await fetch(`/api/shopping/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editTitle.trim(),
          note: editNote.trim(),
          supermarket: finalSupermarket,
          updatedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
        setEditingItem(null);
      }
    } catch (err) {
      console.error('Error al editar item:', err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const url = selectedTab !== "TODOS" 
        ? `/api/shopping/completed?supermarket=${encodeURIComponent(selectedTab)}`
        : '/api/shopping/completed';

      const res = await fetch(url, {
        method: 'DELETE'
      });
      if (res.ok) {
        const remaining = await res.json();
        setItems(remaining);
      }
    } catch (err) {
      console.error('Error al limpiar completados:', err);
    }
  };

  // Filtrar los items por el supermercado de la pestaña activa
  const filteredItems = items.filter(item => {
    if (selectedTab === "TODOS" || selectedTab === "OTRO") return true;
    return item.supermarket === selectedTab;
  });

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h2 className="card-title">
          <span className="card-title-icon">🛒</span>
          Lista de la Compra
        </h2>
        {filteredItems.some(i => i.completed) && (
          <button 
            onClick={handleClearCompleted}
            className="btn-secondary"
            title={`Limpiar items completados ${selectedTab !== 'TODOS' ? 'de ' + selectedTab : ''}`}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Formulario para añadir compras */}
      <form onSubmit={handleAddItem} className="input-group" style={{ flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', opacity: 0.8 }}>Supermercado</label>
            <select
              value={itemSupermarket}
              onChange={(e) => setItemSupermarket(e.target.value)}
              className="custom-input"
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
            >
              <option value="">-- Sin especificar --</option>
              {supermarkets.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="OTRO">OTRO (Especificar...)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', opacity: 0.8 }}>Producto</label>
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Ej: Leche, Huevos..."
              className="custom-input"
              style={{ width: '100%', padding: '0.6rem' }}
              maxLength={100}
              required
            />
          </div>
        </div>

        {/* Campo de súper custom si se selecciona OTRO */}
        {itemSupermarket === "OTRO" && (
          <div style={{ width: '100%' }}>
            <input
              type="text"
              value={customSupermarket}
              onChange={(e) => setCustomSupermarket(e.target.value)}
              placeholder="Escribe el nombre del supermercado custom..."
              className="custom-input"
              style={{ width: '100%', fontSize: '0.85rem' }}
              maxLength={30}
              required
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <input
            type="text"
            value={newItemNote}
            onChange={(e) => setNewItemNote(e.target.value)}
            placeholder="Nota opcional (ej: Mercadona, marca...)"
            className="custom-input"
            style={{ flex: 1, fontSize: '0.85rem' }}
            maxLength={100}
          />
          <button type="submit" className="btn-primary" aria-label="Añadir item de compra">
            <span>Añadir</span>
          </button>
        </div>
      </form>

      {/* Pestañas de Filtro de Supermercado (Debajo de Añadir Producto) */}
      <div className="supermarket-tabs-wrapper" style={{ marginBottom: '1.2rem', overflowX: 'auto', display: 'flex', gap: '0.4rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--glass-border)' }}>
        <button
          key="TODOS"
          onClick={() => { setSelectedTab("TODOS"); setItemSupermarket("LIDL"); setShowAddSupermarketForm(false); }}
          className={`tab-btn ${selectedTab === "TODOS" ? "active" : ""}`}
          style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: selectedTab === "TODOS" ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#ffffff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          🛒 TODOS
        </button>
        
        {supermarkets.map(superName => {
          const logoUrl = SUPERMARKET_LOGOS[superName];
          return (
            <button
              key={superName}
              onClick={() => { setSelectedTab(superName); setItemSupermarket(superName); setShowAddSupermarketForm(false); }}
              className={`tab-btn ${selectedTab === superName ? "active" : ""}`}
              style={{ 
                padding: logoUrl ? '0.2rem 0.6rem' : '0.4rem 0.8rem', 
                borderRadius: '20px', 
                border: '1px solid var(--glass-border)', 
                background: selectedTab === superName ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                color: '#ffffff', 
                cursor: 'pointer', 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                transition: 'all 0.2s', 
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '28px'
              }}
              title={`Ver compras de ${superName}`}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={superName}
                  style={{
                    height: '16px',
                    maxWidth: '65px',
                    objectFit: 'contain',
                    filter: selectedTab === superName ? 'brightness(1.1) contrast(1.1)' : 'opacity(0.85)',
                    borderRadius: '2px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
              ) : null}
              <span style={{ display: logoUrl ? 'none' : 'inline' }}>🏪 {superName}</span>
            </button>
          );
        })}

        <button
          key="OTRO"
          onClick={() => { setSelectedTab("OTRO"); setShowAddSupermarketForm(true); }}
          className={`tab-btn ${selectedTab === "OTRO" ? "active" : ""}`}
          style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: selectedTab === "OTRO" ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#ffffff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          ➕ OTRO
        </button>
      </div>

      {/* Formulario flotante para Añadir Nuevo Supermercado */}
      {showAddSupermarketForm && (
        <form onSubmit={handleAddSupermarket} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <input
            type="text"
            value={newSupermarket}
            onChange={(e) => setNewSupermarket(e.target.value)}
            placeholder="Nombre del nuevo súper (ej: ALDI)..."
            className="custom-input"
            style={{ flex: 1, fontSize: '0.85rem' }}
            maxLength={20}
            required
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Añadir Súper
          </button>
        </form>
      )}

      {loading ? (
        <div className="empty-state">
          <span>Cargando lista...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <span>¡La lista está vacía!</span>
          <span className="card-subtitle">
            {selectedTab !== "TODOS" && selectedTab !== "OTRO" 
              ? `No hay compras pendientes para ${selectedTab}.` 
              : "Añade cosas que hagan falta en casa."}
          </span>
        </div>
      ) : (
        <div className="list-container">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`list-item ${item.completed ? 'completed' : ''}`}
              style={{
                background: item.supermarket ? getSupermarketBgColor(item.supermarket) : 'var(--glass-bg)',
                borderLeft: item.supermarket ? `4px solid ${getSupermarketColor(item.supermarket)}` : '1px solid var(--glass-border)',
                paddingLeft: item.supermarket ? '0.75rem' : '1rem',
                paddingRight: item.supermarket ? '52px' : '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                className="list-item-content" 
                onClick={() => handleItemClick(item)}
                onMouseDown={() => handleStartPress(item)}
                onMouseUp={handleCancelPress}
                onMouseLeave={handleCancelPress}
                onTouchStart={() => handleStartPress(item)}
                onTouchEnd={handleCancelPress}
                onTouchMove={handleCancelPress}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                title="Mantén pulsado para editar"
              >
                <div className="checkbox-custom" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="list-item-text" style={{ fontWeight: 500 }}>{item.text}</span>
                  {item.note && (
                    <span 
                      className="list-item-note" 
                      style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-muted)', 
                        fontStyle: 'italic', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.2rem', 
                        marginTop: '0.15rem' 
                      }}
                    >
                      🏷️ {item.note}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="item-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span className={`meta-user ${item.completed ? (item.completedBy?.toLowerCase() || 'sandra') : (item.addedBy?.toLowerCase() || 'ismael')}`}>
                  {item.completed 
                    ? `Hecho: ${item.completedBy}` 
                    : `Por: ${item.addedBy}`}
                </span>
                <span style={{ fontSize: '0.62rem', opacity: 0.6, marginTop: '2px' }}>
                  {item.completed 
                    ? new Date(item.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) 
                    : new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Bandera con logo en la pestaña al final */}
              {item.supermarket && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '45px',
                  background: getSupermarketColor(item.supermarket),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 20% 100%, 0 50%)',
                  paddingLeft: '8px',
                  boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.15)'
                }} title={`Supermercado: ${item.supermarket}`}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {SUPERMARKET_LOGOS[item.supermarket] ? (
                      <img 
                        src={SUPERMARKET_LOGOS[item.supermarket]} 
                        alt={item.supermarket} 
                        style={{ width: '15px', height: '15px', objectFit: 'contain' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline';
                        }}
                      />
                    ) : null}
                    <span style={{ 
                      display: SUPERMARKET_LOGOS[item.supermarket] ? 'none' : 'inline',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      color: '#333333'
                    }}>
                      {item.supermarket.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición de artículo */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
            <div className="modal-header" style={{ marginBottom: '1.2rem' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem' }}>
                <span>✏️</span> Editar Artículo
              </h2>
              <button className="modal-close" onClick={() => setEditingItem(null)}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Producto</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  maxLength={100}
                  className="custom-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Supermercado</label>
                <select
                  value={editSupermarket}
                  onChange={(e) => setEditSupermarket(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%' }}
                >
                  <option value="">-- Sin especificar --</option>
                  {supermarkets.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="OTRO">OTRO (Especificar...)</option>
                </select>
              </div>

              {editSupermarket === "OTRO" && (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Súper Custom</label>
                  <input
                    type="text"
                    value={editCustomSupermarket}
                    onChange={(e) => setEditCustomSupermarket(e.target.value)}
                    required
                    maxLength={30}
                    placeholder="Ej. CARREFOUR"
                    className="custom-input"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Nota / Detalle</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  maxLength={100}
                  placeholder="Sin notas"
                  className="custom-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-secundario"
                  style={{ flex: 1, padding: '0.6rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primario"
                  style={{ flex: 1, padding: '0.6rem' }}
                  disabled={!editTitle.trim()}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
