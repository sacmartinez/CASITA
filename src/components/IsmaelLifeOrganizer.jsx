import React, { useState, useEffect, useRef } from 'react';

// Helper para obtener fecha local en formato YYYY-MM-DD en zona horaria de Madrid (España)
function getMadridDateStr(daysOffset = 0) {
  const d = new Date(Date.now() + daysOffset * 86400000);
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
  } catch (_) {
    return d.toISOString().split('T')[0];
  }
}

// Bloques horarios de Lunes a Viernes adaptados al horario real de Ismael:
// Levanta 06:00 | Curro 07:00-15:00 | Ventana de Oro 16:00-18:30 | Sandra llega 18:30 -> Gym Marbella
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
    title: 'Despertar + 5 min Activación en Casa + Rumbo al Curro',
    category: 'Deporte en Casa',
    color: '#f59e0b',
    desc: 'Nada más levantarte: 5 min de activación en casa (Sentadillas, Flexiones y Plancha), café y para el curro con la mente despejada y el cuerpo activo.',
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
    category: 'Trabajo Principal',
    color: '#64748b',
    desc: 'Cumple tu jornada laboral concentrado y sin cargar con estrés extra. A las 15:00 termina y empieza tu tiempo personal y de futuro.'
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
    desc: 'Regla de oro: al llegar come bien y descansa 20 minutos en el sofá sin pantallas de trabajo ni agobios. Si no desconectas aquí, a las 17:00 estarás sin energía.',
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
    color: '#2563eb',
    desc: '40 minutos sagrados con el móvil en silencio: actualizar tu CV en papel (para imprimir limpio) y digital (LinkedIn / InfoJobs) y enviar ofertas nuevas.',
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
    color: '#db2777',
    desc: '35 minutos diarios para darle caña a SomosGamberros: repasar el estado general, probar funciones y sacar adelante 1 mejora concreta al día.',
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
    color: '#7c3aed',
    desc: '30 minutos para avanzar en SoundPulse sin dispersarte. Elige 1 mejora de audio, prompt o interfaz y dale foco completo hasta las 17:45.',
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
    color: '#ea580c',
    desc: 'Antes de que llegue Sandra a las 18:30: haz el reto de 8 min (Brazos y Tableta) en el salón, tacha 1 arreglo pendiente y deja la cena adelantada.',
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
    color: '#059669',
    desc: 'A las 18:30 Sandra llega y tú ya tienes tus proyectos, tu CV y la casa listos. Os vais juntos al Gimnasio Marbella a entrenar relajados y con la cabeza despejada.',
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
    title: 'Ducha, Cenar Juntos y Desconexión (Dormir ~22:15)',
    category: 'Cena y Descanso',
    color: '#0284c7',
    desc: 'Como adelantaste la cena a las 18:00, en 10 min estáis cenando. Disfrutad la noche y a dormir sobre las 22:15 para levantarte a las 06:00 como nuevo.'
  }
];

const PROJECT_CARDS_META = [
  {
    key: 'cv_curro',
    icon: '📄💼',
    title: 'Currículum (Papel + Digital) y Búsqueda de Curro',
    timeRange: '16:00 – 16:40 (40 min)',
    badge: 'Futuro Laboral',
    color: '#2563eb',
    placeholder: 'Ej: Pasar CV a plantilla limpia para imprimir / Echar 2 ofertas en InfoJobs...'
  },
  {
    key: 'somosgamberros',
    icon: '😈🔥',
    title: 'SomosGamberros (Tute y Repaso Diario)',
    timeRange: '16:40 – 17:15 (35 min)',
    badge: 'Proyecto Principal',
    color: '#db2777',
    placeholder: 'Ej: Repasar conversación / probar nueva función o diseño...'
  },
  {
    key: 'soundpulse',
    icon: '🎵🎧',
    title: 'SoundPulse · Local AI Music',
    timeRange: '17:15 – 17:45 (30 min)',
    badge: 'Local AI Music',
    color: '#7c3aed',
    placeholder: 'Ej: Mejorar generación local / probar modelos / afinar controles...'
  },
  {
    key: 'casa_comidas',
    icon: '🛠️🍳',
    title: 'Casa, Cena Adelantada y Reto 8 min Salón',
    timeRange: '17:45 – 18:30 (45 min)',
    badge: 'Hogar y Físico',
    color: '#ea580c',
    placeholder: 'Ej: Arreglar enchufe o persiana / dejar pollo troceado para la cena...'
  }
];

