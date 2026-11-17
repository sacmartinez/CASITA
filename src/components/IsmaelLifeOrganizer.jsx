import React, { useState, useEffect } from 'react';

// Bloques horarios de Lunes a Viernes adaptados al horario real de Ismael:
// Levanta 06:00 | Curro 07:00-15:00 | Ventana de Oro 16:00-18:30 | Sandra llega 18:30 -> Gym
const DAILY_SCHEDULE_BLOCKS = [
  {
    id: 'b-0600',
    timeRange: '06:00 - 07:00',
    startHour: 6,
    startMin: 0,
    endHour: 7,
    endMin: 0,
    durationMin: 15,
    icon: '☀️',
    title: 'Despertar + 5 min Ejercicio en Casa + Rumbo al Curro',
    category: 'Deporte en Casa',
    color: '#f59e0b',
    desc: 'Nada más levantarte: haz los 5 min de activación en casa (Sentadillas, Flexiones y Plancha), café y para el curro con la mente despierta.',
    actionType: 'gym'
  },
  {
    id: 'b-0700',
    timeRange: '07:00 - 15:00',
    startHour: 7,
    startMin: 0,
    endHour: 15,
    endMin: 0,
    durationMin: 0,
    icon: '🏢',
    title: 'Jornada de Trabajo (07:00 a 15:00)',
    category: 'Trabajo',
    color: '#64748b',
    desc: 'Cumple tu horario laboral sin llevarte estrés extra. A las 15:00 empieza tu tiempo para ti y tu futuro.'
  },
  {
    id: 'b-1500',
    timeRange: '15:00 - 16:00',
    startHour: 15,
    startMin: 0,
    endHour: 16,
    endMin: 0,
    durationMin: 25,
    icon: '🍽️',
    title: 'Comida Tranquila + 20 min de Desconexión Mental',
    category: 'Comida y Descanso',
    color: '#10b981',
    desc: 'Regla de oro: al llegar a las 15:00 come bien y descansa 20 min en el sofá sin pantallas de trabajo. Si no descansas aquí, a las 17:00 estarás agotado.',
    actionType: 'planning'
  },
  {
    id: 'b-1600-cv',
    timeRange: '16:00 - 16:40',
    startHour: 16,
    startMin: 0,
    endHour: 16,
    endMin: 40,
    durationMin: 40,
    icon: '📄',
    title: 'Ventana de Oro (1/4): Actualizar CV (Papel + Digital) y Buscar Curro',
    category: 'Futuro Laboral',
    color: '#3b82f6',
    desc: '40 minutos enfocados con el móvil en silencio: mejorar tu CV en papel (para imprimir) y digital (PDF/LinkedIn/InfoJobs) y echar ofertas nuevas.',
    projectKey: 'cv_curro'
  },
  {
    id: 'b-1640-sg',
    timeRange: '16:40 - 17:15',
    startHour: 16,
    startMin: 40,
    endHour: 17,
    endMin: 15,
    durationMin: 35,
    icon: '😈',
    title: 'Ventana de Oro (2/4): Tute y Repaso Diario a SomosGamberros',
    category: 'SomosGamberros',
    color: '#ec4899',
    desc: '35 minutos diarios sagrados para darle caña a SomosGamberros: repasar, probar y sacar adelante 1 mejora concreta cada día.',
    projectKey: 'somosgamberros'
  },
  {
    id: 'b-1715-sp',
    timeRange: '17:15 - 17:45',
    startHour: 17,
    startMin: 15,
    endHour: 17,
    endMin: 45,
    durationMin: 30,
    icon: '🎵',
    title: 'Ventana de Oro (3/4): Mejorar SoundPulse (Local AI Music)',
    category: 'SoundPulse AI',
    color: '#8b5cf6',
    desc: '30 minutos para avanzar en SoundPulse sin mezclarlo con lo demás. Elige 1 mejora de la lista de abajo y dale foco hasta las 17:45.',
    projectKey: 'soundpulse'
  },
  {
    id: 'b-1745-casa',
    timeRange: '17:45 - 18:30',
    startHour: 17,
    startMin: 45,
    endHour: 18,
    endMin: 30,
    durationMin: 45,
    icon: '🛠️',
    title: 'Ventana de Oro (4/4): Reto 8 min Casa + 1 Arreglo + Adelantar Cena',
    category: 'Casa, Cena y Brazos/Abs',
    color: '#f97316',
    desc: 'Antes de que llegue Sandra a las 18:30: haz los 8 min de Brazos+Tableta en el salón, tacha 1 arreglo/tarea de casa y deja la cena adelantada.',
    actionType: 'tasks',
    projectKey: 'casa_comidas'
  },
  {
    id: 'b-1830-gym',
    timeRange: '18:30 - 20:15',
    startHour: 18,
    startMin: 30,
    endHour: 20,
    endMin: 15,
    durationMin: 55,
    icon: '🏋️',
    title: '¡Llega Sandra (18:30)! → Ir Juntos al Gimnasio Marbella',
    category: 'Gimnasio con Sandra',
    color: '#10b981',
    desc: 'Cuando llega Sandra a las 18:30 tú ya tienes tus proyectos, el CV y la casa hechos. Os vais juntos al Gimnasio Marbella con cero estrés.',
    actionType: 'gym'
  },
  {
    id: 'b-2015-cena',
    timeRange: '20:15 - 22:15',
    startHour: 20,
    startMin: 15,
    endHour: 22,
    endMin: 15,
    durationMin: 0,
    icon: '🌙',
    title: 'Ducha, Cena Juntos y Desconexión (Dormir ~22:15)',
    category: 'Cena y Descanso',
    color: '#38bdf8',
    desc: 'Como dejaste la cena adelantada a las 18:00, en 10 minutos estáis cenando. A las 22:15 a dormir para levantarte a las 06:00 como un toro.'
  }
];

