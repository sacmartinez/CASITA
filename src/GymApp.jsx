import React, { useState, useEffect } from 'react';

const GOAL_OPTIONS = [
  {
    id: 'grasa',
    icon: '🔥',
    label: 'Perder Peso y Quemar Grasa',
    shortLabel: 'Perder Peso',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    kcalTarget: { Ismael: 1950, Sandra: 1600 },
    desc: 'Bajar kilos de grasa manteniendo el músculo firme, combinando máquinas y cardio.'
  },
  {
    id: 'tonificar',
    icon: '⚡',
    label: 'Tonificar y Ponerse en Forma',
    shortLabel: 'Tonificar',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    kcalTarget: { Ismael: 2150, Sandra: 1750 },
    desc: 'Ganar firmeza muscular, agilidad, resistencia y verte mejor.'
  },
  {
    id: 'hipertrofia',
    icon: '💪',
    label: 'Ganar Músculo y Fuerza',
    shortLabel: 'Músculo y Fuerza',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    kcalTarget: { Ismael: 2500, Sandra: 2000 },
    desc: 'Subir kilos en las máquinas semana a semana y desarrollar masa muscular.'
  },
  {
    id: 'gluteo',
    icon: '🍑',
    label: 'Foco Pierna, Glúteo y Abdomen',
    shortLabel: 'Pierna y Glúteo',
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    kcalTarget: { Ismael: 2100, Sandra: 1700 },
    desc: 'Priorizar tren inferior, glúteos fuertes y cintura firme.'
  },
  {
    id: 'movilidad',
    icon: '🧘',
    label: 'Espalda Sana y Cero Impacto',
    shortLabel: 'Espalda Sana',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    kcalTarget: { Ismael: 2100, Sandra: 1700 },
    desc: 'Quitar dolores de espalda del trabajo, mejorar postura y cuidar rodillas.'
  }
];

