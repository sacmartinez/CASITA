import React, { useState, useEffect } from 'react';

export default function TaskManager({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState('domestica');
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchHistory();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/tasks/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error al cargar historial de tareas:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: taskText.trim(),
          category,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        setTaskText('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Error al añadir tarea:', err);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedBy: currentUser })
      });

      if (res.ok) {
        fetchTasks();
        fetchHistory();
      }
    } catch (err) {
      console.error('Error al completar tarea:', err);
    }
  };

  const handleArchiveTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}/archive`, {
        method: 'POST'
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error al archivar tarea:', err);
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'domestica': return 'Doméstica';
      case 'reparacion': return 'Reparación';
      default: return 'Otra';
    }
  };

  const formatRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 600);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} d`;
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-title-icon">📋</span>
          Tareas e Historial
        </h2>
      </div>

      {/* Formulario para añadir tarea */}
      <form onSubmit={handleAddTask} className="input-group" style={{ flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Ej: Limpiar el horno, arreglar luz terraza..."
          className="custom-input"
          style={{ width: '100%' }}
          maxLength={100}
        />
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="custom-select"
            style={{ flex: 1 }}
          >
            <option value="domestica">Doméstica</option>
            <option value="reparacion">Reparación (Un solo uso)</option>
            <option value="otra">Otra</option>
          </select>
          <button type="submit" className="btn-primary">
            <span>Añadir</span>
          </button>
        </div>
      </form>

      {/* Lista de Tareas Activas */}
      <div style={{ marginTop: '0.5rem' }}>
        <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tareas Activas</h3>
        
        {loadingTasks ? (
          <div className="empty-state">
            <span>Cargando tareas...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state" style={{ padding: '1rem 0' }}>
            <span className="empty-icon" style={{ fontSize: '1.5rem' }}>✨</span>
            <span>No hay tareas pendientes</span>
            <span className="card-subtitle">¡Todo está al día!</span>
          </div>
        ) : (
          <div className="list-container" style={{ maxHeight: '250px' }}>
            {tasks.map((task) => (
              <div key={task.id} className="list-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                  <span className="list-item-text" style={{ fontWeight: 500 }}>{task.text}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className={`task-badge ${task.category}`}>
                      {getCategoryLabel(task.category)}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Añadida por {task.addedBy}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="btn-complete-task"
                  >
                    Hecho
                  </button>
                  <button
                    onClick={() => handleArchiveTask(task.id)}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem', borderRadius: '8px' }}
                    title="Archivar tarea sin marcar como realizada"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Completados */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <h3 className="card-subtitle" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Historial Reciente</h3>
        
        {history.length === 0 ? (
          <div className="empty-state" style={{ padding: '1rem 0' }}>
            <span>Historial vacío.</span>
          </div>
        ) : (
          <div className="history-list">
            {history.map((log) => (
              <div key={log.id} className="history-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <span className="history-text" style={{ fontWeight: 500 }}>{log.taskText}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Categoría: {getCategoryLabel(log.category)}
                  </span>
                </div>
                <div className="history-item-meta">
                  <span className={`history-tag ${log.completedBy.toLowerCase()}`}>
                    {log.completedBy}
                  </span>
                  <div>{formatRelativeTime(log.completedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