const PROJECT_CARDS_META = [
  {
    key: 'cv_curro',
    icon: '📄💼',
    title: 'Currículum (Papel + Digital) y Nuevo Curro',
    subtitle: 'Bloque diario: 16:00 a 16:40 (40 min)',
    color: '#3b82f6',
    placeholder: 'Ej: Pasar CV a plantilla limpia para imprimir / Echar 3 ofertas en InfoJobs...'
  },
  {
    key: 'somosgamberros',
    icon: '😈🔥',
    title: 'SomosGamberros (Tute y Repaso Diario)',
    subtitle: 'Bloque diario: 16:40 a 17:15 (35 min)',
    color: '#ec4899',
    placeholder: 'Ej: Repasar conversación / arreglar pantalla o función en SomosGamberros...'
  },
  {
    key: 'soundpulse',
    icon: '🎵🎧',
    title: 'SoundPulse · Local AI Music',
    subtitle: 'Bloque diario: 17:15 a 17:45 (30 min)',
    color: '#8b5cf6',
    placeholder: 'Ej: Mejorar generación local / controles de audio en SoundPulse...'
  },
  {
    key: 'casa_comidas',
    icon: '🛠️🍳',
    title: 'Casa, Comidas/Cenas y Arreglos Antes de las 18:30',
    subtitle: 'Bloque diario: 17:45 a 18:30 (45 min)',
    color: '#f97316',
    placeholder: 'Ej: Arreglar enchufe / dejar preparado pollo para la cena...'
  }
];

function playBeep() {
  try {
    if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 0.14);
    });
  } catch (_) {}
}