const LOCAL_STORAGE_KEY = 'ismael_life_organizer_v1';

function getInitialOrganizerState() {
  const defaultState = {
    dailyBlocks: {},
    projects: {
      cv_curro: [
        { id: 'cv-1', text: 'Actualizar CV en formato Papel (limpio, directo, listo para imprimir)', done: false },
        { id: 'cv-2', text: 'Actualizar CV Digital (PDF moderno + perfil de LinkedIn / InfoJobs)', done: false },
        { id: 'cv-3', text: 'Buscar ofertas nuevas y enviar al menos 2-3 candidaturas', done: false }
      ],
      somosgamberros: [
        { id: 'sg-1', text: 'Repaso diario general de SomosGamberros (revisar estado y pendientes)', done: false },
        { id: 'sg-2', text: 'Meter 1 mejora o corrección diaria en SomosGamberros', done: false }
      ],
      soundpulse: [
        { id: 'sp-1', text: 'Revisar interfaz y generación de audio en SoundPulse (Local AI Music)', done: false },
        { id: 'sp-2', text: 'Mejorar flujo/modelo local o añadir nueva función a SoundPulse', done: false }
      ],
      casa_comidas: [
        { id: 'cc-1', text: 'Revisar comida/cena del día y dejar adelantada la cena antes de las 18:30', done: false },
        { id: 'cc-2', text: 'Hacer 1 arreglo o tarea pendiente de casa (20-25 min)', done: false }
      ]
    },
    dailyNotes: {},
    jobApplicationsCount: 0
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        projects: {
          ...defaultState.projects,
          ...(parsed.projects || {})
        }
      };
    }
  } catch (_) {}
  return defaultState;
}

function playBeep() {
  try {
    if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.14);
    });
  } catch (_) {}
}

