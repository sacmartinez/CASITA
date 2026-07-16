import React, { useState, useEffect } from 'react';

export default function RecipeBook({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Campos formulario
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]); // Array de { name, supermarket, qty }
  
  // Ingrediente temporal que se está escribiendo
  const [ingName, setIngName] = useState('');
  const [ingSuper, setIngSuper] = useState('');
  const [ingQty, setIngQty] = useState('');

  const supermarkets = ["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTempIngredient = (e) => {
    e.preventDefault();
    if (!ingName.trim()) return;

    setIngredients(prev => [...prev, {
      name: ingName.trim(),
      supermarket: ingSuper, // puede ser vacío
      qty: ingQty.trim()
    }]);

    setIngName('');
    setIngSuper('');
    setIngQty('');
  };

  const handleRemoveTempIngredient = (idx) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!recipeName.trim() || ingredients.length === 0 || !instructions.trim()) {
      alert('Por favor, rellena el nombre, las instrucciones y añade al menos un ingrediente.');
      return;
    }

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipeName.trim(),
          ingredients,
          instructions: instructions.trim(),
          addedBy: currentUser
        })
      });

      if (res.ok) {
        setRecipeName('');
        setInstructions('');
        setIngredients([]);
        setShowAddForm(false);
        fetchRecipes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportIngredients = async (recipeId, recipeName) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ importedBy: currentUser })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`¡Éxito! Se han importado ${data.count} ingredientes de "${recipeName}" a la Lista de la Compra.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="card-title">
            <span className="card-title-icon">🍽️</span>
            Recetario Compartido
          </h2>
          <span className="card-subtitle">Guardad vuestras recetas e importad ingredientes a la compra.</span>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn-primario"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '20px' }}
        >
          {showAddForm ? 'Cancelar' : '➕ Nueva Receta'}
        </button>
      </div>

      {/* Formulario para añadir receta */}
      {showAddForm && (
        <form onSubmit={handleAddRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem', opacity: 0.8 }}>Nombre de la Receta</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="custom-input"
              placeholder="Ej: Pasta Carbonara, Tortilla de patatas..."
              required
            />
          </div>

          {/* Constructor de ingredientes */}
          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.8 }}>Añadir Ingredientes</label>
            
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={ingName}
                onChange={(e) => setIngName(e.target.value)}
                placeholder="Nombre ingrediente..."
                className="custom-input"
                style={{ flex: 2, fontSize: '0.8rem', padding: '0.4rem' }}
              />
              <input
                type="text"
                value={ingQty}
                onChange={(e) => setIngQty(e.target.value)}
                placeholder="Cant. (ej: 200g, 3 uds)..."
                className="custom-input"
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', minWidth: '80px' }}
              />
              <select
                value={ingSuper}
                onChange={(e) => setIngSuper(e.target.value)}
                className="custom-input"
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', minWidth: '100px' }}
              >
                <option value="">Súper (Opcional)</option>
                {supermarkets.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                type="button" 
                onClick={handleAddTempIngredient} 
                className="btn-secundario"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                ＋
              </button>
            </div>

            {/* Listado temporal de ingredientes */}
            {ingredients.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                {ingredients.map((ing, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      fontSize: '0.72rem', 
                      background: 'rgba(255,255,255,0.06)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.3rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <span>{ing.name} {ing.qty && `(${ing.qty})`} {ing.supermarket && `🏪 ${ing.supermarket}`}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTempIngredient(idx)} 
                      style={{ border: 'none', background: 'none', color: '#b71c1c', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ningún ingrediente añadido.</p>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem', opacity: 0.8 }}>Instrucciones / Elaboración</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="custom-input"
              placeholder="Pasos para cocinar la receta..."
              rows={3}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="btn-primario" style={{ width: '100%', padding: '0.6rem' }}>
            💾 Guardar Receta
          </button>
        </form>
      )}

      {/* Listado de recetas */}
      {loading ? (
        <div className="empty-state"><span>Cargando recetario...</span></div>
      ) : recipes.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 0' }}>
          <span style={{ fontSize: '1.5rem' }}>🍳</span>
          <span>Recetario vacío</span>
          <span className="card-subtitle">Escribe vuestras recetas preferidas para tenerlas a mano.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>🍝 {recipe.name}</h3>
                <button
                  onClick={() => handleImportIngredients(recipe.id, recipe.name)}
                  className="btn-secundario"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', borderRadius: '12px', background: 'rgba(var(--primary-rgb), 0.15)', border: '1px solid var(--primary)' }}
                  title="Añadir todos los ingredientes a la lista de la compra"
                >
                  🛒 Auto-Comprar
                </button>
              </div>

              {/* Ingredientes */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Ingredientes</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {recipe.ingredients.map((ing, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        fontSize: '0.7rem', 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: '4px',
                        color: 'rgba(255,255,255,0.85)'
                      }}
                    >
                      {ing.name} {ing.qty && `(${ing.qty})`} {ing.supermarket && `🏪 ${ing.supermarket}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preparación */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Elaboración</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{recipe.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