// Plan de 4 días en el Gimnasio Marbella (rotación automática al llegar al gimnasio)
const GYM_DAYS = [
  {
    id: 'dia-1',
    dayNumber: 1,
    shortTab: 'Día 1: Cuerpo Completo',
    title: '🔥 Día 1: Full Body + Cardio (Gimnasio Marbella)',
    subtitle: 'Activa piernas, espalda, pecho y remata quemando calorías',
    duration: 50,
    exercises: [
      { name: 'Prensa de Piernas', machine: 'Máquina de Prensa (Placas)', sets: 3, baseReps: 12, baseKg: { Ismael: 45, Sandra: 25 }, stepKg: 5, isCardio: false, tip: 'Pies a la anchura de los hombros. Empuja con los talones sin bloquear rodillas.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Polea Alta (Espalda)', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Saca pecho y baja la barra hasta la clavícula tirando con los codos.' },
      { name: 'Press de Pecho Sentado', machine: 'Máquina de Pecho', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Hombros atrás pegados al respaldo al empujar.' },
      { name: 'Plancha Abdominal en Colchoneta', machine: 'Zona Colchonetas', sets: 3, baseReps: '35 seg', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Aprieta abdomen y glúteo manteniendo el cuerpo recto.' },
      { name: 'Cinta Inclinada o Elíptica', machine: 'Zona Cardio', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Cinta con pendiente 6-8% a paso rápido (5 km/h) o Elíptica.' }
    ]
  },
  {
    id: 'dia-2',
    dayNumber: 2,
    shortTab: 'Día 2: Pierna y Glúteo',
    title: '🍑 Día 2: Pierna, Glúteo y Abdomen + Elíptica',
    subtitle: 'Trabaja los músculos más grandes para quemar más calorías todo el día',
    duration: 50,
    exercises: [
      { name: 'Prensa de Piernas (Pies altos para Glúteo)', machine: 'Máquina de Prensa', sets: 3, baseReps: 12, baseKg: { Ismael: 50, Sandra: 30 }, stepKg: 5, isCardio: false, tip: 'Apoya los pies un poco más arriba para activar más el glúteo.' },
      { name: 'Curl Femoral (Parte trasera muslo)', machine: 'Máquina Femoral', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Controla la vuelta del peso en 2 segundos sin dar tirones.' },
      { name: 'Extensión de Cuádriceps Sentado', machine: 'Máquina Cuádriceps', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Aguanta 1 segundo arriba apretando el muslo.' },
      { name: 'Máquina de Abductores (Abrir piernas)', machine: 'Máquina Abductores', sets: 3, baseReps: 15, baseKg: { Ismael: 35, Sandra: 25 }, stepKg: 2.5, isCardio: false, tip: 'Abre con control y aguanta 1 segundo.' },
      { name: 'Puente de Glúteo + Abdominales', machine: 'Zona Colchonetas', sets: 3, baseReps: '15 reps', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Tumbado boca arriba, sube la cadera apretando glúteo.' },
      { name: 'Bicicleta Elíptica Sin Impacto', machine: 'Zona Cardio', sets: 1, baseReps: '18 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Ritmo continuo moviendo también los brazos.' }
    ]
  },
  {
    id: 'dia-3',
    dayNumber: 3,
    shortTab: 'Día 3: Torso y Brazos',
    title: '💪 Día 3: Espalda, Pecho, Hombros y Brazos',
    subtitle: 'Mejora la postura, tonifica brazos y termina con cardio ligero',
    duration: 50,
    exercises: [
      { name: 'Remo Sentado en Polea Baja', machine: 'Polea Baja (Gironda)', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Espalda recta, lleva el agarre hacia el ombligo juntando escápulas.' },
      { name: 'Contractora Pectoral (Mariposa)', machine: 'Máquina Pec Deck', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Junta los brazos delante sintiendo el pecho.' },
      { name: 'Press de Hombros en Máquina', machine: 'Máquina de Hombros', sets: 3, baseReps: 12, baseKg: { Ismael: 15, Sandra: 7.5 }, stepKg: 2.5, isCardio: false, tip: 'Empuja hacia arriba sin arquear la espalda.' },
      { name: 'Extensión de Tríceps en Polea', machine: 'Estación de Poleas', sets: 3, baseReps: 12, baseKg: { Ismael: 15, Sandra: 7.5 }, stepKg: 2.5, isCardio: false, tip: 'Pega los codos a las costillas; solo mueve los antebrazos.' },
      { name: 'Curl de Bíceps (Mancuernas o Polea)', machine: 'Mancuernas / Polea Baja', sets: 3, baseReps: 12, baseKg: { Ismael: 10, Sandra: 5 }, stepKg: 2, isCardio: false, tip: 'Sube sin balancear el cuerpo.' },
      { name: 'Caminata Inclinada o Bici Estática', machine: 'Zona Cardio', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: '20 minutos finales para rematar el gasto calórico.' }
    ]
  },
  {
    id: 'dia-4',
    dayNumber: 4,
    shortTab: 'Día 4: Cardio / Clase',
    title: '🚴 Día 4: Quema-Calorías (Circuito o Clase del Marbella)',
    subtitle: 'Spinning, Zumba, TRX o Circuito de Cardio para sudar y disfrutar',
    duration: 45,
    exercises: [
      { name: 'Bloque 1: Cinta con Inclinación', machine: 'Zona Cardio - Cinta', sets: 1, baseReps: '15 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Pendiente entre 5% y 8% a paso ligero.' },
      { name: 'Bloque 2: Remo y Sentadilla en TRX + Abdomen', machine: 'Zona Funcional TRX', sets: 3, baseReps: '12 + 12', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Usa las cuerdas TRX para hacer 12 sentadillas y 12 remos seguidos.' },
      { name: 'Bloque 3: Elíptica o Clase Colectiva', machine: 'Elíptica / Sala Clases', sets: 1, baseReps: '15-20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, tip: 'Alterna 2 minutos suaves con 1 minuto rápido.' }
    ]
  }
];

// Rutinas Express para hacer en CASA (Salón o Despacho) antes o después del curro
const HOME_ROUTINES = [
  {
    id: 'casa-manana',
    title: '☀️ Antes del Curro: Despertar y Activar (5 min)',
    place: 'Salón o Despacho · Sin sudar en exceso',
    durationMin: 6,
    calories: 55,
    desc: 'Ideal recién levantado o antes de salir a trabajar: quita la rigidez de espalda, activa el abdomen y te da energía para toda la mañana.',
    exercises: [
      { name: 'Sentadillas al aire (a ritmo fluido)', baseTarget: 15, unit: 'reps', scalePerLevel: 3, tip: 'Baja con la espalda recta empujando con los talones.' },
      { name: 'Flexiones de brazos (en suelo o apoyado en mesa/sofá)', baseTarget: 10, unit: 'reps', scalePerLevel: 2, tip: 'Si en el suelo cuesta mucho al principio, hazlas apoyando las manos en el borde del sofá o escritorio.' },
      { name: 'Plancha Abdominal en alfombra/suelo', baseTarget: 30, unit: 'seg', scalePerLevel: 5, tip: 'Aprieta la tripa y el glúteo sin dejar caer la cadera.' },
      { name: 'Puente de glúteo y movilidad lumbar', baseTarget: 15, unit: 'reps', scalePerLevel: 3, tip: 'Desbloquea la zona baja de la espalda antes de ir al trabajo.' }
    ]
  },
  {
    id: 'casa-tarde',
    title: '🏠 Al Volver del Curro: Circuito Salón (8 min)',
    place: 'Salón · Descargar estrés y quemar calorías',
    durationMin: 8,
    calories: 85,
    desc: 'Para los días que no vais al gimnasio o queréis sumar un extra en el salón antes de ducharse y cenar.',
    exercises: [
      { name: 'Flexiones de pecho', baseTarget: 12, unit: 'reps', scalePerLevel: 2, tip: 'Controla la bajada y empuja fuerte al subir.' },
      { name: 'Abdominales (Crunch o Bicicleta en suelo)', baseTarget: 20, unit: 'reps', scalePerLevel: 4, tip: 'Suelta todo el aire al subir apretando el abdomen.' },
      { name: 'Sentadillas o Zancadas alternas', baseTarget: 16, unit: 'reps', scalePerLevel: 4, tip: 'Paso amplio, rodilla firme.' },
      { name: 'Plancha Abdominal Final', baseTarget: 40, unit: 'seg', scalePerLevel: 5, tip: 'Aguanta los últimos segundos respirando corto.' }
    ]
  },
  {
    id: 'casa-reto-flex-abs',
    title: '💪 Reto Obligatorio Express: Flexiones + Abdomen (4 min)',
    place: 'Cualquier rincón de casa · Cero excusas',
    durationMin: 4,
    calories: 45,
    desc: 'Aunque tengas 0 ganas o tiempo: solo son 2 series seguidas de flexiones y abdominales para no romper tu racha diaria.',
    exercises: [
      { name: 'Serie 1: Flexiones + Abdominales seguidos', baseTarget: 12, unit: 'reps de cada', scalePerLevel: 2, tip: 'Haz las flexiones y pasa directo a los abdominales.' },
      { name: 'Serie 2: Flexiones + Plancha isométrica', baseTarget: 12, unit: 'reps + 30s plancha', scalePerLevel: 2, tip: '¡En menos de 4 minutos ya has cumplido contigo hoy!' }
    ]
  }
];

const MARBELLA_MACHINES = [
  { id: 'prensa', name: 'Prensa de Piernas (Placas / Discos)', zone: 'Pierna y Glúteo', icon: '🦵', muscles: 'Cuádriceps · Glúteos · Isquios', setup: 'Asiento donde las rodillas formen 90°.', technique: 'Empuja desde los talones y nunca bloquees las rodillas de golpe.' },
  { id: 'extension-cuadriceps', name: 'Extensión de Cuádriceps', zone: 'Pierna y Glúteo', icon: '🦵', muscles: 'Cuádriceps (muslo frontal)', setup: 'Rodillo justo encima del tobillo.', technique: 'Aguanta 1 segundo arriba apretando el muslo y baja en 2 segundos.' },
  { id: 'curl-femoral', name: 'Curl Femoral (Sentado o Tumbado)', zone: 'Pierna y Glúteo', icon: '🦵', muscles: 'Isquios y Glúteo', setup: 'Rodillo en el talón/tendón de Aquiles.', technique: 'No despegues la cadera al doblar las piernas.' },
  { id: 'abductores', name: 'Máquina de Abductores y Aductores', zone: 'Pierna y Glúteo', icon: '🍑', muscles: 'Glúteo medio y cara interna del muslo', setup: 'Almohadillas hacia dentro para abrir piernas.', technique: 'Abre con control y haz pausa de 1 segundo.' },
  { id: 'jalon-pecho', name: 'Jalón al Pecho en Polea Alta', zone: 'Pecho y Espalda', icon: '🦍', muscles: 'Espalda ancha (Dorsales) · Bíceps', setup: 'Ajusta las almohadillas sobre los muslos.', technique: 'Saca pecho y baja la barra hacia la clavícula (nunca tras nuca).' },
  { id: 'remo-polea', name: 'Remo Sentado en Polea Baja', zone: 'Pecho y Espalda', icon: '🚣', muscles: 'Espalda media · Postura', setup: 'Rodillas ligeramente flexionadas.', technique: 'Espalda recta, tira hacia el abdomen juntando escápulas.' },
  { id: 'press-pecho', name: 'Press de Pecho Sentado en Máquina', zone: 'Pecho y Espalda', icon: '💪', muscles: 'Pectoral · Hombros · Tríceps', setup: 'Agarres a la altura de la mitad del pecho.', technique: 'Hombros pegados atrás contra el respaldo.' },
  { id: 'contractora', name: 'Contractora Pectoral (Pec Deck)', zone: 'Pecho y Espalda', icon: '🦋', muscles: 'Pectoral', setup: 'Codos ligeramente por debajo de los hombros.', technique: 'Junta los brazos al frente controlando el regreso.' },
  { id: 'press-hombro', name: 'Press de Hombros en Máquina', zone: 'Hombros y Brazos', icon: '🏋️‍♂️', muscles: 'Hombros y Tríceps', setup: 'Agarres a la altura de las orejas.', technique: 'Empuja hacia arriba sin arquear la zona lumbar.' },
  { id: 'polea-triceps-biceps', name: 'Estación de Poleas (Tríceps / Bíceps)', zone: 'Hombros y Brazos', icon: '💪', muscles: 'Tríceps y Bíceps', setup: 'Polea alta para tríceps; baja para bíceps.', technique: 'Codos pegados al cuerpo sin balancearte.' },
  { id: 'cinta', name: 'Cinta de Correr (Zona Cardio)', zone: 'Cardio', icon: '🏃', muscles: 'Quema de grasa · Corazón', setup: 'Inclinación 6-8% y velocidad 4.8-5.4 km/h.', technique: 'Caminar rápido en cuesta quema muchísima grasa sin dañar rodillas.' },
  { id: 'eliptica', name: 'Bicicleta Elíptica y Spinning', zone: 'Cardio', icon: '⚡', muscles: 'Cardio sin impacto articular', setup: 'Resistencia media (nivel 4-7).', technique: 'Mueve brazos y piernas de forma fluida.' }
];

const MOTIVATIONAL_QUOTES = [
  "✨ Nunca te arrepentirás de haber entrenado hoy. ¡El paso más difícil ya lo has dado al cruzar la puerta!",
  "💪 No entrenas para castigar a tu cuerpo, entrenas porque te quieres y quieres sentirte fuerte y con energía.",
  "🔥 Un entrenamiento de 45 minutos es solo el 3% de tu día. ¡Regálate este rato para ti!",
  "🌟 La motivación te hace empezar, pero el hábito que estáis creando juntos os hará imparables.",
  "🦋 Dentro de un mes agradecerás muchísimo no haberte quedado hoy en el sofá. ¡Vamos a por ello!",
  "⚡ No tienes que hacerlo perfecto hoy, solo tienes que cumplir. Cada serie suma.",
  "🏆 Tu única competición eres tú misma ayer. Un poquito más de fuerza hoy es una gran victoria.",
  "💖 Recuerda la sensación tan increíble con la que vas a salir por la puerta cuando termines esta sesión.",
  "🚀 Los días que menos apetece ir al gimnasio son exactamente los días que más cuentan.",
  "🌈 Cuerpo en movimiento, mente en calma. Usa este entreno para soltar todo el estrés del día.",
  "🔥 No busques resultados en un día, busca sentirte orgullosa cada vez que terminas tu rutina.",
  "👫 Entrenar en equipo multiplica las ganas por dos. ¡Hoy vais a salir del Marbella con una sonrisa enorme!",
  "💎 La disciplina es elegir entre lo que te apetece ahora mismo y lo que más quieres conseguir.",
  "✨ Cada gota de esfuerzo de hoy es energía, salud y confianza para mañana. ¡Tú puedes con esto y más!"
];

const USER_PINS = {
  Ismael: '280894',
  Sandra: '100415'
};

function GymApp({ onBackToCasita }) {
  const [unlockedUser, setUnlockedUser] = useState(() => {
    const saved = localStorage.getItem('marbella_fit_unlocked_user');
    return (saved === 'Ismael' || saved === 'Sandra') ? saved : null;
  });
  const [loginTargetUser, setLoginTargetUser] = useState(() => {
    const saved = localStorage.getItem('hogar_user');
    return (saved === 'Ismael' || saved === 'Sandra') ? saved : 'Ismael';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const activeUser = unlockedUser || 'Ismael';
  // Pestañas: Ismael tiene 'gym' | 'home' | 'nutrition' | 'machines'. Sandra tiene 'gym' | 'nutrition' | 'machines' (sin 'home')
  const [activeTab, setActiveTab] = useState('gym');

  // Datos del servidor
  const [workouts, setWorkouts] = useState([]);
  const [bodyWeights, setBodyWeights] = useState([]);
  const [meals, setMeals] = useState([]);
  const [waterLogs, setWaterLogs] = useState({});
  const [goals, setGoals] = useState({
    Ismael: { goalType: 'grasa', goalLabel: '🔥 Perder Peso y Quemar Grasa', customFocus: '', level: 'Adaptación / Progresivo', targetDaysPerWeek: 3, targetWeightKg: null },
    Sandra: { goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo', targetDaysPerWeek: 3, targetWeightKg: null }
  });

  // Cronómetro de descanso
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Estado de Pestaña 1: HOY EN EL GIMNASIO
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [trainTogether, setTrainTogether] = useState(false);
  const [feeling, setFeeling] = useState('💪 Muy bien');
  const [gymNotes, setGymNotes] = useState('');
  const [todayExercises, setTodayExercises] = useState([]);
  const [savingGym, setSavingGym] = useState(false);
  const [gymSavedBanner, setGymSavedBanner] = useState('');

  // Estado de Pestaña 2: EN CASA (Salón / Despacho)
  const [selectedHomeIdx, setSelectedHomeIdx] = useState(0);
  const [homeChecked, setHomeChecked] = useState({});
  const [savingHome, setSavingHome] = useState(false);
  const [homeSavedBanner, setHomeSavedBanner] = useState('');

  // Estado de Pestaña 3: COMIDA Y PESO
  const [mealType, setMealType] = useState('Comida');
  const [mealText, setMealText] = useState('');
  const [analyzingMeal, setAnalyzingMeal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightNote, setWeightNote] = useState('');
  const [editingMetaWeight, setEditingMetaWeight] = useState(false);
  const [metaWeightInput, setMetaWeightInput] = useState('');

  // Estado de Pestaña 4: MÁQUINAS, OBJETIVO E HISTORIAL
  const [machineFilter, setMachineFilter] = useState('TODAS');
  const [quoteIdx, setQuoteIdx] = useState(() => new Date().getDate() % MOTIVATIONAL_QUOTES.length);

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    document.title = 'Marbella Fit · Tu Entrenador';
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = '/manifest-gym.json';
  }, []);

  const fetchGymData = async () => {
    try {
      const res = await fetch('/api/gym');
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setBodyWeights(data.bodyWeights || []);
        setMeals(data.meals || []);
        setWaterLogs(data.waterLogs || {});
        if (data.goals) setGoals(data.goals);
      }
    } catch (e) {
      console.error('Error cargando Marbella Fit:', e);
    }
  };

  useEffect(() => {
    fetchGymData();
  }, []);

  // Cronómetro
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) {
      if (timerSeconds <= 0) setTimerRunning(false);
      return;
    }
    const id = setInterval(() => {
      setTimerSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const startTimer = (secs) => {
    setTimerSeconds(secs);
    setTimerRunning(true);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ============================================================================
  // LÓGICA DE AUTO-PROGRESIÓN INTELIGENTE (LAS RUTINAS MEJORAN SOLAS)
  // ============================================================================
  const getSmartProgressionForExercise = (user, exTemplate) => {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const targetName = norm(exTemplate.name);

    // Buscar la última vez que este usuario hizo este ejercicio
    for (const w of workouts) {
      if (w.user !== user) continue;
      for (const loggedEx of (w.exercises || [])) {
        if (loggedEx.completed === false) continue;
        if (norm(loggedEx.name) === targetName || (targetName && norm(loggedEx.name).includes(targetName.slice(0, 10)))) {
          const lastKg = Number(loggedEx.weightKg) || 0;
          const lastRepsNum = parseInt(String(loggedEx.reps), 10) || 12;
          const wentWell = w.feeling !== '😅 Costó bastante';

          if (exTemplate.isCardio || lastKg === 0) {
            return {
              weightKg: 0,
              reps: loggedEx.reps || exTemplate.baseReps,
              badge: `⏮️ Última vez: ${loggedEx.reps || exTemplate.baseReps} · ¡Intenta superar 1-2 min o reps hoy!`,
              isUpgraded: true
            };
          }

          // Si el último entreno fue bien: si hizo < 15 reps, subimos +2 reps; si ya llegó a 15 reps (o cada sesión alterna), subimos el peso (+2.5kg o +5kg)!
          if (wentWell) {
            if (lastRepsNum >= 14) {
              const nextKg = Number((lastKg + (exTemplate.stepKg || 2.5)).toFixed(1));
              return {
                weightKg: nextKg,
                reps: String(exTemplate.baseReps || 12),
                badge: `📈 ¡Subimos nivel! Hoy toca ${nextKg} kg (hiciste ${lastKg} kg × ${lastRepsNum} el último día)`,
                isUpgraded: true
              };
            } else {
              const nextReps = lastRepsNum + 1;
              return {
                weightKg: lastKg,
                reps: String(nextReps),
                badge: `📈 Reto de hoy: ${lastKg} kg × ${nextReps} reps (+1 rep más que el último día)`,
                isUpgraded: true
              };
            }
          }

          return {
            weightKg: lastKg,
            reps: String(lastRepsNum),
            badge: `🎯 Mantener y afianzar: ${lastKg} kg × ${lastRepsNum} reps`,
            isUpgraded: false
          };
        }
      }
    }

    // Si es la primera vez que lo hace: peso inicial recomendado para él/ella
    const startKg = exTemplate.baseKg?.[user] ?? 20;
    return {
      weightKg: startKg,
      reps: String(exTemplate.baseReps),
      badge: startKg > 0 ? `🌱 Peso inicial recomendado: ${startKg} kg` : `🌱 Objetivo inicial: ${exTemplate.baseReps}`,
      isUpgraded: false
    };
  };

  // Detectar automáticamente qué Día (1, 2, 3 o 4) le toca hoy al usuario según su último entrenamiento en el gimnasio
  useEffect(() => {
    const userGymWorkouts = workouts.filter(w => w.user === activeUser && w.type !== 'home');
    if (userGymWorkouts.length > 0) {
      const last = userGymWorkouts[0];
      const lastIdx = GYM_DAYS.findIndex(d => d.id === last.routineId || last.routineName?.includes(`Día ${d.dayNumber}`));
      if (lastIdx !== -1) {
        const nextIdx = (lastIdx + 1) % GYM_DAYS.length;
        setSelectedDayIdx(nextIdx);
      }
    }
  }, [workouts.length, activeUser]);

  // Reconstruir los ejercicios de hoy cuando cambia el día seleccionado o el usuario
  useEffect(() => {
    const dayPlan = GYM_DAYS[selectedDayIdx] || GYM_DAYS[0];
    const built = dayPlan.exercises.map((ex) => {
      const prog = getSmartProgressionForExercise(activeUser, ex);
      return {
        name: ex.name,
        machine: ex.machine,
        sets: ex.sets,
        reps: prog.reps,
        weightKg: prog.weightKg,
        tip: ex.tip,
        badge: prog.badge,
        isUpgraded: prog.isUpgraded,
        isCardio: ex.isCardio,
        completed: true
      };
    });
    setTodayExercises(built);
  }, [selectedDayIdx, activeUser, workouts]);

  // Guardar el entreno de hoy en el gimnasio en 1 clic
  const handleSaveTodayGym = async (e) => {
    e.preventDefault();
    setSavingGym(true);
    setGymSavedBanner('');
    const dayPlan = GYM_DAYS[selectedDayIdx] || GYM_DAYS[0];
    try {
      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: {
            user: activeUser,
            type: 'gym',
            routineId: dayPlan.id,
            date: todayDateStr,
            routineName: dayPlan.title,
            durationMin: dayPlan.duration,
            caloriesBurned: Math.round(dayPlan.duration * 8),
            feeling,
            notes: gymNotes,
            exercises: todayExercises
          },
          together: trainTogether
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setGymNotes('');
        setGymSavedBanner('🎉 ¡Entreno guardado! Para el próximo día tu entrenador ya ha subido tus marcas.');
        setTimeout(() => setGymSavedBanner(''), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingGym(false);
    }
  };

  // Nivel y Racha de ejercicios EN CASA
  const userHomeWorkouts = workouts.filter(w => w.user === activeUser && w.type === 'home');
  const homeLevel = Math.floor(userHomeWorkouts.length / 4) + 1; // Sube 1 nivel cada 4 sesiones en casa
  const didHomeToday = userHomeWorkouts.some(w => w.date === todayDateStr);

  const handleCompleteHomeWorkout = async () => {
    const routine = HOME_ROUTINES[selectedHomeIdx] || HOME_ROUTINES[0];
    setSavingHome(true);
    setHomeSavedBanner('');
    try {
      const scaledExercises = routine.exercises.map(ex => {
        const targetVal = ex.baseTarget + ((homeLevel - 1) * ex.scalePerLevel);
        return {
          name: ex.name,
          machine: 'En Casa (Salón / Despacho)',
          sets: 1,
          reps: `${targetVal} ${ex.unit}`,
          weightKg: 0,
          completed: true
        };
      });

      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: {
            user: activeUser,
            type: 'home',
            routineId: routine.id,
            date: todayDateStr,
            routineName: routine.title,
            durationMin: routine.durationMin,
            caloriesBurned: routine.calories,
            feeling: '🔥 A tope',
            notes: `Nivel en casa ${homeLevel}`,
            exercises: scaledExercises
          },
          together: false
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setHomeChecked({});
        setHomeSavedBanner('🔥 ¡Reto en casa completado! Así se construye la disciplina.');
        setTimeout(() => setHomeSavedBanner(''), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingHome(false);
    }
  };

  // Estadísticas de Peso Corporal
  const userWeights = bodyWeights.filter(w => w.user === activeUser);
  const currentWeight = userWeights.length > 0 ? userWeights[0].weightKg : null;
  const startWeight = userWeights.length > 0 ? userWeights[userWeights.length - 1].weightKg : null;
  const weightDiff = (currentWeight && startWeight) ? Number((currentWeight - startWeight).toFixed(1)) : 0;
  const targetWeight = goals[activeUser]?.targetWeightKg || null;

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!weightInput) return;
    try {
      const res = await fetch('/api/gym/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: activeUser,
          date: todayDateStr,
          weightKg: weightInput,
          note: weightNote
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBodyWeights(data.bodyWeights || []);
        setWeightInput('');
        setWeightNote('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTargetWeight = async () => {
    try {
      const res = await fetch('/api/gym/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: activeUser,
          targetWeightKg: metaWeightInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.goals) setGoals(data.goals);
        setEditingMetaWeight(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Guardar Comida y Analizar con el Entrenador
  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!mealText.trim()) return;
    setAnalyzingMeal(true);
    try {
      const res = await fetch('/api/gym/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: activeUser,
          date: todayDateStr,
          mealType,
          text: mealText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMeals(data.meals || []);
        setMealText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingMeal(false);
    }
  };

  // Vasos de agua hoy
  const waterKey = `${activeUser}_${todayDateStr}`;
  const todayGlasses = waterLogs[waterKey] || 0;
  const changeWater = async (delta) => {
    const next = Math.max(0, todayGlasses + delta);
    setWaterLogs({ ...waterLogs, [waterKey]: next });
    try {
      await fetch('/api/gym/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: activeUser, date: todayDateStr, glasses: next })
      });
    } catch (_) {}
  };

  // Calorías comidas hoy vs quemadas hoy
  const todayUserMeals = meals.filter(m => m.user === activeUser && m.date === todayDateStr);
  const todayKcalIn = todayUserMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  const todayProteinIn = todayUserMeals.reduce((acc, m) => acc + (Number(m.proteinG) || 0), 0);
  const todayKcalBurned = workouts
    .filter(w => w.user === activeUser && w.date === todayDateStr)
    .reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0);

  const activeGoalObj = GOAL_OPTIONS.find(g => g.id === (goals[activeUser]?.goalType || 'grasa')) || GOAL_OPTIONS[0];
  const recommendedDailyKcal = activeGoalObj.kcalTarget?.[activeUser] || 1850;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === USER_PINS[loginTargetUser]) {
      setUnlockedUser(loginTargetUser);
      localStorage.setItem('marbella_fit_unlocked_user', loginTargetUser);
      localStorage.setItem('hogar_user', loginTargetUser);
      setPinInput('');
      setPinError('');
      if (loginTargetUser === 'Sandra' && activeTab === 'home') {
        setActiveTab('gym');
      }
    } else {
      setPinError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleLogoutProfile = () => {
    setUnlockedUser(null);
    localStorage.removeItem('marbella_fit_unlocked_user');
    setPinInput('');
    setPinError('');
  };

  // Estilos claros, limpios y muy legibles
  const S = {
    page: {
      minHeight: '100vh',
      background: '#f4f7fb',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '90px'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.65rem 1rem'
    },
    container: {
      maxWidth: '720px',
      margin: '0 auto',
      padding: '0.9rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.9rem'
    },
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '1rem',
      boxShadow: '0 3px 12px rgba(15, 23, 42, 0.04)'
    },
    input: {
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '0.55rem 0.7rem',
      color: '#0f172a',
      fontSize: '0.88rem',
      outline: 'none'
    },
    btnGreen: {
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.8rem 1.1rem',
      fontWeight: 800,
      fontSize: '0.92rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
    },
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '0.4rem 0.3rem calc(0.4rem + env(safe-area-inset-bottom, 0px))',
      boxShadow: '0 -4px 18px rgba(15, 23, 42, 0.06)'
    }
  };

  const currentGymDay = GYM_DAYS[selectedDayIdx] || GYM_DAYS[0];
  const currentHomeRoutine = HOME_ROUTINES[selectedHomeIdx] || HOME_ROUTINES[0];

  const visibleTabs = activeUser === 'Ismael'
    ? [
        { id: 'gym', icon: '🏋️', label: 'Hoy (Gym)' },
        { id: 'home', icon: '🏠', label: 'En Casa' },
        { id: 'nutrition', icon: '🍎', label: 'Comida y Peso' },
        { id: 'machines', icon: '🏢', label: 'Máquinas y Plan' }
      ]
    : [
        { id: 'gym', icon: '🏋️', label: 'Hoy (Gym)' },
        { id: 'nutrition', icon: '🍎', label: 'Comida y Peso' },
        { id: 'machines', icon: '🏢', label: 'Máquinas y Plan' }
      ];

  // Si aún no ha iniciado sesión con su contraseña individual, mostrar pantalla de acceso
  if (!unlockedUser) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.2rem' }}>
        <div style={{ ...S.card, maxWidth: '400px', width: '100%', padding: '1.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: '0.3rem' }}>🏋️</div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
            Marbella Fit
          </h1>
          <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.82rem', color: '#64748b' }}>
            Elige tu perfil personal e introduce tu contraseña
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.1rem' }}>
            {['Ismael', 'Sandra'].map((u) => {
              const isSel = loginTargetUser === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setLoginTargetUser(u); setPinError(''); setPinInput(''); }}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '14px',
                    border: isSel ? (u === 'Ismael' ? '2px solid #2563eb' : '2px solid #db2777') : '1px solid #e2e8f0',
                    background: isSel ? (u === 'Ismael' ? '#eff6ff' : '#fdf2f8') : '#f8fafc',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{u === 'Ismael' ? '👦' : '👧'}</div>
                  {u}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder={`Contraseña de ${loginTargetUser}`}
              style={{
                ...S.input,
                textAlign: 'center',
                fontSize: '1.15rem',
                letterSpacing: '4px',
                fontWeight: 800,
                padding: '0.75rem'
              }}
              autoFocus
              required
            />

            {pinError && (
              <div style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, background: '#fef2f2', padding: '0.5rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                ⚠️ {pinError}
              </div>
            )}

            <button type="submit" style={{ ...S.btnGreen, width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
              🔓 Entrar al Perfil de {loginTargetUser}
            </button>

            {onBackToCasita && (
              <button
                type="button"
                onClick={onBackToCasita}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '0.3rem'
                }}
              >
                ← Volver a Casita Hub
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* CABECERA SIMPLE Y DIRECTA */}
      <header style={S.header}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onBackToCasita && (
              <button
                type="button"
                onClick={onBackToCasita}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  borderRadius: '8px',
                  padding: '0.35rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🏠 Casita
              </button>
            )}
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.02rem', color: '#0f172a' }}>
                {activeUser === 'Ismael' ? '👦 Gym de Ismael' : '👧 Gym de Sandra'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                {activeGoalObj.icon} {activeGoalObj.shortLabel}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Cronómetro con 1 toque */}
            {timerSeconds > 0 ? (
              <button
                type="button"
                onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  color: '#047857',
                  borderRadius: '999px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
              >
                ⏱️ {formatTimer(timerSeconds)} &times;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startTimer(60)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  borderRadius: '999px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⏱️ 60s
              </button>
            )}

            {/* Botón para bloquear / cambiar de usuario con contraseña */}
            <button
              type="button"
              onClick={handleLogoutProfile}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '10px',
                padding: '0.32rem 0.6rem',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Cambiar de perfil"
            >
              🔒 Cambiar perfil
            </button>
          </div>
        </div>
      </header>

      <main style={S.container}>

        {/* Tarjeta de Frase Motivadora antes de entrenar (Visible en Gym y En Casa) */}
        {(activeTab === 'gym' || activeTab === 'home') && (
          <div style={{
            ...S.card,
            padding: '0.85rem 1rem',
            background: activeUser === 'Sandra'
              ? 'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 50%, #ffffff 100%)'
              : 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 50%, #ffffff 100%)',
            border: activeUser === 'Sandra' ? '1px solid #fbcfe8' : '1px solid #bfdbfe',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: activeUser === 'Sandra' ? '#db2777' : '#2563eb',
                marginBottom: '0.2rem',
                letterSpacing: '0.3px'
              }}>
                💬 Tu dosis de motivación pre-entreno, {activeUser}
              </div>
              <div style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.38,
                fontStyle: 'italic'
              }}>
                "{MOTIVATIONAL_QUOTES[quoteIdx]}"
              </div>
            </div>

            <button
              type="button"
              onClick={nextQuote}
              style={{
                background: '#ffffff',
                border: activeUser === 'Sandra' ? '1px solid #f9a8d4' : '1px solid #93c5fd',
                color: activeUser === 'Sandra' ? '#be185d' : '#1d4ed8',
                borderRadius: '10px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
              title="Ver otra frase motivadora"
            >
              ✨ Otra frase
            </button>
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 1: 🏋️ HOY EN EL GYM (FÁCIL, RÁPIDO Y CON AUTO-PROGRESIÓN)
           ==================================================================== */}
        {activeTab === 'gym' && (
          <>
            {/* Selector de los 4 Días de Gimnasio (Se selecciona solo el que te toca hoy) */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                  📍 Al llegar al Gimnasio Marbella · ¿Qué toca hoy?
                </span>
                {activeUser === 'Ismael' && !didHomeToday && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    style={{
                      background: '#fff7ed',
                      border: '1px solid #fed7aa',
                      color: '#c2410c',
                      borderRadius: '999px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏠 ¿Hoy entrenas en casa? Pulsa aquí →
                  </button>
                )}
              </div>

              {/* Botones Día 1, Día 2, Día 3, Día 4 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.8rem' }}>
                {GYM_DAYS.map((d, idx) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDayIdx(idx)}
                    style={{
                      padding: '0.5rem 0.25rem',
                      borderRadius: '10px',
                      border: selectedDayIdx === idx ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: selectedDayIdx === idx ? '#ecfdf5' : '#f8fafc',
                      color: selectedDayIdx === idx ? '#047857' : '#475569',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    Día {d.dayNumber}
                  </button>
                ))}
              </div>

              <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.12rem', color: '#0f172a' }}>
                {currentGymDay.title}
              </h2>
              <p style={{ margin: '0 0 0.7rem 0', fontSize: '0.8rem', color: '#475569' }}>
                {currentGymDay.subtitle} · ⏱️ ~{currentGymDay.duration} min
              </p>

              {/* Opción de apuntar a los dos si vais juntos */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setTrainTogether(false)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: !trainTogether ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: !trainTogether ? '#eff6ff' : '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {activeUser === 'Ismael' ? '👦 Apuntar a Ismael' : '👧 Apuntar a Sandra'}
                </button>
                <button
                  type="button"
                  onClick={() => setTrainTogether(true)}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: trainTogether ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: trainTogether ? '#ecfdf5' : '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  👫 ¡Vamos juntos! (Guardar a los 2)
                </button>
              </div>
            </div>

            {/* LISTA PASO A PASO DE LAS MÁQUINAS DE HOY */}
            <form onSubmit={handleSaveTodayGym} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {todayExercises.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    ...S.card,
                    padding: '0.9rem',
                    border: ex.completed ? '2px solid #10b981' : '1px solid #e2e8f0',
                    background: ex.completed ? '#ffffff' : '#f8fafc',
                    opacity: ex.completed ? 1 : 0.65
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '0.1rem 0.45rem',
                          fontSize: '0.74rem',
                          fontWeight: 800
                        }}>
                          Paso {idx + 1}
                        </span>
                        <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>{ex.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, marginTop: '0.2rem' }}>
                        📍 {ex.machine} · <strong>{ex.sets} {ex.sets === 1 ? 'bloque' : 'series'}</strong>
                      </div>
                    </div>

                    {/* Botón grande de Hecho / Pendiente */}
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...todayExercises];
                        copy[idx].completed = !copy[idx].completed;
                        setTodayExercises(copy);
                      }}
                      style={{
                        background: ex.completed ? '#10b981' : '#e2e8f0',
                        color: ex.completed ? '#ffffff' : '#475569',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.4rem 0.7rem',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {ex.completed ? '✓ Hecho' : 'Omitir'}
                    </button>
                  </div>

                  {/* Etiqueta de Auto-Progresión del Entrenador */}
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px',
                    background: ex.isUpgraded ? '#ecfdf5' : '#f1f5f9',
                    color: ex.isUpgraded ? '#047857' : '#334155',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {ex.badge}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.35rem' }}>
                    💡 {ex.tip}
                  </div>

                  {/* Controles rápidos y grandes para anotar el peso y las repeticiones de hoy */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginTop: '0.65rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid #f1f5f9',
                    flexWrap: 'wrap'
                  }}>
                    {!ex.isCardio && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Peso hoy:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...todayExercises];
                            copy[idx].weightKg = Math.max(0, (Number(copy[idx].weightKg) || 0) - 2.5);
                            setTodayExercises(copy);
                          }}
                          style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 900, cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          value={ex.weightKg}
                          onChange={(e) => {
                            const copy = [...todayExercises];
                            copy[idx].weightKg = e.target.value;
                            setTodayExercises(copy);
                          }}
                          style={{ ...S.input, width: '64px', textAlign: 'center', fontWeight: 800, padding: '0.35rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...todayExercises];
                            copy[idx].weightKg = (Number(copy[idx].weightKg) || 0) + 2.5;
                            setTodayExercises(copy);
                          }}
                          style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 900, cursor: 'pointer' }}
                        >
                          +
                        </button>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>kg</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>
                        {ex.isCardio ? 'Tiempo/Reps:' : 'Repeticiones:'}
                      </span>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => {
                          const copy = [...todayExercises];
                          copy[idx].reps = e.target.value;
                          setTodayExercises(copy);
                        }}
                        style={{ ...S.input, width: '80px', textAlign: 'center', fontWeight: 800, padding: '0.35rem' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Cómo te has sentido hoy + Botón Guardar */}
              <div style={S.card}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                  ¿Cómo te has sentido en el entreno de hoy? (Sirve para subir o mantener el peso el próximo día)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.7rem' }}>
                  {[
                    { val: '🔥 A tope', label: '🔥 Sobrado (Subir peso)' },
                    { val: '💪 Muy bien', label: '💪 Bien (Progresar)' },
                    { val: '😅 Costó bastante', label: '😅 Justo (Mantener)' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFeeling(opt.val)}
                      style={{
                        padding: '0.5rem 0.3rem',
                        borderRadius: '10px',
                        border: feeling === opt.val ? '2px solid #059669' : '1px solid #cbd5e1',
                        background: feeling === opt.val ? '#ecfdf5' : '#f8fafc',
                        color: '#0f172a',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {gymSavedBanner && (
                  <div style={{
                    background: '#ecfdf5',
                    border: '1px solid #6ee7b7',
                    color: '#047857',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    textAlign: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    {gymSavedBanner}
                  </div>
                )}

                <button type="submit" disabled={savingGym} style={{ ...S.btnGreen, width: '100%', fontSize: '0.98rem', padding: '0.9rem' }}>
                  {savingGym ? 'Guardando...' : `✅ Terminar y Guardar ${currentGymDay.shortTab}`}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ====================================================================
            PESTAÑA 2: 🏠 EN CASA (SALÓN / DESPACHO ANTES O DESPUÉS DEL CURRO)
           ==================================================================== */}
        {activeTab === 'home' && (
          <>
            <div style={{
              ...S.card,
              background: didHomeToday
                ? 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)'
                : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
              border: didHomeToday ? '1px solid #a7f3d0' : '1px solid #fed7aa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.18rem 0.6rem',
                    borderRadius: '999px',
                    background: '#ffffff',
                    color: didHomeToday ? '#059669' : '#ea580c',
                    border: `1px solid ${didHomeToday ? '#a7f3d0' : '#fed7aa'}`
                  }}>
                    {didHomeToday ? '✅ ¡Reto en casa cumplido hoy!' : '⏰ ¡Oblígate 5 minutos hoy en el salón o despacho!'}
                  </span>
                  <h2 style={{ margin: '0.4rem 0 0.15rem 0', fontSize: '1.15rem', color: '#0f172a' }}>
                    🏠 Ejercicios Rápidos en Casa ({activeUser})
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                    Tus repeticiones suben solas cada 4 sesiones completadas · <strong>Nivel actual en casa: Nivel {homeLevel}</strong> ({userHomeWorkouts.length} sesiones hechas).
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de las 3 micro-rutinas de casa */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {HOME_ROUTINES.map((hr, idx) => (
                <button
                  key={hr.id}
                  type="button"
                  onClick={() => { setSelectedHomeIdx(idx); setHomeChecked({}); }}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: selectedHomeIdx === idx ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: selectedHomeIdx === idx ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{hr.title}</strong>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669' }}>⏱️ {hr.durationMin} min</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.2rem' }}>{hr.desc}</div>
                </button>
              ))}
            </div>

            {/* Ejercicios del reto en casa seleccionado */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '1rem', color: '#0f172a' }}>
                📋 Haz estos {currentHomeRoutine.exercises.length} ejercicios seguidos (Nivel {homeLevel}):
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.9rem' }}>
                {currentHomeRoutine.exercises.map((ex, idx) => {
                  const targetVal = ex.baseTarget + ((homeLevel - 1) * ex.scalePerLevel);
                  const isDone = !!homeChecked[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setHomeChecked({ ...homeChecked, [idx]: !isDone })}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: isDone ? '2px solid #10b981' : '1px solid #e2e8f0',
                        background: isDone ? '#ecfdf5' : '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {idx + 1}. {ex.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '0.15rem' }}>
                          🎯 Objetivo hoy: {targetVal} {ex.unit}
                          {homeLevel > 1 && <span style={{ fontSize: '0.7rem', color: '#2563eb', marginLeft: '0.4rem' }}>(+{ (homeLevel - 1) * ex.scalePerLevel } por tu nivel {homeLevel})</span>}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '0.15rem' }}>
                          💡 {ex.tip}
                        </div>
                      </div>

                      <div style={{
                        minWidth: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isDone ? '#10b981' : '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: isDone ? '#ffffff' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.1rem'
                      }}>
                        ✓
                      </div>
                    </div>
                  );
                })}
              </div>

              {homeSavedBanner && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  color: '#047857',
                  padding: '0.7rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  textAlign: 'center',
                  marginBottom: '0.75rem'
                }}>
                  {homeSavedBanner}
                </div>
              )}

              <button
                type="button"
                disabled={savingHome}
                onClick={handleCompleteHomeWorkout}
                style={{ ...S.btnGreen, width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                {savingHome ? 'Registrando...' : '✅ ¡Hecho! Marcar Reto en Casa Completado'}
              </button>
            </div>
          </>
        )}

        {/* ====================================================================
            PESTAÑA 3: 🍎 COMIDA Y PESO (CUÉNTASELO AL ENTRENADOR + BÁSCULA)
           ==================================================================== */}
        {activeTab === 'nutrition' && (
          <>
            {/* BLOQUE 1: BÁSCULA Y CONTROL DE PESO */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.08rem', color: '#0f172a' }}>
                  ⚖️ Peso de {activeUser} y Evolución
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMetaWeight(!editingMetaWeight);
                    setMetaWeightInput(targetWeight || '');
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    borderRadius: '8px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🎯 {targetWeight ? `Meta: ${targetWeight} kg (Cambiar)` : 'Poner Peso Meta'}
                </button>
              </div>

              {editingMetaWeight && (
                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '10px' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={metaWeightInput}
                    onChange={(e) => setMetaWeightInput(e.target.value)}
                    placeholder="¿A qué peso quieres llegar? (ej: 74)"
                    style={{ ...S.input, flex: 1 }}
                  />
                  <button type="button" onClick={handleSaveTargetWeight} style={S.btnGreen}>
                    Guardar Meta
                  </button>
                </div>
              )}

              {/* Tarjetas de números grandes de Peso */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>PESO ACTUAL</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '0.15rem' }}>
                    {currentWeight ? `${currentWeight} kg` : '—'}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>CAMBIO TOTAL</div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: weightDiff <= 0 ? '#059669' : '#d97706',
                    marginTop: '0.15rem'
                  }}>
                    {userWeights.length > 1 ? `${weightDiff > 0 ? '+' : ''}${weightDiff} kg` : '0 kg'}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>PESO META</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2563eb', marginTop: '0.15rem' }}>
                    {targetWeight ? `${targetWeight} kg` : 'Sin fijar'}
                  </div>
                </div>
              </div>

              {/* Apuntar el peso de hoy */}
              <form onSubmit={handleAddWeight} style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={`Peso hoy de ${activeUser} (kg)`}
                  style={{ ...S.input, width: '165px' }}
                  required
                />
                <input
                  type="text"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  placeholder="Nota opcional (ej: en ayunas)"
                  style={{ ...S.input, flex: 1, minWidth: '150px' }}
                />
                <button type="submit" style={{ ...S.btnGreen, padding: '0.55rem 0.95rem', fontSize: '0.84rem' }}>
                  + Apuntar Peso
                </button>
              </form>

              {userWeights.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', marginTop: '0.7rem', paddingBottom: '0.2rem' }}>
                  {userWeights.slice(0, 6).map(w => (
                    <div key={w.id} style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                      <strong>{w.weightKg} kg</strong> <span style={{ color: '#64748b' }}>({w.date.slice(5)})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BLOQUE 2: CUÉNTALE QUÉ HAS COMIDO A TU ENTRENADOR */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.08rem', color: '#0f172a' }}>
                    🍎 Cuéntame qué has comido hoy ({activeUser})
                  </h2>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    Escríbelo normal y tu entrenador calculará las calorías y te dirá cómo vas hoy.
                  </p>
                </div>

                {/* Contador de agua rápido */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.3rem 0.6rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0369a1' }}>💧 Agua: {todayGlasses} vasos</span>
                  <button type="button" onClick={() => changeWater(-1)} style={{ border: 'none', background: '#ffffff', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 900 }}>-</button>
                  <button type="button" onClick={() => changeWater(1)} style={{ border: 'none', background: '#0284c7', color: '#fff', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 900 }}>+</button>
                </div>
              </div>

              {/* Balance calórico de hoy */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.7rem 0.85rem',
                marginBottom: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CALORÍAS COMIDAS HOY</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                    {todayKcalIn} / ~{recommendedDailyKcal} kcal <span style={{ fontSize: '0.76rem', color: '#059669' }}>({todayProteinIn}g proteína)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>QUEMADAS EN ENTRENO HOY</span>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ea580c' }}>
                    🔥 -{todayKcalBurned} kcal
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddMeal} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['Desayuno', 'Comida', 'Merienda / Picoteo', 'Cena'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMealType(t)}
                      style={{
                        background: mealType === t ? '#0f172a' : '#f1f5f9',
                        color: mealType === t ? '#ffffff' : '#475569',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.35rem 0.7rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={mealText}
                    onChange={(e) => setMealText(e.target.value)}
                    placeholder={`¿Qué has tomado en tu ${mealType.toLowerCase()}? (ej: Pechuga de pollo con ensalada y pan)`}
                    style={{ ...S.input, flex: 1, minWidth: '210px' }}
                    required
                  />
                  <button type="submit" disabled={analyzingMeal} style={S.btnGreen}>
                    {analyzingMeal ? 'Analizando...' : '🤖 Contárselo al Entrenador'}
                  </button>
                </div>
              </form>

              {/* Lista de comidas registradas con el consejo del entrenador */}
              {meals.filter(m => m.user === activeUser).length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', margin: '0.5rem 0' }}>
                  Aún no me has contado qué has comido hoy. ¡Apunta tu desayuno o comida arriba y te digo cómo vas!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {meals.filter(m => m.user === activeUser).slice(0, 12).map(m => (
                    <div
                      key={m.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                            {m.mealType} ({m.date})
                          </span>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginTop: '0.1rem' }}>
                            "{m.text}"
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.18rem 0.5rem', borderRadius: '6px' }}>
                            ~{m.calories} kcal · {m.proteinG}g prot
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await fetch(`/api/gym/meals/${m.id}`, { method: 'DELETE' });
                              if (res.ok) {
                                const d = await res.json();
                                setMeals(d.meals || []);
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem' }}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.4rem', fontSize: '0.76rem', color: '#047857', background: '#ecfdf5', padding: '0.45rem 0.65rem', borderRadius: '8px' }}>
                        <strong>{m.score}:</strong> {m.coachFeedback}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================================
            PESTAÑA 4: 🏢 MÁQUINAS MARBELLA, OBJETIVO PERSONAL E HISTORIAL
           ==================================================================== */}
        {activeTab === 'machines' && (
          <>
            {/* Selector de Objetivo de cada uno */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0f172a' }}>
                🎯 ¿Cuál es el objetivo principal de {activeUser}?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {GOAL_OPTIONS.map(g => {
                  const isSel = (goals[activeUser]?.goalType || 'grasa') === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={async () => {
                        const updated = { ...(goals[activeUser] || {}), goalType: g.id, goalLabel: `${g.icon} ${g.label}` };
                        setGoals({ ...goals, [activeUser]: updated });
                        await fetch('/api/gym/goals', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ user: activeUser, ...updated })
                        });
                      }}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '12px',
                        border: isSel ? `2px solid ${g.color}` : '1px solid #e2e8f0',
                        background: isSel ? g.bg : '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>{g.icon} {g.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.15rem' }}>{g.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guía de Máquinas del Gimnasio Marbella */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#0f172a' }}>
                🏢 Máquinas del Gimnasio Marbella (Vía Lusitana 1)
              </h3>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {['TODAS', 'Pierna y Glúteo', 'Pecho y Espalda', 'Hombros y Brazos', 'Cardio'].map(z => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setMachineFilter(z)}
                    style={{
                      background: machineFilter === z ? '#0f172a' : '#f1f5f9',
                      color: machineFilter === z ? '#ffffff' : '#334155',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.65rem' }}>
                {MARBELLA_MACHINES
                  .filter(m => machineFilter === 'TODAS' || m.zone === machineFilter)
                  .map(m => (
                    <div key={m.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.8rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{m.icon} {m.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.15rem' }}>🎯 {m.muscles}</div>
                      <div style={{ fontSize: '0.74rem', color: '#334155', marginTop: '0.35rem' }}>
                        <strong>⚙️ Ajuste:</strong> {m.setup}<br />
                        <strong>🎓 Cómo hacerla:</strong> {m.technique}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Historial reciente de entrenamientos del perfil activo */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '1rem', color: '#0f172a' }}>
                🏅 Historial de Entrenamientos de {activeUser} ({workouts.filter(w => w.user === activeUser).length})
              </h3>
              {workouts.filter(w => w.user === activeUser).length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Aquí irán apareciendo todos tus entrenos completados, {activeUser}.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {workouts.filter(w => w.user === activeUser).slice(0, 15).map(w => (
                    <div key={w.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                          {w.routineName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          📅 {w.date} · ⏱️ {w.durationMin} min · 🔥 ~{w.caloriesBurned} kcal · {w.feeling}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm('¿Borrar este entrenamiento?')) return;
                          const res = await fetch(`/api/gym/workouts/${w.id}`, { method: 'DELETE' });
                          if (res.ok) {
                            const d = await res.json();
                            setWorkouts(d.workouts || []);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </main>

      {/* BARRA INFERIOR ADAPTADA AL PERFIL (4 pestañas para Ismael con En Casa, 3 para Sandra solo Gym) */}
      <nav
        style={{
          ...S.bottomNav,
          gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)`
        }}
        aria-label="Menú principal Marbella Fit"
      >
        {visibleTabs.map(tab => {
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.15rem',
                padding: '0.2rem 0',
                cursor: 'pointer',
                color: isAct ? '#059669' : '#64748b',
                fontWeight: isAct ? 800 : 600,
                fontSize: '0.72rem'
              }}
            >
              <span style={{
                fontSize: '1.25rem',
                background: isAct ? '#ecfdf5' : 'transparent',
                padding: '0.12rem 0.7rem',
                borderRadius: '999px'
              }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default GymApp;