export default function IsmaelLifeOrganizer({ onNavigate }) {
  // Estado inicial instantáneo desde localStorage (cero reseteos, cero pantallas en blanco)
  const [organizer, setOrganizer] = useState(getInitialOrganizerState);
  const [houseTasks, setHouseTasks] = useState([]);
  const [planning, setPlanning] = useState([]);
  const [gymData, setGymData] = useState({ workouts: [] });
  const [newProjectInputs, setNewProjectInputs] = useState({});
  const [newHouseTaskText, setNewHouseTaskText] = useState('');
  const [newHouseTaskCategory, setNewHouseTaskCategory] = useState('reparacion');

  // Pestaña activa del organizador: 'schedule' (Horario) | 'projects' (Ventana de Oro) | 'diary' (Reflexión)
  const [activeTab, setActiveTab] = useState('schedule');

  // Feedback visual de persistencia en tiempo real
  const [syncStatus, setSyncStatus] = useState('🟢 Todo guardado');

  // Cronómetro de enfoque por bloque
  const [focusBlockTitle, setFocusBlockTitle] = useState('');
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [focusRunning, setFocusRunning] = useState(false);

  // Reloj local en vivo
  const [nowTime, setNowTime] = useState(new Date());

  const noteTimeoutRef = useRef(null);

  const todayStr = getMadridDateStr(0);

  // Guardar en localStorage de forma inmediata y actualizar estado local
  const persistLocally = (nextState) => {
    setOrganizer(nextState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
    } catch (_) {}
  };

  // Cargar datos del servidor al montar
  const fetchAllOrganizerData = async () => {
    try {
      const [orgRes, tasksRes, planRes, gymRes] = await Promise.all([
        fetch('/api/life-organizer'),
        fetch('/api/tasks'),
        fetch('/api/planning'),
        fetch('/api/gym')
      ]);

      if (orgRes.ok) {
        const serverOrg = await orgRes.json();
        // Combinar datos locales con el servidor para que ningún check local reciente se borre
        setOrganizer(prev => {
          const merged = {
            ...serverOrg,
            dailyBlocks: {
              ...(serverOrg.dailyBlocks || {}),
              [todayStr]: {
                ...((serverOrg.dailyBlocks && serverOrg.dailyBlocks[todayStr]) || {}),
                ...((prev.dailyBlocks && prev.dailyBlocks[todayStr]) || {})
              }
            },
            projects: {
              ...(serverOrg.projects || {}),
              ...(prev.projects || {})
            },
            dailyNotes: {
              ...(serverOrg.dailyNotes || {}),
              ...(prev.dailyNotes || {})
            },
            jobApplicationsCount: Math.max(serverOrg.jobApplicationsCount || 0, prev.jobApplicationsCount || 0)
          };
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (_) {}
          return merged;
        });
      }
      if (tasksRes.ok) setHouseTasks(await tasksRes.json());
      if (planRes.ok) setPlanning(await planRes.json());
      if (gymRes.ok) setGymData(await gymRes.json());
    } catch (e) {
      console.warn('Cargando con caché local offline:', e);
    }
  };

  useEffect(() => {
    fetchAllOrganizerData();
    const clockId = setInterval(() => setNowTime(new Date()), 20000);
    return () => clearInterval(clockId);
  }, []);

  // Cronómetro regresivo de bloque
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatMMSS = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Marcar / Desmarcar un bloque horario de hoy (optimista 0ms + servidor)
  const toggleBlockToday = async (blockId) => {
    const currentDone = !!organizer.dailyBlocks?.[todayStr]?.[blockId];
    const nextDone = !currentDone;

    const nextDailyBlocks = {
      ...(organizer.dailyBlocks || {}),
      [todayStr]: {
        ...((organizer.dailyBlocks && organizer.dailyBlocks[todayStr]) || {}),
        [blockId]: nextDone
      }
    };
    const nextState = { ...organizer, dailyBlocks: nextDailyBlocks };
    persistLocally(nextState);
    setSyncStatus('💾 Guardando...');

    try {
      const res = await fetch('/api/life-organizer/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayStr, blockId, done: nextDone })
      });
      if (res.ok) {
        const srvData = await res.json();
        persistLocally(srvData);
        setSyncStatus('🟢 Guardado en local y nube');
        setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
      }
    } catch (e) {
      setSyncStatus('💾 Guardado en tu dispositivo');
    }
  };

  // Añadir tarea a uno de los 4 proyectos de la tarde
  const handleAddProjectItem = async (projectKey, e) => {
    e.preventDefault();
    const text = (newProjectInputs[projectKey] || '').trim();
    if (!text) return;

    const tempItem = {
      id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      text,
      done: false,
      createdAt: new Date().toISOString()
    };
    const currentList = organizer.projects?.[projectKey] || [];
    const nextState = {
      ...organizer,
      projects: {
        ...(organizer.projects || {}),
        [projectKey]: [...currentList, tempItem]
      }
    };
    persistLocally(nextState);
    setNewProjectInputs(prev => ({ ...prev, [projectKey]: '' }));
    setSyncStatus('💾 Guardando tarea...');

    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, text })
      });
      if (res.ok) {
        const srvData = await res.json();
        persistLocally(srvData);
        setSyncStatus('🟢 Guardado');
        setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
      }
    } catch (e) {
      setSyncStatus('💾 Guardado en tu dispositivo');
    }
  };

  // Tachar / Destachar tarea de proyecto
  const handleToggleProjectItem = async (projectKey, itemId) => {
    const currentList = organizer.projects?.[projectKey] || [];
    const nextList = currentList.map(item => item.id === itemId ? { ...item, done: !item.done } : item);
    const nextState = {
      ...organizer,
      projects: {
        ...(organizer.projects || {}),
        [projectKey]: nextList
      }
    };
    persistLocally(nextState);
    setSyncStatus('💾 Guardando...');

    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, itemId })
      });
      if (res.ok) {
        const srvData = await res.json();
        persistLocally(srvData);
        setSyncStatus('🟢 Guardado');
        setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
      }
    } catch (e) {
      setSyncStatus('💾 Guardado en tu dispositivo');
    }
  };

  // Eliminar tarea de proyecto
  const handleDeleteProjectItem = async (projectKey, itemId) => {
    const currentList = organizer.projects?.[projectKey] || [];
    const nextList = currentList.filter(item => item.id !== itemId);
    const nextState = {
      ...organizer,
      projects: {
        ...(organizer.projects || {}),
        [projectKey]: nextList
      }
    };
    persistLocally(nextState);
    setSyncStatus('💾 Guardando...');

    try {
      const res = await fetch('/api/life-organizer/project', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectKey, itemId })
      });
      if (res.ok) {
        const srvData = await res.json();
        persistLocally(srvData);
        setSyncStatus('🟢 Guardado');
        setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
      }
    } catch (e) {
      setSyncStatus('💾 Guardado en tu dispositivo');
    }
  };

  // Contador de ofertas / CVs
  const handleChangeJobCount = async (delta) => {
    const nextCount = Math.max(0, (Number(organizer.jobApplicationsCount) || 0) + delta);
    const nextState = { ...organizer, jobApplicationsCount: nextCount };
    persistLocally(nextState);
    setSyncStatus('💾 Guardando...');

    try {
      const res = await fetch('/api/life-organizer/job-counter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
      if (res.ok) {
        const srvData = await res.json();
        persistLocally(srvData);
        setSyncStatus('🟢 Guardado');
        setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
      }
    } catch (e) {
      setSyncStatus('💾 Guardado en tu dispositivo');
    }
  };

  // Nota diaria
  const handleDailyNoteChange = (text) => {
    const nextNotes = {
      ...(organizer.dailyNotes || {}),
      [todayStr]: text
    };
    const nextState = { ...organizer, dailyNotes: nextNotes };
    persistLocally(nextState);
    setSyncStatus('💾 Guardando nota...');

    if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
    noteTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/life-organizer/note', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: todayStr, note: text })
        });
        if (res.ok) {
          setSyncStatus('🟢 Nota guardada');
          setTimeout(() => setSyncStatus('🟢 Todo guardado'), 2500);
        }
      } catch (_) {
        setSyncStatus('💾 Guardada en tu dispositivo');
      }
    }, 1000);
  };

  // Tareas del hogar de Casita
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

  // Detectar qué bloque horario está activo en este momento exacto
  const currentMinutesOfDay = nowTime.getHours() * 60 + nowTime.getMinutes();
  const activeBlockNow = DAILY_SCHEDULE_BLOCKS.find((b) => {
    const startM = b.startHour * 60 + b.startMin;
    const endM = b.endHour * 60 + b.endMin;
    return currentMinutesOfDay >= startM && currentMinutesOfDay < endM;
  }) || DAILY_SCHEDULE_BLOCKS[3];

  const todayBlocksMap = organizer.dailyBlocks?.[todayStr] || {};

  // Validaciones cruzadas de Marbella Fit
  const ismaelTodayWorkouts = (gymData.workouts || []).filter(
    (w) => w.user === 'Ismael' && w.date === todayStr
  );
  const didHomeWorkoutToday = ismaelTodayWorkouts.some((w) => w.type === 'home');
  const didGymWorkoutToday = ismaelTodayWorkouts.some((w) => w.type !== 'home');

  // Comida y Cena de hoy desde Planning
  const todayPlan = (planning || []).find((d) => String(d.dayId) === todayStr);

  // Contar bloques completados hoy
  const completedBlocksCount = DAILY_SCHEDULE_BLOCKS.filter((b) => {
    if (b.id === 'b-0600' && didHomeWorkoutToday) return true;
    if (b.id === 'b-1830-gym' && didGymWorkoutToday) return true;
    return !!todayBlocksMap[b.id];
  }).length;

  const progressPercent = Math.round((completedBlocksCount / DAILY_SCHEDULE_BLOCKS.length) * 100);

  // Formatear fecha bonita en español (ej: "Martes, 17 de noviembre")
  const formattedTodayDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(nowTime);

  return (
    <div style={{
      maxWidth: '880px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#0f172a',
      paddingBottom: '3rem'
    }}>
      {/* =========================================================================
          CONTENEDOR PLANIFICADOR: DISEÑO CÓMODO, CLARO Y LIMPIO (ESTILO AGENDA NOTION)
         ========================================================================= */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden'
      }}>
        {/* CABECERA PRINCIPAL ELEGANTE CON FECHA Y PROGRESO */}
        <div style={{
          padding: '1.4rem 1.6rem',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🧭</span>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
                  Diario y Planificador Personal · Ismael
                </h1>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>
                  📅 {formattedTodayDate} · Rutina Diaria (06:00 a 22:15)
                </p>
              </div>
            </div>

            {/* Píldora de estado de guardado instantáneo */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#334155'
            }}>
              <span>{syncStatus}</span>
            </div>
          </div>

          {/* Barra de progreso de objetivos del día */}
          <div style={{ marginTop: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.35rem', color: '#475569' }}>
              <span>Cumplimiento del Día:</span>
              <span style={{ color: progressPercent >= 75 ? '#059669' : '#2563eb' }}>
                {completedBlocksCount} de {DAILY_SCHEDULE_BLOCKS.length} bloques ({progressPercent}%)
              </span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent >= 75
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #3b82f6, #2563eb)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS DEL PLANIFICADOR */}
        <div style={{
          display: 'flex',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.4rem 1rem',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'schedule' ? '#ffffff' : 'transparent',
              color: activeTab === 'schedule' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'schedule' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'schedule' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>⏰</span>
            <span>Agenda & Horarios (06:00 a 22:15)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'projects' ? '#ffffff' : 'transparent',
              color: activeTab === 'projects' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'projects' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'projects' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>⚡</span>
            <span>Ventana de Oro (16:00 a 18:30)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'diary' ? '#ffffff' : 'transparent',
              color: activeTab === 'diary' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'diary' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'diary' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>📝</span>
            <span>Diario & Notas de Hoy</span>
          </button>
        </div>

        {/* =====================================================================
            BANNER FIJO: QUÉ TOCA AHORA MISMO (BRÚJULA EN VIVO)
           ===================================================================== */}
        <div style={{
          padding: '1rem 1.4rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              background: activeBlockNow.color,
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 900,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              letterSpacing: '0.4px',
              textTransform: 'uppercase'
            }}>
              Ahora ({activeBlockNow.timeRange})
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
              {activeBlockNow.icon} {activeBlockNow.title}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {activeBlockNow.durationMin > 0 && (
              <button
                type="button"
                onClick={() => startFocusTimer(activeBlockNow.title, activeBlockNow.durationMin)}
                style={{
                  background: '#ffffff',
                  color: activeBlockNow.color,
                  border: `1.5px solid ${activeBlockNow.color}`,
                  borderRadius: '10px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ⏱️ Foco {activeBlockNow.durationMin} min
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleBlockToday(activeBlockNow.id)}
              style={{
                background: todayBlocksMap[activeBlockNow.id] ? '#059669' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {todayBlocksMap[activeBlockNow.id] ? '✓ Bloque Hecho' : '○ Marcar Hecho'}
            </button>
          </div>
        </div>

        {/* CRONÓMETRO DE ENFOQUE FLOTANTE ACTIVO */}
        {(focusRunning || focusSeconds > 0) && (
          <div style={{
            padding: '0.9rem 1.4rem',
            background: '#eff6ff',
            borderBottom: '2px solid #3b82f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>
                🎯 Modo Enfoque Sin Distracciones:
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e3a8a' }}>
                {focusBlockTitle}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#1e3a8a',
                background: '#ffffff',
                padding: '0.2rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid #bfdbfe'
              }}>
                ⏱️ {formatMMSS(focusSeconds)}
              </span>

              <button
                type="button"
                onClick={() => setFocusRunning(!focusRunning)}
                style={{
                  background: focusRunning ? '#f59e0b' : '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {focusRunning ? '⏸️ Pausa' : '▶️ Seguir'}
              </button>

              <button
                type="button"
                onClick={() => { setFocusRunning(false); setFocusSeconds(0); }}
                style={{
                  background: '#ffffff',
                  color: '#64748b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                ✕ Cerrar
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            PESTAÑA 1: AGENDA Y HORARIOS (VISIÓN CÓMODA Y CRONOLÓGICA)
           ===================================================================== */}
        {activeTab === 'schedule' && (
          <div style={{ padding: '1.4rem' }}>
            <div style={{ marginBottom: '1.1rem' }}>
              <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Agenda Cronológica · 06:00 a 22:15
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Marca cada bloque conforme lo cumples. Todo queda guardado al instante en tu móvil y en el servidor.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {DAILY_SCHEDULE_BLOCKS.map((block) => {
                const isCurrentBlock = activeBlockNow.id === block.id;
                let isDone = !!todayBlocksMap[block.id];
                if (block.id === 'b-0600' && didHomeWorkoutToday) isDone = true;
                if (block.id === 'b-1830-gym' && didGymWorkoutToday) isDone = true;

                return (
                  <div
                    key={block.id}
                    style={{
                      background: isDone ? '#f0fdf4' : '#ffffff',
                      borderRadius: '16px',
                      border: isCurrentBlock ? `2px solid ${block.color}` : '1px solid #e2e8f0',
                      borderLeft: `5px solid ${block.color}`,
                      padding: '1.1rem 1.3rem',
                      boxShadow: isCurrentBlock ? '0 4px 16px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: isDone ? '#dcfce7' : '#f1f5f9',
                          color: isDone ? '#166534' : '#334155',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1'
                        }}>
                          {block.timeRange}
                        </span>

                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: block.color,
                          background: '#f8fafc',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px'
                        }}>
                          {block.category}
                        </span>

                        {isCurrentBlock && (
                          <span style={{
                            background: block.color,
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '0.68rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase'
                          }}>
                            ▶ En este momento
                          </span>
                        )}
                      </div>

                      {/* Botón táctil grande de Hecho */}
                      <button
                        type="button"
                        onClick={() => toggleBlockToday(block.id)}
                        style={{
                          background: isDone ? '#059669' : '#f8fafc',
                          color: isDone ? '#ffffff' : '#334155',
                          border: isDone ? '1px solid #047857' : '1.5px solid #cbd5e1',
                          borderRadius: '10px',
                          padding: '0.45rem 0.9rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {isDone ? '✓ Completado' : '○ Marcar Hecho'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{block.icon}</span>
                      <h3 style={{
                        margin: 0,
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: isDone ? '#166534' : '#0f172a',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {block.title}
                      </h3>
                    </div>

                    <p style={{
                      margin: 0,
                      fontSize: '0.84rem',
                      color: isDone ? '#15803d' : '#475569',
                      lineHeight: 1.45
                    }}>
                      {block.desc}
                    </p>

                    {/* Acciones del bloque: Cronómetro y enlaces directos */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.3rem' }}>
                      {block.durationMin > 0 && (
                        <button
                          type="button"
                          onClick={() => startFocusTimer(block.title, block.durationMin)}
                          style={{
                            background: '#ffffff',
                            border: `1.5px solid ${block.color}`,
                            color: block.color,
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⏱️ Foco {block.durationMin} min
                        </button>
                      )}

                      {block.projectKey && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('projects')}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          📂 Ver Checklist de este Proyecto →
                        </button>
                      )}

                      {block.actionType === 'gym' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('gym')}
                          style={{
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#047857',
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🏋️ Ir a Marbella Fit →
                        </button>
                      )}

                      {block.actionType === 'planning' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('planning')}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            color: '#475569',
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🍽️ Ver Planning de Comidas →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            PESTAÑA 2: VENTANA DE ORO (LOS 4 PROYECTOS SAGRADOS 16:00 A 18:30)
           ===================================================================== */}
        {activeTab === 'projects' && (
          <div style={{ padding: '1.4rem' }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                ⚡ De 16:00 a 18:30 (2 horas y media sagradas)
              </div>
              <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Los 4 Proyectos Clave de Ismael
              </h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Tu futuro laboral, tus proyectos propios y la casa listos antes de que llegue Sandra a las 18:30.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {PROJECT_CARDS_META.map((meta) => {
                const items = organizer.projects?.[meta.key] || [];
                const completedCount = items.filter(i => i.done).length;

                return (
                  <div
                    key={meta.key}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      borderTop: `4px solid ${meta.color}`,
                      padding: '1.2rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Encabezado del proyecto */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{meta.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                            {meta.title}
                          </h3>
                          <span style={{ fontSize: '0.74rem', color: meta.color, fontWeight: 700 }}>
                            ⏰ {meta.timeRange}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        background: completedCount === items.length && items.length > 0 ? '#dcfce7' : '#f1f5f9',
                        color: completedCount === items.length && items.length > 0 ? '#166534' : '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        {completedCount} / {items.length} tareas hechas
                      </span>
                    </div>

                    {/* WIDGET ESPECIAL 1: CONTADOR DE OFERTAS PARA CV Y CURRO */}
                    {meta.key === 'cv_curro' && (
                      <div style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        padding: '0.8rem 1rem',
                        marginBottom: '0.9rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.6rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>
                            📨 Candidaturas y Ofertas Enviadas:
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a' }}>
                              {organizer.jobApplicationsCount || 0}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: '#3b82f6' }}>
                              candidaturas en total
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleChangeJobCount(-1)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              borderRadius: '8px',
                              width: '32px',
                              height: '32px',
                              fontWeight: 900,
                              cursor: 'pointer'
                            }}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChangeJobCount(1)}
                            style={{
                              background: '#2563eb',
                              border: 'none',
                              color: '#ffffff',
                              borderRadius: '8px',
                              padding: '0 0.8rem',
                              height: '32px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            +1 Oferta enviada
                          </button>
                        </div>
                      </div>
                    )}

                    {/* WIDGET ESPECIAL 2: COMIDA/CENA Y RETO CASA EN EL BLOQUE 4 */}
                    {meta.key === 'casa_comidas' && (
                      <div style={{
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        borderRadius: '12px',
                        padding: '0.8rem 1rem',
                        marginBottom: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#c2410c', textTransform: 'uppercase' }}>
                          🍽️ Menú de Hoy en Casita:
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#9a3412' }}>
                          <strong>☀️ Comida (15:00):</strong> {todayPlan?.comida || 'Sin apuntar en Planning'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#9a3412' }}>
                          <strong>🌙 Cena (dejar adelantada a las 18:00):</strong> {todayPlan?.cena || 'Sin apuntar en Planning'}
                        </div>
                      </div>
                    )}

                    {/* LISTA DE TAREAS DEL PROYECTO */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.9rem' }}>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '10px',
                            background: item.done ? '#f8fafc' : '#ffffff',
                            border: item.done ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                            gap: '0.6rem'
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flex: 1 }}>
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => handleToggleProjectItem(meta.key, item.id)}
                              style={{ width: '18px', height: '18px', accentColor: meta.color, cursor: 'pointer' }}
                            />
                            <span style={{
                              fontSize: '0.84rem',
                              color: item.done ? '#94a3b8' : '#1e293b',
                              textDecoration: item.done ? 'line-through' : 'none',
                              lineHeight: 1.35
                            }}>
                              {item.text}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteProjectItem(meta.key, item.id)}
                            title="Eliminar tarea"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              padding: '0.2rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* FORMULARIO PARA AÑADIR NUEVA TAREA */}
                    <form
                      onSubmit={(e) => handleAddProjectItem(meta.key, e)}
                      style={{ display: 'flex', gap: '0.45rem' }}
                    >
                      <input
                        type="text"
                        value={newProjectInputs[meta.key] || ''}
                        onChange={(e) => setNewProjectInputs({ ...newProjectInputs, [meta.key]: e.target.value })}
                        placeholder={meta.placeholder}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.82rem',
                          outline: 'none',
                          color: '#0f172a'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: meta.color,
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 0.9rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        + Añadir
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            PESTAÑA 3: DIARIO PERSONAL & NOTAS DE HOY
           ===================================================================== */}
        {activeTab === 'diary' && (
          <div style={{ padding: '1.4rem' }}>
            <div style={{ marginBottom: '1.1rem' }}>
              <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Diario y Reflexión de Hoy ({formattedTodayDate})
              </h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Escribe lo que has sacado adelante hoy, ideas para mañana o reflexiones del día. Se guarda automáticamente según escribes.
              </p>
            </div>

            <div style={{
              background: '#fdfbf7',
              border: '1px solid #e7e0d3',
              borderRadius: '16px',
              padding: '1.2rem',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase' }}>
                  📝 Bloc de Notas Personal
                </span>
                <span style={{ fontSize: '0.72rem', color: '#a8a29e' }}>
                  Auto-guardado activo
                </span>
              </div>

              <textarea
                value={organizer.dailyNotes?.[todayStr] || ''}
                onChange={(e) => handleDailyNoteChange(e.target.value)}
                placeholder="Escribe aquí... Ej: Hoy he echado 2 CVs, dejado la cena lista y avanzado en el buscador de SomosGamberros..."
                rows={10}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: '#292524',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
