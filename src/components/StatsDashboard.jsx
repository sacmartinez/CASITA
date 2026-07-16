import React, { useState, useEffect } from 'react';

export default function StatsDashboard() {
  const [history, setHistory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [histRes, expRes] = await Promise.all([
        fetch('/api/tasks/history'),
        fetch('/api/expenses')
      ]);
      if (histRes.ok && expRes.ok) {
        setHistory(await histRes.json());
        const expData = await expRes.json();
        setExpenses(expData.expenses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Calcular recuentos de tareas completadas
  let tasksIsmael = 0;
  let tasksSandra = 0;
  history.forEach(log => {
    if (log.completedBy === 'Ismael') tasksIsmael++;
    if (log.completedBy === 'Sandra') tasksSandra++;
  });

  const totalTasks = tasksIsmael + tasksSandra;
  const pctIsmael = totalTasks > 0 ? Math.round((tasksIsmael / totalTasks) * 100) : 50;
  const pctSandra = totalTasks > 0 ? Math.round((tasksSandra / totalTasks) * 100) : 50;

  // 2. Calcular gasto por categorías
  let spentOcio = 0;
  let spentDomestico = 0;
  let spentCompra = 0;
  expenses.forEach(e => {
    if (e.category === 'ocio') spentOcio += e.amount;
    if (e.category === 'domestico') spentDomestico += e.amount;
    if (e.category === 'compra') spentCompra += e.amount;
  });

  const totalSpent = spentOcio + spentDomestico + spentCompra;

  if (loading) {
    return <div className="glass-card"><div className="empty-state"><span>Calculando estadísticas...</span></div></div>;
  }

  return (
    <div className="glass-card" style={{ width: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">📊</span>
          Pique Sano y Estadísticas
        </h2>
        <span className="card-subtitle">Estadísticas colaborativas y reparto de tareas en el hogar.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Marcador Tareas */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1.2rem', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            🏆 Reparto de Tareas Realizadas
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Ismael ({tasksIsmael})</span>
            <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>Sandra ({tasksSandra})</span>
          </div>

          {/* Barra de progreso combinada */}
          <div style={{ width: '100%', height: '14px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', marginBottom: '0.8rem' }}>
            {totalTasks > 0 ? (
              <>
                <div style={{ width: `${pctIsmael}%`, background: 'var(--primary)', transition: 'width 0.5s' }} />
                <div style={{ width: `${pctSandra}%`, background: 'var(--secondary)', transition: 'width 0.5s' }} />
              </>
            ) : (
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Sin tareas en el historial
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{pctIsmael}% del total</span>
            <span>{pctSandra}% del total</span>
          </div>

          <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.8rem', textAlign: 'center' }}>
            {tasksIsmael > tasksSandra ? (
              <span>👑 <strong>Ismael</strong> lidera el ranking doméstico temporalmente. ¡A recuperar terreno Sandra!</span>
            ) : tasksSandra > tasksIsmael ? (
              <span>👑 <strong>Sandra</strong> va ganando el asalto en casa. ¡Ponte las pilas Ismael!</span>
            ) : (
              <span>⚖️ ¡Empate técnico! Las tareas de casa están perfectamente equilibradas.</span>
            )}
          </div>
        </div>

        {/* Marcador Gastos */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1.2rem', borderRadius: '16px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            💰 Desglose de Gastos
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>🏠 Gastos Domésticos</span>
              <strong style={{ color: '#ffffff' }}>{spentDomestico.toFixed(2)}€</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>🍿 Ocio y Restaurantes</span>
              <strong style={{ color: '#ffffff' }}>{spentOcio.toFixed(2)}€</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span>🛒 Alimentación y Súper</span>
              <strong style={{ color: '#ffffff' }}>{spentCompra.toFixed(2)}€</strong>
            </div>
            <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.4rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem', fontWeight: 700 }}>
              <span>Gasto Total Registrado</span>
              <span style={{ color: 'var(--warning)' }}>{totalSpent.toFixed(2)}€</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