export default function IsmaelLifeOrganizer({ onNavigate }) {
  const [organizer, setOrganizer] = useState({
    dailyBlocks: {},
    projects: { cv_curro: [], somosgamberros: [], soundpulse: [], casa_comidas: [] },
    dailyNotes: {},
    jobApplicationsCount: 0
  });
  const [houseTasks, setHouseTasks] = useState([]);
  const [planning, setPlanning] = useState([]);
  const [gymData, setGymData] = useState({ workouts: [] });
  const [newProjectInputs, setNewProjectInputs] = useState({});
  const [newHouseTaskText, setNewHouseTaskText] = useState('');
  const [newHouseTaskCategory, setNewHouseTaskCategory] = useState('reparacion');

  // Cronómetro de enfoque por bloque
  const [focusBlockTitle, setFocusBlockTitle] = useState('');
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [focusRunning, setFocusRunning] = useState(false);

  // Hora actual para iluminar automáticamente qué bloque toca ahora mismo
  const [nowTime, setNowTime] = useState(new Date());

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchAllOrganizerData = async () => {
    try {
      const [orgRes, tasksRes, planRes, gymRes] = await Promise.all([
        fetch('/api/life-organizer'),
        fetch('/api/tasks'),
        fetch('/api/planning'),
        fetch('/api/gym')
      ]);
      if (orgRes.ok) setOrganizer(await orgRes.json());
      if (tasksRes.ok) setHouseTasks(await tasksRes.json());
      if (planRes.ok) setPlanning(await planRes.json());
      if (gymRes.ok) setGymData(await gymRes.json());
    } catch (e) {
      console.error('Error cargando organizador de Ismael:', e);
    }
  };

  useEffect(() => {
    fetchAllOrganizerData();
    const clockId = setInterval(() => setNowTime(new Date()), 30000);
    return () => clearInterval(clockId);
  }, []);

  useEffect(() => {
    if (!focusRunning || focusSeconds <= 0) return;
    const id = setInterval(() => {
      setFocusSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setFocusRunning(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [focusRunning, focusSeconds]);

  const startFocusTimer = (title, mins) => {
    setFocusBlockTitle(title);
    setFocusSeconds(mins * 60);
    setFocusRunning(true);
  };

  const formatMMSS = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleBlockToday = async (blockId) => {
    try {
      const res = await fetch('/api/life-organizer/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayStr, blockId })
      });
      if (res.ok) {
        setOrganizer(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProjectItem = async (projectKey, e) => {
    e.preventDefault();
    const text = (newProjectInputs[projectKey] || '').trim();
    if (!text) return;
    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, text })
      });
      if (res.ok) {
        setOrganizer(await res.json());
        setNewProjectInputs({ ...newProjectInputs, [projectKey]: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleProjectItem = async (projectKey, itemId) => {
    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, itemId })
      });
      if (res.ok) setOrganizer(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProjectItem = async (projectKey, itemId) => {
    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, itemId })
      });
      if (res.ok) setOrganizer(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeJobCount = async (delta) => {
    try {
      const res = await fetch('/api/life-organizer/job-counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
      if (res.ok) setOrganizer(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteHouseTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedBy: 'Ismael' })
      });
      if (res.ok) {
        const tasksRes = await fetch('/api/tasks');
        if (tasksRes.ok) setHouseTasks(await tasksRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddHouseTask = async (e) => {
    e.preventDefault();
    if (!newHouseTaskText.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newHouseTaskText.trim(),
          category: newHouseTaskCategory,
          addedBy: 'Ismael'
        })
      });
      if (res.ok) {
        setNewHouseTaskText('');
        const tasksRes = await fetch('/api/tasks');
        if (tasksRes.ok) setHouseTasks(await tasksRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Detectar en qué bloque horario estamos ahora mismo
  const currentMinutesOfDay = nowTime.getHours() * 60 + nowTime.getMinutes();
  const activeBlockNow = DAILY_SCHEDULE_BLOCKS.find((b) => {
    const startM = b.startHour * 60 + b.startMin;
    const endM = b.endHour * 60 + b.endMin;
    return currentMinutesOfDay >= startM && currentMinutesOfDay < endM;
  }) || DAILY_SCHEDULE_BLOCKS[3];

  const todayBlocksMap = organizer.dailyBlocks?.[todayStr] || {};

  // Comprobar si hoy ya hizo ejercicio en casa o gym en Marbella Fit
  const ismaelTodayWorkouts = (gymData.workouts || []).filter(
    (w) => w.user === 'Ismael' && w.date === todayStr
  );
  const didHomeWorkoutToday = ismaelTodayWorkouts.some((w) => w.type === 'home');
  const didGymWorkoutToday = ismaelTodayWorkouts.some((w) => w.type !== 'home');

  // Comida y Cena de hoy desde el Planificador de Casita
  const todayPlan = (planning || []).find((d) => String(d.dayId) === todayStr);

  // Calcular cuántos bloques de hoy están cumplidos
  const completedBlocksCount = DAILY_SCHEDULE_BLOCKS.filter((b) => {
    if (b.id === 'b-0600' && didHomeWorkoutToday) return true;
    if (b.id === 'b-1830-gym' && didGymWorkoutToday) return true;
    return !!todayBlocksMap[b.id];
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', paddingBottom: '2rem' }}>
      {/* CABECERA Y BRÚJULA EN VIVO: QUÉ TOCA AHORA MISMO PARA CERO CAOS */}
      <div
        className="glass-card"
        style={{
          padding: '1.15rem',
          border: `2px solid ${activeBlockNow.color}`,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{
            background: activeBlockNow.color,
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '0.72rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>
            🧭 Brújula Anti-Caos de Ismael · Ahora mismo ({activeBlockNow.timeRange})
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6ee7b7' }}>
            ✅ {completedBlocksCount} / {DAILY_SCHEDULE_BLOCKS.length} bloques de hoy cumplidos
          </span>
        </div>

        <h2 style={{ margin: '0.2rem 0 0.3rem 0', fontSize: '1.18rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span>{activeBlockNow.icon}</span>
          <span>{activeBlockNow.title}</span>
        </h2>

        <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.84rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.45 }}>
          {activeBlockNow.desc}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {activeBlockNow.durationMin > 0 && (
            <button
              type="button"
              onClick={() => startFocusTimer(activeBlockNow.title, activeBlockNow.durationMin)}
              style={{
                background: activeBlockNow.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ⏱️ Iniciar Cronómetro de este Bloque ({activeBlockNow.durationMin} min)
            </button>
          )}

          <button
            type="button"
            onClick={() => toggleBlockToday(activeBlockNow.id)}
            style={{
              background: todayBlocksMap[activeBlockNow.id] ? '#10b981' : 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '0.55rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {todayBlocksMap[activeBlockNow.id] ? '✅ Bloque de ahora Completado' : '✓ Marcar Bloque de ahora como Hecho'}
          </button>

          {activeBlockNow.actionType === 'gym' && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('gym')}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🏋️ Abrir Marbella Fit →
            </button>
          )}
        </div>
      </div>

      {/* CRONÓMETRO DE ENFOQUE ACTIVO (PARA NO DISPERSARTE ENTRE PROYECTOS) */}
      {(focusRunning || focusSeconds > 0) && (
        <div
          className="glass-card"
          style={{
            padding: '0.9rem 1.1rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(16, 185, 129, 0.2))',
            border: '2px solid #38bdf8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase' }}>
              🎯 Modo Cero Distracciones · Enfoque Activo:
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
              {focusBlockTitle}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#ffffff',
              background: 'rgba(0,0,0,0.35)',
              padding: '0.25rem 0.7rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              ⏱️ {formatMMSS(focusSeconds)}
            </span>

            <button
              type="button"
              onClick={() => setFocusRunning(!focusRunning)}
              style={{
                background: focusRunning ? '#f59e0b' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9px',
                padding: '0.45rem 0.75rem',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {focusRunning ? '⏸️ Pausar' : '▶️ Seguir'}
            </button>

            <button
              type="button"
              onClick={() => { setFocusRunning(false); setFocusSeconds(0); }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9px',
                padding: '0.45rem 0.65rem',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* RESUMEN RÁPIDO CONECTADO CON CASITA: COMIDA/CENA HOY + DEPORTE HOY + ARREGLOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {/* 1. Comida y Cena de Hoy */}
        <div className="glass-card" style={{ padding: '0.9rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#6ee7b7', textTransform: 'uppercase' }}>
              🍽️ Comida y Cena de Hoy
            </span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('planning')}
                style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Editar →
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#ffffff', marginBottom: '0.2rem' }}>
            <strong>☀️ 15:00 Comida:</strong> {todayPlan?.comida || 'Sin apuntar en Planning'}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#ffffff' }}>
            <strong>🌙 20:30 Cena:</strong> {todayPlan?.cena || 'Sin apuntar (adelántala a las 18:00)'}
          </div>
        </div>

        {/* 2. Estado de Deporte Hoy (Casa + Gym con Sandra a las 18:30) */}
        <div className="glass-card" style={{ padding: '0.9rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#fcd34d', textTransform: 'uppercase' }}>
              💪 Tu Deporte de Hoy
            </span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('gym')}
                style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Abrir Gym →
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.84rem', color: '#ffffff', marginBottom: '0.2rem' }}>
            <strong>🏠 En Casa (5m / 8m):</strong>{' '}
            <span style={{ color: didHomeWorkoutToday ? '#6ee7b7' : '#fca5a5', fontWeight: 800 }}>
              {didHomeWorkoutToday ? '✅ Validado hoy' : '⏳ Pendiente'}
            </span>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#ffffff' }}>
            <strong>🏋️ Gym 18:30 con Sandra:</strong>{' '}
            <span style={{ color: didGymWorkoutToday ? '#6ee7b7' : '#fcd34d', fontWeight: 800 }}>
              {didGymWorkoutToday ? '✅ Validado hoy' : '🕡 A las 18:30'}
            </span>
          </div>
        </div>

        {/* 3. Contador de Ofertas / CVs Enviados */}
        <div className="glass-card" style={{ padding: '0.9rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            📨 CVs y Ofertas de Curro Echadas
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff' }}>
                {organizer.jobApplicationsCount || 0}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', marginLeft: '0.4rem' }}>
                candidaturas enviadas
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleChangeJobCount(-1)}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', width: '30px', height: '30px', fontWeight: 900, cursor: 'pointer' }}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleChangeJobCount(1)}
                style={{ background: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', padding: '0 0.65rem', height: '30px', fontWeight: 800, fontSize: '0.76rem', cursor: 'pointer' }}
              >
                +1 Oferta echada
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          LA RUTA DEL DÍA (06:00 A 22:15): CÓMO ENCAJA TODO SIN AGOBIOS
         ======================================================================== */}
      <div className="glass-card" style={{ padding: '1.1rem' }}>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#ffffff' }}>
          ⏰ Tu Mapa Diario (06:00 a 22:15) · El Secreto de las 2h 30m de Oro (16:00 – 18:30)
        </h3>
        <p style={{ margin: '0 0 0.9rem 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)' }}>
          El truco para no bloquearte es <strong>no mezclar tareas</strong>: cada cosa tiene su cajón de 30-40 minutos entre las 16:00 y las 18:30 (antes de que llegue Sandra). Ve marcando cada bloque según lo cumplas hoy:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {DAILY_SCHEDULE_BLOCKS.map((b) => {
            const isAutoDone =
              (b.id === 'b-0600' && didHomeWorkoutToday) ||
              (b.id === 'b-1830-gym' && didGymWorkoutToday);
            const isDone = isAutoDone || !!todayBlocksMap[b.id];
            const isCurrent = activeBlockNow.id === b.id;

            return (
              <div
                key={b.id}
                onClick={() => toggleBlockToday(b.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '12px',
                  background: isDone
                    ? 'rgba(16, 185, 129, 0.14)'
                    : isCurrent
                    ? 'rgba(59, 130, 246, 0.18)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isDone
                    ? '1.5px solid #10b981'
                    : isCurrent
                    ? `2px solid ${b.color}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: isDone ? '#10b981' : b.color,
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.7rem',
                      padding: '0.12rem 0.5rem',
                      borderRadius: '6px',
                      fontFamily: 'monospace'
                    }}>
                      {b.timeRange}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase' }}>
                      {b.category}
                    </span>
                    {isCurrent && (
                      <span style={{ background: '#f59e0b', color: '#0f172a', fontSize: '0.64rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
                        ⚡ AHORA
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: '#ffffff',
                    marginTop: '0.25rem',
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.85 : 1
                  }}>
                    {b.icon} {b.title}
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.15rem', lineHeight: 1.35 }}>
                    {b.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {b.durationMin > 0 && !isDone && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startFocusTimer(b.title, b.durationMin);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '0.35rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                      title="Poner cronómetro para este bloque"
                    >
                      ⏱️ {b.durationMin}m
                    </button>
                  )}

                  <div style={{
                    minWidth: '34px',
                    height: '34px',
                    borderRadius: '9px',
                    background: isDone ? '#10b981' : 'rgba(255,255,255,0.06)',
                    border: isDone ? '1px solid #059669' : '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900
                  }}>
                    {isDone ? '✓' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================
          TUS 4 PROYECTOS EN MARCHA (CV/CURRO, SOMOSGAMBERROS, SOUNDPULSE, CASA)
         ======================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.9rem' }}>
        {PROJECT_CARDS_META.map((proj) => {
          const items = organizer.projects?.[proj.key] || [];
          const pendingCount = items.filter((i) => !i.done).length;
          return (
            <div
              key={proj.key}
              className="glass-card"
              style={{
                padding: '1rem',
                borderTop: `4px solid ${proj.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.7rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#ffffff' }}>
                      {proj.icon} {proj.title}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700, marginTop: '0.1rem' }}>
                      ⏰ {proj.subtitle}
                    </div>
                  </div>
                  <span style={{
                    background: pendingCount === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                    color: pendingCount === 0 ? '#6ee7b7' : '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px'
                  }}>
                    {pendingCount === 0 ? '✅ Al día' : `${pendingCount} pend.`}
                  </span>
                </div>

                {/* Lista de pasos de este proyecto */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.7rem' }}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleProjectItem(proj.key, item.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        background: item.done ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.04)',
                        border: item.done ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        fontSize: '0.82rem',
                        color: item.done ? 'rgba(255,255,255,0.6)' : '#ffffff',
                        textDecoration: item.done ? 'line-through' : 'none',
                        flex: 1
                      }}>
                        {item.done ? '✅ ' : '⬜ '} {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProjectItem(proj.key, item.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Añadir nuevo paso a este proyecto */}
              <form onSubmit={(e) => handleAddProjectItem(proj.key, e)} style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                <input
                  type="text"
                  value={newProjectInputs[proj.key] || ''}
                  onChange={(e) => setNewProjectInputs({ ...newProjectInputs, [proj.key]: e.target.value })}
                  placeholder={proj.placeholder}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    color: '#ffffff',
                    fontSize: '0.78rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: proj.color,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  + Añadir
                </button>
              </form>
            </div>
          );
        })}
      </div>

      {/* ========================================================================
          ARREGLOS Y TAREAS DE CASA PENDIENTES (CONECTADO CON LA PESTAÑA TAREAS)
         ======================================================================== */}
      <div className="glass-card" style={{ padding: '1.1rem', borderLeft: '4px solid #f97316' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>
              🛠️ Arreglos y Tareas de Casa Pendientes ({houseTasks.length})
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)' }}>
              En tu bloque de las <strong>17:55 a 18:30</strong>, elige <strong>SOLO 1</strong> de aquí abajo y táchalo antes de que llegue Sandra:
            </p>
          </div>
        </div>

        <form onSubmit={handleAddHouseTask} style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <select
            value={newHouseTaskCategory}
            onChange={(e) => setNewHouseTaskCategory(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '8px',
              padding: '0.45rem 0.6rem',
              color: '#ffffff',
              fontSize: '0.78rem'
            }}
          >
            <option value="reparacion" style={{ color: '#000' }}>🔧 Arreglo / Reparación</option>
            <option value="domestica" style={{ color: '#000' }}>🧹 Tarea de Casa</option>
          </select>
          <input
            type="text"
            value={newHouseTaskText}
            onChange={(e) => setNewHouseTaskText(e.target.value)}
            placeholder="Apuntar arreglo o tarea en casa (ej: Colgar balda, arreglar grifo, recoger salón...)"
            style={{
              flex: 1,
              minWidth: '200px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '8px',
              padding: '0.45rem 0.65rem',
              color: '#ffffff',
              fontSize: '0.8rem'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            + Apuntar
          </button>
        </form>

        {houseTasks.length === 0 ? (
          <div style={{ color: '#6ee7b7', fontSize: '0.84rem', fontWeight: 700 }}>
            ✅ ¡No hay arreglos ni tareas pendientes ahora mismo en casa!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
            {houseTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ fontSize: '0.83rem', color: '#ffffff' }}>
                  {t.category === 'reparacion' ? '🔧 ' : '🧹 '}
                  {t.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleCompleteHouseTask(t.id)}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✓ Hecho
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
