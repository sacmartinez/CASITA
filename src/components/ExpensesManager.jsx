import React, { useState, useEffect } from 'react';

export default function ExpensesManager({ currentUser }) {
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ Ismael: 0, Sandra: 0 });
  const [balance, setBalance] = useState({ ower: null, amount: 0 });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser);
  const [category, setCategory] = useState('domestico');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses);
        setTotals(data.totals);
        setBalance(data.balance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          amount: parseFloat(amount),
          paidBy,
          category
        })
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setPaidBy(currentUser);
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearExpenses = async () => {
    if (!window.confirm('¿Seguro que quieres saldar las cuentas? Esto borrará el historial de gastos actual.')) return;
    try {
      const res = await fetch('/api/expenses/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearedBy: currentUser })
      });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'ocio': return '🍿';
      case 'domestico': return '🏠';
      case 'compra': return '🛒';
      default: return '💰';
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'ocio': return 'Ocio';
      case 'domestico': return 'Doméstico';
      case 'compra': return 'Compra';
      default: return 'Otro';
    }
  };

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">💰</span>
          Gastos Compartidos
        </h2>
        <span className="card-subtitle">Control de cuentas compartidas del hogar y ocio.</span>
      </div>

      {/* Balance Resumen */}
      <div 
        style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '16px', 
          padding: '1.2rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8rem',
          textAlign: 'center'
        }}
      >
        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>
          Estado de Cuentas
        </h3>

        {balance.amount === 0 ? (
          <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>
            🤝 ¡Cuentas al día! Nadie debe a nadie.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              💸 <span style={{ color: balance.ower === 'Sandra' ? 'var(--secondary)' : 'var(--primary)' }}>{balance.ower}</span> debe{' '}
              <span style={{ color: 'var(--warning)' }}>{balance.amount.toFixed(2)}€</span> a{' '}
              <span style={{ color: balance.ower === 'Ismael' ? 'var(--secondary)' : 'var(--primary)' }}>
                {balance.ower === 'Ismael' ? 'Sandra' : 'Ismael'}
              </span>
            </p>
            <button 
              onClick={handleClearExpenses}
              className="btn-secundario"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '20px', alignSelf: 'center', background: 'rgba(255, 255, 255, 0.05)' }}
            >
              🤝 Marcar como Saldado
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pagado Ismael</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>{totals.Ismael.toFixed(2)}€</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pagado Sandra</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary)' }}>{totals.Sandra.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Creador de Gastos */}
      <form onSubmit={handleAddExpense} className="input-group" style={{ flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Concepto (ej: Compra semanal, Cine...)"
            className="custom-input"
            style={{ flex: 2, fontSize: '0.85rem' }}
            maxLength={50}
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="€.cc"
            className="custom-input"
            style={{ flex: 1, fontSize: '0.85rem' }}
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="custom-input"
            style={{ flex: 1, fontSize: '0.8rem', minWidth: '110px' }}
          >
            <option value="Ismael">Pagó Ismael</option>
            <option value="Sandra">Pagó Sandra</option>
            <option value="Conjunta">Tarjeta Conjunta</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="custom-input"
            style={{ flex: 1, fontSize: '0.8rem', minWidth: '110px' }}
          >
            <option value="domestico">Gasto Doméstico</option>
            <option value="ocio">Gasto Ocio</option>
            <option value="compra">Compra / Súper</option>
          </select>
          <button type="submit" className="btn-primario" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            Añadir Gasto
          </button>
        </div>
      </form>

      {/* Historial de Gastos */}
      <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Historial de Gastos</h3>
      
      {loading ? (
        <div className="empty-state"><span>Cargando gastos...</span></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state" style={{ padding: '1.5rem 0' }}>
          <span style={{ fontSize: '1.5rem' }}>🍃</span>
          <span>Sin gastos registrados</span>
          <span className="card-subtitle">Todo saldado o sin movimientos.</span>
        </div>
      ) : (
        <div className="list-container" style={{ maxHeight: '280px' }}>
          {expenses.slice().reverse().map((exp) => (
            <div key={exp.id} className="list-item" style={{ padding: '0.6rem 0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                <span style={{ fontSize: '1.1rem' }}>{getCategoryIcon(exp.category)}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span className="list-item-text" style={{ fontWeight: 600, fontSize: '0.88rem' }}>{exp.description}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className={`task-badge ${exp.paidBy.toLowerCase()}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                      {exp.paidBy === 'Conjunta' ? 'Conjunta 💳' : exp.paidBy}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      • {getCategoryLabel(exp.category)}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>{exp.amount.toFixed(2)}€</span>
                <button
                  onClick={() => handleDeleteExpense(exp.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', opacity: 0.6 }}
                  title="Eliminar gasto"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
