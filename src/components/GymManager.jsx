import React, { useState, useEffect } from 'react';

const MARBELLA_MACHINES = [
  // ZONA CARDIO
  {
    id: 'cinta',
    name: 'Cinta de Correr (Caminata Inclinada / Trote)',
    zone: 'Cardio',
    icon: '🏃',
    muscles: 'Cardiovascular · Quema de grasa · Tren inferior',
    beginnerWeight: 'Pendiente 6-8% · 4.8-5.5 km/h',
    technique: 'Para perder grasa sin castigar las rodillas, camina a paso ligero (4.8 a 5.5 km/h) con inclinación entre el 6% y el 10% durante 20-25 min al final de las pesas. ¡Importante: no te cuelgues de las barras laterales!',
    isCardio: true
  },
  {
    id: 'eliptica',
    name: 'Bicicleta Elíptica',
    zone: 'Cardio',
    icon: '⚡',
    muscles: 'Cardio cuerpo completo · Cero impacto articular',
    beginnerWeight: 'Nivel resistencia 4-7 · 20 min',
    technique: 'Ideal para calentar (5-8 min) o hacer cardio quema-grasa sin ningún impacto en tobillos ni rodillas. Empuja también con los brazos para activar espalda y pecho.',
    isCardio: true
  },
  {
    id: 'bici',
    name: 'Bicicleta Estática / Ciclo Indoor (Spinning)',
    zone: 'Cardio',
    icon: '🚴',
    muscles: 'Cardiovascular · Cuádriceps y Glúteo',
    beginnerWeight: 'Resistencia media · 20-45 min',
    technique: 'Ajusta la altura del sillín a la altura de tu cadera estando de pie. Al pedalear abajo del todo, la rodilla debe quedar ligeramente flexionada, nunca bloqueada.',
    isCardio: true
  },
  // PIERNA Y GLÚTEO
  {
    id: 'prensa',
    name: 'Prensa de Piernas (Máquina de Placas / Discos)',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Cuádriceps · Glúteos · Isquiotibiales',
    beginnerWeight: 'Ismael: 45-60 kg | Sandra: 25-35 kg',
    technique: 'Coloca los pies a la anchura de los hombros en el centro de la plataforma (más arriba enfoca más el glúteo). Baja controlando hasta 90° y al empujar NUNCA bloquees las rodillas del todo.',
    isCardio: false
  },
  {
    id: 'extension-cuadriceps',
    name: 'Extensión de Cuádriceps Sentado',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Cuádriceps (cara frontal del muslo)',
    beginnerWeight: 'Ismael: 25-35 kg | Sandra: 15-20 kg',
    technique: 'Ajusta el respaldo para que tu rodilla coincida con el eje de giro de la máquina. El rodillo debe apoyar sobre el empeine/tobillo. Sube en 1 segundo, aguanta 1 segundo arriba y baja en 2 segundos.',
    isCardio: false
  },
  {
    id: 'curl-femoral',
    name: 'Curl Femoral (Sentado o Tumbado)',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Isquiotibiales (parte trasera del muslo) y Glúteo',
    beginnerWeight: 'Ismael: 25-35 kg | Sandra: 15-20 kg',
    technique: 'Aprieta el abdomen contra el banco o respaldo para no arquear la zona lumbar al flexionar las piernas. Controla el retorno de las placas sin que choquen.',
    isCardio: false
  },
  {
    id: 'abductores',
    name: 'Máquina de Abductores y Aductores',
    zone: 'Pierna y Glúteo',
    icon: '🍑',
    muscles: 'Glúteo medio/superior y cara interna del muslo',
    beginnerWeight: 'Ismael: 30-40 kg | Sandra: 25-35 kg',
    technique: 'En abducción (abrir piernas), mantén la espalda pegada o inclínate ligeramente hacia delante sujetando los agarres, abre con control y aguanta 1 segundo en máxima apertura.',
    isCardio: false
  },
  {
    id: 'multipower',
    name: 'Multipower (Barra Guiada) - Sentadilla / Hip Thrust',
    zone: 'Pierna y Glúteo',
    icon: '🏋️',
    muscles: 'Glúteos · Pierna completa · Core',
    beginnerWeight: 'Barra sola o +5-10 kg por lado',
    technique: 'Al ser una barra guiada por raíles es muy segura. Adelanta ligeramente los pies respecto a tu cadera al hacer sentadilla para proteger la rodilla y activar más el glúteo.',
    isCardio: false
  },
  // ESPALDA Y PECHO
  {
    id: 'jalon-pecho',
    name: 'Jalón al Pecho en Polea Alta',
    zone: 'Espalda y Pecho',
    icon: '🦍',
    muscles: 'Dorsales (Espalda ancha) · Bíceps · Mejora postural',
    beginnerWeight: 'Ismael: 30-40 kg | Sandra: 15-25 kg',
    technique: 'Agarra la barra un poco más ancho que tus hombros. Saca pecho, inclínate solo 10° atrás y tira de la barra hacia la parte superior del pecho llevando los codos hacia abajo. ¡Nunca tires tras la nuca!',
    isCardio: false
  },
  {
    id: 'remo-polea',
    name: 'Remo Sentado en Polea Baja (Gironda)',
    zone: 'Espalda y Pecho',
    icon: '🚣',
    muscles: 'Espalda media · Romboides · Bíceps',
    beginnerWeight: 'Ismael: 30-40 kg | Sandra: 15-25 kg',
    technique: 'Rodillas semiflexionadas, espalda totalmente recta y pecho fuera. Lleva el agarre hacia el ombligo juntando las escápulas atrás sin balancear el tronco.',
    isCardio: false
  },
  {
    id: 'press-pecho',
    name: 'Press de Pecho Sentado en Máquina',
    zone: 'Espalda y Pecho',
    icon: '💪',
    muscles: 'Pectoral · Hombro anterior · Tríceps',
    beginnerWeight: 'Ismael: 25-35 kg | Sandra: 10-15 kg',
    technique: 'Ajusta el asiento para que los agarres queden a la altura de la mitad del pecho. Mantén los hombros atrás y abajo (pegados al respaldo) mientras empujas.',
    isCardio: false
  },
  {
    id: 'contractora',
    name: 'Contractora Pectoral / Pec Deck (Mariposa)',
    zone: 'Espalda y Pecho',
    icon: '🦋',
    muscles: 'Pectoral (tonificación y firmeza)',
    beginnerWeight: 'Ismael: 20-30 kg | Sandra: 10-15 kg',
    technique: 'Codos ligeramente flexionados a la altura del pecho. Junta los brazos delante sintiendo el trabajo en el pecho y vuelve despacio sin que los brazos pasen demasiado hacia atrás de tu cuerpo.',
    isCardio: false
  },
  // HOMBRO, BRAZOS Y CORE
  {
    id: 'press-hombro',
    name: 'Press de Hombros en Máquina / Mancuernas',
    zone: 'Hombro, Brazo y Core',
    icon: '🏋️‍♂️',
    muscles: 'Deltoides (Hombros) · Tríceps',
    beginnerWeight: 'Ismael: 15-25 kg | Sandra: 5-10 kg',
    technique: 'Espalda bien apoyada en el respaldo. Empuja hacia arriba sin encoger el cuello y baja hasta que las manos queden a la altura de las orejas.',
    isCardio: false
  },
  {
    id: 'polea-triceps-biceps',
    name: 'Estación de Poleas (Extensión Tríceps / Curl Bíceps)',
    zone: 'Hombro, Brazo y Core',
    icon: '💪',
    muscles: 'Tríceps (parte trasera del brazo) y Bíceps',
    beginnerWeight: 'Ismael: 12-20 kg | Sandra: 5-10 kg',
    technique: 'Pega los codos a las costillas como si tuvieran pegamento. Solo se mueve el antebrazo; así aislarás el brazo al 100% y eliminarás la flacidez del tríceps.',
    isCardio: false
  },
  {
    id: 'trx-colchoneta',
    name: 'Zona Funcional: TRX, Colchonetas y Fitball',
    zone: 'Hombro, Brazo y Core',
    icon: '🧘',
    muscles: 'Abdomen (Core) · Glúteo · Estabilidad',
    beginnerWeight: 'Peso corporal',
    technique: 'Perfecto para hacer planchas abdominales (3 series de 30-45 seg), puente de glúteo en suelo, remo en TRX o sentadillas asistidas con TRX.',
    isCardio: false
  },
  {
    id: 'clases-piscina',
    name: 'Salas Colectivas (Spinning, Zumba, Pilates) y Piscina',
    zone: 'Clases y Piscina',
    icon: '🏊',
    muscles: 'Quema calórica alta · Flexibilidad · Diversión en pareja',
    beginnerWeight: '45-50 min por sesión',
    technique: 'El Gimnasio Marbella incluye clases colectivas (Zumba, Ciclo, Pilates, Yoga) y su mítica piscina de verano + sauna. ¡Hacer 1 clase a la semana juntos suma muchísimo gasto calórico!',
    isCardio: true
  }
];

const DEFAULT_MARBELLA_ROUTINES = [
  {
    id: 'marbella-dia-1',
    title: '🔥 Día 1: Full Body A + Cardio Quema-Grasa',
    subtitle: 'Ideal para empezar · Activa todo el cuerpo y dispara el metabolismo',
    duration: '50 min',
    calories: '~380-450 kcal',
    goal: 'Perder grasa y tonificar todo el cuerpo',
    coachTip: 'Haced primero las máquinas de fuerza (vacían las reservas de azúcar muscular) y dejad los 20 min de cinta inclinada o elíptica para el final: ¡así quemaréis grasa pura desde el minuto 1 del cardio!',
    exercises: [
      { name: 'Calentamiento en Elíptica', machine: 'Bicicleta Elíptica', sets: 1, reps: '5 min', weightKg: 0, durationMin: 5, tip: 'Ritmo suave para lubricar rodillas y hombros.' },
      { name: 'Prensa de Piernas', machine: 'Prensa de Piernas (Máquina de Placas / Discos)', sets: 3, reps: '12-15', weightKg: 35, durationMin: 0, tip: 'Pies anchura de hombros, baja controlado sin despegar la cadera.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Jalón al Pecho en Polea Alta', sets: 3, reps: '12', weightKg: 25, durationMin: 0, tip: 'Saca pecho y lleva la barra a la clavícula.' },
      { name: 'Press de Pecho en Máquina', machine: 'Press de Pecho Sentado en Máquina', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Exhala al empujar, hombros lejos de las orejas.' },
      { name: 'Plancha Abdominal en Colchoneta', machine: 'Zona Funcional: TRX, Colchonetas y Fitball', sets: 3, reps: '30 seg', weightKg: 0, durationMin: 0, tip: 'Aprieta abdomen y glúteo como una tabla.' },
      { name: 'Caminata Inclinada Quema-Grasa', machine: 'Cinta de Correr (Caminata Inclinada / Trote)', sets: 1, reps: '20 min', weightKg: 0, durationMin: 20, tip: 'Inclinación 6-8% a velocidad 4.8-5.2 km/h sin sujetarte.' }
    ]
  },
  {
    id: 'marbella-dia-2',
    title: '🍑 Día 2: Pierna, Glúteo y Abdomen + Elíptica',
    subtitle: 'Los músculos más grandes del cuerpo = Mayor gasto calórico',
    duration: '50 min',
    calories: '~400-480 kcal',
    goal: 'Tonificar tren inferior, glúteo y cintura',
    coachTip: 'Las piernas y los glúteos son el "motor" que más calorías consume incluso cuando estáis descansando en el sofá por la noche. No tengáis prisa entre series (60-75s de descanso).',
    exercises: [
      { name: 'Activación en Bicicleta Estática', machine: 'Bicicleta Estática / Ciclo Indoor (Spinning)', sets: 1, reps: '5 min', weightKg: 0, durationMin: 5, tip: 'Pedaleo fluido para calentar caderas y rodillas.' },
      { name: 'Prensa de Piernas (Pies altos para Glúteo)', machine: 'Prensa de Piernas (Máquina de Placas / Discos)', sets: 3, reps: '12-15', weightKg: 40, durationMin: 0, tip: 'Empuja desde los talones.' },
      { name: 'Curl Femoral en Máquina', machine: 'Curl Femoral (Sentado o Tumbado)', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Controla la subida y bajada en 2 segundos.' },
      { name: 'Extensión de Cuádriceps', machine: 'Extensión de Cuádriceps Sentado', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Aguanta 1 segundo arriba apretando el muslo.' },
      { name: 'Máquina de Abductores (Glúteo)', machine: 'Máquina de Abductores y Aductores', sets: 3, reps: '15-20', weightKg: 30, durationMin: 0, tip: 'Movimiento fluido y controlado.' },
      { name: 'Puente de Glúteo + Crunch en Colchoneta', machine: 'Zona Funcional: TRX, Colchonetas y Fitball', sets: 3, reps: '15 reps', weightKg: 0, durationMin: 0, tip: 'Sube la cadera apretando glúteo 2 segundos arriba.' },
      { name: 'Cardio Continuo en Elíptica', machine: 'Bicicleta Elíptica', sets: 1, reps: '18 min', weightKg: 0, durationMin: 18, tip: 'Ritmo constante donde puedas hablar pero notes esfuerzo.' }
    ]
  },
  {
    id: 'marbella-dia-3',
    title: '💪 Día 3: Tren Superior Tonificado + Cardio Final',
    subtitle: 'Espalda sana, pecho, hombros y brazos firmes',
    duration: '50 min',
    calories: '~360-420 kcal',
    goal: 'Mejorar postura, definir brazos/espalda y quemar grasa',
    coachTip: 'Este día os dejará una sensación brutal en espalda y brazos sin cansar las piernas, así en los 20 minutos finales de cardio os sentiréis ligeros.',
    exercises: [
      { name: 'Calentamiento en Elíptica', machine: 'Bicicleta Elíptica', sets: 1, reps: '5 min', weightKg: 0, durationMin: 5, tip: 'Moviliza bien los brazos en los agarres móviles.' },
      { name: 'Remo Sentado en Polea Baja', machine: 'Remo Sentado en Polea Baja (Gironda)', sets: 3, reps: '12-15', weightKg: 25, durationMin: 0, tip: 'Espalda recta, junta las escápulas al tirar hacia el abdomen.' },
      { name: 'Contractora Pectoral (Pec Deck)', machine: 'Contractora Pectoral / Pec Deck (Mariposa)', sets: 3, reps: '12-15', weightKg: 15, durationMin: 0, tip: 'Cierra al frente sintiendo el pecho.' },
      { name: 'Press de Hombros en Máquina', machine: 'Press de Hombros en Máquina / Mancuernas', sets: 3, reps: '12', weightKg: 12, durationMin: 0, tip: 'No arquees la espalda al subir.' },
      { name: 'Extensión de Tríceps en Polea Alta', machine: 'Estación de Poleas (Extensión Tríceps / Curl Bíceps)', sets: 3, reps: '15', weightKg: 12, durationMin: 0, tip: 'Codos fijos pegados al cuerpo.' },
      { name: 'Curl de Bíceps con Mancuernas o Polea', machine: 'Estación de Poleas (Extensión Tríceps / Curl Bíceps)', sets: 3, reps: '12-15', weightKg: 10, durationMin: 0, tip: 'Sin balancear los hombros.' },
      { name: 'Cinta Inclinada o Bicicleta', machine: 'Cinta de Correr (Caminata Inclinada / Trote)', sets: 1, reps: '20 min', weightKg: 0, durationMin: 20, tip: 'Remate final quema-grasa.' }
    ]
  },
  {
    id: 'marbella-dia-4',
    title: '🚴 Día 4: Especial Quema-Calorías (Clase o Circuito)',
    subtitle: 'Spinning, Zumba, Circuito TRX o Cardio Mix en el Marbella',
    duration: '45 min',
    calories: '~450-550 kcal',
    goal: 'Máximo gasto calórico y salud cardiovascular',
    coachTip: 'Podéis aprovechar las clases colectivas del Gimnasio Marbella (Ciclo Indoor, Zumba, Pilates) o hacer este circuito dinámico de 3 estaciones de cardio para no aburriros nunca.',
    exercises: [
      { name: 'Bloque 1: Caminata con Pendiente Progresiva', machine: 'Cinta de Correr (Caminata Inclinada / Trote)', sets: 1, reps: '15 min', weightKg: 0, durationMin: 15, tip: 'Sube 1% de inclinación cada 3 minutos (de 4% a 8%).' },
      { name: 'Bloque 2: Circuito Funcional TRX + Abdomen', machine: 'Zona Funcional: TRX, Colchonetas y Fitball', sets: 3, reps: '12 sentadillas TRX + 12 remos TRX', weightKg: 0, durationMin: 10, tip: 'Sin apenas descanso entre un ejercicio y otro.' },
      { name: 'Bloque 3: Elíptica por Intervalos', machine: 'Bicicleta Elíptica', sets: 1, reps: '15 min', weightKg: 0, durationMin: 15, tip: 'Alterna 2 min a ritmo suave con 1 min rápido.' }
    ]
  }
];

function GymManager({ currentUser }) {
  const [subTab, setSubTab] = useState('trainer'); // 'trainer' | 'log' | 'machines' | 'weight'
  const [workouts, setWorkouts] = useState([]);
  const [bodyWeights, setBodyWeights] = useState([]);
  const [goals, setGoals] = useState({
    Ismael: { targetDaysPerWeek: 3, targetWeightKg: null },
    Sandra: { targetDaysPerWeek: 3, targetWeightKg: null }
  });
  const [customRoutines, setCustomRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rest timer state (cronómetro de descanso en el gimnasio)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Active workout form state
  const [workoutUser, setWorkoutUser] = useState(currentUser || 'Ismael');
  const [trainTogether, setTrainTogether] = useState(true);
  const [workoutDate, setWorkoutDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [routineName, setRoutineName] = useState('🔥 Día 1: Full Body A + Cardio Quema-Grasa');
  const [durationMin, setDurationMin] = useState(50);
  const [caloriesBurned, setCaloriesBurned] = useState(400);
  const [feeling, setFeeling] = useState('🔥 A tope');
  const [notes, setNotes] = useState('');
  const [activeExercises, setActiveExercises] = useState([]);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // History filter
  const [historyFilter, setHistoryFilter] = useState('ALL'); // 'ALL' | 'Ismael' | 'Sandra'

  // Machine filter
  const [machineZoneFilter, setMachineZoneFilter] = useState('TODAS');

  // AI Personal Trainer generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDuration, setAiDuration] = useState(45);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedRoutine, setAiGeneratedRoutine] = useState(null);

  // Body weight form state
  const [weightUser, setWeightUser] = useState(currentUser || 'Ismael');
  const [weightValue, setWeightValue] = useState('');
  const [weightDate, setWeightDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [weightNote, setWeightNote] = useState('');
  const [editingGoalUser, setEditingGoalUser] = useState(null);
  const [goalWeightInput, setGoalWeightInput] = useState('');
  const [goalDaysInput, setGoalDaysInput] = useState(3);

  useEffect(() => {
    setWorkoutUser(currentUser || 'Ismael');
    setWeightUser(currentUser || 'Ismael');
  }, [currentUser]);

  const fetchGymData = async () => {
    try {
      const res = await fetch('/api/gym');
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setBodyWeights(data.bodyWeights || []);
        if (data.goals) setGoals(data.goals);
        setCustomRoutines(data.customRoutines || []);
      }
    } catch (err) {
      console.error('Error cargando datos del gimnasio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGymData();
  }, []);

  // Cronómetro de descanso
  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) {
      if (timerSeconds <= 0) setTimerActive(false);
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const startRestTimer = (secs) => {
    setTimerSeconds(secs);
    setTimerActive(true);
  };

  // Obtener el último peso (kg) registrado por un usuario en un ejercicio o máquina
  const getLastWeightForExercise = (user, exName, machineName) => {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const targetEx = norm(exName);
    const targetMach = norm(machineName);

    for (const w of workouts) {
      if (user && w.user !== user) continue;
      for (const ex of (w.exercises || [])) {
        if (!ex.weightKg || ex.weightKg <= 0) continue;
        const eName = norm(ex.name);
        const eMach = norm(ex.machine);
        if (
          (targetEx && eName === targetEx) ||
          (targetMach && eMach && (eMach.includes(targetMach) || targetMach.includes(eMach)))
        ) {
          return ex.weightKg;
        }
      }
    }
    return null;
  };

  // Cargar una rutina en el panel de "Apuntar Entreno"
  const loadRoutineIntoLogger = (routine) => {
    setRoutineName(routine.title);
    const mins = parseInt(String(routine.duration).replace(/\D/g, ''), 10) || 50;
    setDurationMin(mins);
    const kcalMatch = String(routine.calories).match(/\d+/);
    setCaloriesBurned(kcalMatch ? parseInt(kcalMatch[0], 10) : mins * 8);

    const prepared = (routine.exercises || []).map((ex) => {
      const lastKg = getLastWeightForExercise(currentUser, ex.name, ex.machine);
      return {
        name: ex.name,
        machine: ex.machine || '',
        sets: ex.sets || 3,
        reps: ex.reps || '12',
        weightKg: lastKg !== null ? lastKg : (ex.weightKg || 0),
        durationMin: ex.durationMin || 0,
        tip: ex.tip || '',
        completed: true
      };
    });

    setActiveExercises(prepared);
    setSubTab('log');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inicializar con la rutina Día 1 por defecto si activeExercises está vacío
  useEffect(() => {
    if (activeExercises.length === 0) {
      const r = DEFAULT_MARBELLA_ROUTINES[0];
      setActiveExercises(
        r.exercises.map(ex => ({
          ...ex,
          completed: true
        }))
      );
    }
  }, []);

  // Estadísticas de esta semana (Lunes a Domingo)
  const getStartOfCurrentWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 domingo, 1 lunes...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  };

  const mondayStr = getStartOfCurrentWeek();
  const thisWeekWorkouts = workouts.filter(w => w.date >= mondayStr);
  const ismaelWeekCount = thisWeekWorkouts.filter(w => w.user === 'Ismael').length;
  const sandraWeekCount = thisWeekWorkouts.filter(w => w.user === 'Sandra').length;
  const weekCalories = thisWeekWorkouts.reduce((acc, w) => acc + (Number(w.caloriesBurned) || 0), 0);

  // Guardar entrenamiento
  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    setSavingWorkout(true);
    setSaveSuccessMsg('');
    try {
      const payload = {
        workout: {
          user: workoutUser,
          date: workoutDate,
          routineName,
          durationMin: Number(durationMin) || 45,
          caloriesBurned: Number(caloriesBurned) || 350,
          feeling,
          notes,
          exercises: activeExercises
        },
        together: trainTogether
      };

      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setNotes('');
        setSaveSuccessMsg(
          trainTogether
            ? '🎉 ¡Entrenamiento guardado para Ismael y Sandra! ¡Sois un equipazo!'
            : `🎉 ¡Entrenamiento de ${workoutUser} registrado con éxito!`
        );
        setTimeout(() => setSaveSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Error guardando entrenamiento:', err);
    } finally {
      setSavingWorkout(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('¿Eliminar este entrenamiento del historial?')) return;
    try {
      const res = await fetch(`/api/gym/workouts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
      }
    } catch (err) {
      console.error('Error eliminando entrenamiento:', err);
    }
  };

  // Pedir rutina al Entrenador IA
  const handleAskTrainerAI = async (customText) => {
    const queryText = customText || aiPrompt;
    if (!queryText.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/gym/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          user: currentUser,
          durationMin: aiDuration
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.routine) {
          setAiGeneratedRoutine(data.routine);
        }
      }
    } catch (err) {
      console.error('Error pidiendo rutina al entrenador IA:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiRoutine = async () => {
    if (!aiGeneratedRoutine) return;
    try {
      const res = await fetch('/api/gym/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiGeneratedRoutine)
      });
      if (res.ok) {
        const data = await res.json();
        setCustomRoutines(data.customRoutines || []);
        setAiGeneratedRoutine(null);
        setAiPrompt('');
      }
    } catch (err) {
      console.error('Error guardando rutina personalizada:', err);
    }
  };

  const handleDeleteCustomRoutine = async (id) => {
    try {
      const res = await fetch(`/api/gym/routines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCustomRoutines(data.customRoutines || []);
      }
    } catch (err) {
      console.error('Error eliminando rutina:', err);
    }
  };

  // Guardar peso corporal
  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!weightValue) return;
    try {
      const res = await fetch('/api/gym/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: weightUser,
          date: weightDate,
          weightKg: weightValue,
          note: weightNote
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBodyWeights(data.bodyWeights || []);
        setWeightValue('');
        setWeightNote('');
      }
    } catch (err) {
      console.error('Error guardando peso:', err);
    }
  };

  const handleDeleteWeight = async (id) => {
    try {
      const res = await fetch(`/api/gym/weights/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setBodyWeights(data.bodyWeights || []);
      }
    } catch (err) {
      console.error('Error eliminando peso:', err);
    }
  };

  const handleSaveGoal = async (user) => {
    try {
      const res = await fetch('/api/gym/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          targetDaysPerWeek: goalDaysInput,
          targetWeightKg: goalWeightInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals);
        setEditingGoalUser(null);
      }
    } catch (err) {
      console.error('Error guardando meta:', err);
    }
  };

  const getUserWeightStats = (user) => {
    const list = bodyWeights.filter(w => w.user === user);
    if (list.length === 0) return { current: null, start: null, diff: 0, entries: [] };
    // list está ordenado del más reciente al más antiguo
    const current = list[0].weightKg;
    const start = list[list.length - 1].weightKg;
    const diff = Number((current - start).toFixed(1));
    return { current, start, diff, entries: list };
  };

  const filteredMachines = machineZoneFilter === 'TODAS'
    ? MARBELLA_MACHINES
    : MARBELLA_MACHINES.filter(m => m.zone === machineZoneFilter);

  const filteredWorkouts = historyFilter === 'ALL'
    ? workouts
    : workouts.filter(w => w.user === historyFilter);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Cabecera Principal estilo App de Gimnasio + Personal Trainer */}
      <div
        className="glass-card"
        style={{
          padding: '1.1rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(59, 130, 246, 0.12) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.5rem' }}>🏋️</span>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Gimnasio Marbella · Personal Trainer
              </h2>
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontWeight: 700
              }}>
                📍 Vía Lusitana 1 (Carabanchel)
              </span>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Fitness-Place Plaza Elíptica · Plan de Pérdida de Peso y Tonificación para Ismael &amp; Sandra
            </p>
          </div>

          {/* Cronómetro de descanso rápido para usar entre series */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(15, 23, 42, 0.75)',
            padding: '0.4rem 0.65rem',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>⏱️ Descanso:</span>
            {timerSeconds > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: timerSeconds <= 10 ? '#f87171' : '#34d399'
                }}>
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  type="button"
                  onClick={() => { setTimerActive(false); setTimerSeconds(0); }}
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: 'none',
                    color: '#fca5a5',
                    borderRadius: '6px',
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.68rem',
                    cursor: 'pointer'
                  }}
                >
                  Parar
                </button>
              </div>
            ) : (
              <>
                {[60, 90, 120].map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => startRestTimer(sec)}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#e2e8f0',
                      borderRadius: '6px',
                      padding: '0.2rem 0.45rem',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Resumen semanal de la pareja */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.6rem',
          marginTop: '0.9rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>👦 Ismael (Esta semana)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.15rem' }}>
              {ismaelWeekCount} / {goals.Ismael?.targetDaysPerWeek || 3} días {ismaelWeekCount >= (goals.Ismael?.targetDaysPerWeek || 3) ? '🏆' : '💪'}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>👧 Sandra (Esta semana)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f472b6', marginTop: '0.15rem' }}>
              {sandraWeekCount} / {goals.Sandra?.targetDaysPerWeek || 3} días {sandraWeekCount >= (goals.Sandra?.targetDaysPerWeek || 3) ? '🏆' : '💪'}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>🔥 Calorías quemadas (Semana)</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', marginTop: '0.15rem' }}>
              {weekCalories} kcal
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Sub-pestañas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.35rem',
        background: 'rgba(255,255,255,0.03)',
        padding: '0.3rem',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)'
      }}>
        <button
          type="button"
          onClick={() => setSubTab('trainer')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: subTab === 'trainer' ? 'var(--primary)' : 'transparent',
            color: '#fff'
          }}
        >
          🎯 Rutinas IA
        </button>
        <button
          type="button"
          onClick={() => setSubTab('log')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: subTab === 'log' ? 'var(--primary)' : 'transparent',
            color: '#fff'
          }}
        >
          📝 Apuntar ({workouts.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('machines')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: subTab === 'machines' ? 'var(--primary)' : 'transparent',
            color: '#fff'
          }}
        >
          🏢 Máquinas
        </button>
        <button
          type="button"
          onClick={() => setSubTab('weight')}
          style={{
            padding: '0.5rem 0.3rem',
            borderRadius: '8px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            background: subTab === 'weight' ? 'var(--primary)' : 'transparent',
            color: '#fff'
          }}
        >
          ⚖️ Peso y Meta
        </button>
      </div>

      {/* SUB-PESTAÑA 1: ENTRENADOR PERSONAL Y RUTINAS */}
      {subTab === 'trainer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Generador de Entrenador Personal con IA */}
          <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(15, 23, 42, 0.65)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#93c5fd' }}>
                  Habla con vuestro Personal Trainer (Adaptado al Gimnasio Marbella)
                </h3>
                <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Pídele un entrenamiento a medida según el tiempo que tengáis hoy o cómo os sintáis.
                </p>
              </div>
            </div>

            {/* Chips rápidos */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              {[
                '🔥 Circuito quema-grasa rápido de 35 min',
                '🍑 Especial Glúteo, Pierna y Abdomen',
                '🛡️ Entreno sin impacto en rodillas',
                '💪 Espalda sana, brazos y caminata inclinada'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setAiPrompt(chip);
                    handleAskTrainerAI(chip);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#bfdbfe',
                    borderRadius: '999px',
                    padding: '0.28rem 0.65rem',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej: Hoy tenemos 40 minutos y queremos quemar muchas calorías..."
                className="custom-input"
                style={{ flex: 1, minWidth: '200px', fontSize: '0.8rem' }}
              />
              <select
                value={aiDuration}
                onChange={(e) => setAiDuration(Number(e.target.value))}
                className="custom-input"
                style={{ width: '95px', fontSize: '0.8rem' }}
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleAskTrainerAI()}
                className="btn-primary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                {aiLoading ? 'Diseñando...' : '✨ Crear Rutina'}
              </button>
            </div>

            {/* Resultado generado por el Entrenador IA */}
            {aiGeneratedRoutine && (
              <div style={{
                marginTop: '0.9rem',
                padding: '0.9rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#34d399' }}>{aiGeneratedRoutine.title}</h4>
                    <p style={{ margin: '0.15rem 0', fontSize: '0.75rem', color: '#cbd5e1' }}>{aiGeneratedRoutine.subtitle}</p>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: 700 }}>
                    ⏱️ {aiGeneratedRoutine.duration} · 🔥 {aiGeneratedRoutine.calories}
                  </span>
                </div>

                <div style={{
                  margin: '0.55rem 0',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.25)',
                  fontSize: '0.75rem',
                  color: '#a7f3d0'
                }}>
                  🗣️ <strong>Consejo del Entrenador:</strong> {aiGeneratedRoutine.coachTip}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {(aiGeneratedRoutine.exercises || []).map((ex, i) => (
                    <div key={i} style={{ fontSize: '0.76rem', padding: '0.4rem 0.55rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                      <strong>{i + 1}. {ex.name}</strong> <span style={{ color: '#93c5fd' }}>({ex.machine})</span> —{' '}
                      <span style={{ color: '#fcd34d' }}>{ex.sets} series × {ex.reps}</span>
                      {ex.tip && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>💡 {ex.tip}</div>}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => loadRoutineIntoLogger(aiGeneratedRoutine)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.78rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    ▶️ Empezar este Entreno Ahora
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAiRoutine}
                    style={{
                      padding: '0.5rem 0.8rem',
                      fontSize: '0.78rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#93c5fd',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    💾 Guardar en Mis Rutinas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Rutinas Oficiales para el Gimnasio Marbella + Guardadas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '0.95rem', color: '#e2e8f0' }}>
              📋 Plan Semanal Recomendado (Gimnasio Marbella · Pérdida de Peso)
            </h3>

            {[...customRoutines, ...DEFAULT_MARBELLA_ROUTINES].map((routine) => (
              <div
                key={routine.id}
                className="glass-card"
                style={{
                  padding: '1rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(15, 23, 42, 0.55)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>{routine.title}</h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>{routine.subtitle}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '8px',
                      fontWeight: 700
                    }}>
                      ⏱️ {routine.duration} · 🔥 {routine.calories}
                    </span>
                    {String(routine.id).startsWith('custom-') && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomRoutine(routine.id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' }}
                        title="Eliminar rutina personalizada"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Consejo del Personal Trainer */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  borderLeft: '3px solid #10b981',
                  padding: '0.5rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#d1fae5',
                  lineHeight: 1.4
                }}>
                  🎓 <strong>Personal Trainer:</strong> {routine.coachTip}
                </div>

                {/* Ejercicios de la rutina */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.45rem' }}>
                  {(routine.exercises || []).map((ex, idx) => {
                    const lastIsmael = getLastWeightForExercise('Ismael', ex.name, ex.machine);
                    const lastSandra = getLastWeightForExercise('Sandra', ex.name, ex.machine);
                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.65rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                          {idx + 1}. {ex.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#93c5fd', marginTop: '0.1rem' }}>
                          📍 {ex.machine}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', fontSize: '0.7rem', color: '#fbbf24' }}>
                          <span>{ex.sets} series × {ex.reps}</span>
                          {(lastIsmael || lastSandra) && (
                            <span style={{ color: '#34d399', fontSize: '0.66rem' }}>
                              Último: {lastIsmael ? `👦${lastIsmael}kg ` : ''}{lastSandra ? `👧${lastSandra}kg` : ''}
                            </span>
                          )}
                        </div>
                        {ex.tip && (
                          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                            💡 {ex.tip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => loadRoutineIntoLogger(routine)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    marginTop: '0.2rem'
                  }}
                >
                  ▶️ Cargar esta rutina para entrenar hoy
                </button>
              </div>
            ))}
          </div>

          {/* Guía rápida de pérdida de peso del Entrenador */}
          <div className="glass-card" style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#fbbf24' }}>
              🏆 Los 4 Secretos de vuestro Entrenador para Perder Peso en el Gimnasio Marbella
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.76rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: 1.4 }}>
              <li><strong>1. Primero las máquinas, después el cardio:</strong> Hacer 25-30 min de máquinas vacía el glucógeno muscular; así, cuando subáis luego 20 min a la cinta o elíptica, el cuerpo tirará directamente de las reservas de grasa.</li>
              <li><strong>2. El truco de la Cinta Inclinada:</strong> Caminar rápido (4.8 - 5.4 km/h) con una pendiente de 6% a 9% quema casi las mismas calorías que correr, pero sin fatigar las rodillas ni disparar el hambre después.</li>
              <li><strong>3. Constancia en pareja (3-4 días/semana):</strong> Ir juntos es vuestro mayor superpoder. Aunque un día estéis cansados, ir 35 minutos ya suma una victoria.</li>
              <li><strong>4. Apuntad los pesos aquí:</strong> La app recuerda automáticamente los kilos que pusisteis la última vez en cada máquina del Marbella para no perder tiempo adivinando.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 2: APUNTAR ENTRENAMIENTO E HISTORIAL */}
      {subTab === 'log' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <form
            onSubmit={handleSaveWorkout}
            className="glass-card"
            style={{ padding: '1rem', border: '1px solid rgba(16, 185, 129, 0.35)', background: 'rgba(15, 23, 42, 0.65)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#34d399' }}>
                📝 Apuntar Entrenamiento de Hoy
              </h3>

              {/* Selector rápido de plantilla */}
              <select
                onChange={(e) => {
                  const found = [...customRoutines, ...DEFAULT_MARBELLA_ROUTINES].find(r => r.id === e.target.value);
                  if (found) loadRoutineIntoLogger(found);
                }}
                defaultValue=""
                className="custom-input"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.5rem', maxWidth: '220px' }}
              >
                <option value="" disabled>🔄 Cambiar de rutina...</option>
                {[...customRoutines, ...DEFAULT_MARBELLA_ROUTINES].map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            {/* Quién entrena hoy */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setTrainTogether(true)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '10px',
                  border: trainTogether ? '2px solid #10b981' : '1px solid var(--glass-border)',
                  background: trainTogether ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                👫 ¡Entrenamos Juntos! (Ismael + Sandra)
              </button>
              <button
                type="button"
                onClick={() => { setTrainTogether(false); setWorkoutUser('Ismael'); }}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: (!trainTogether && workoutUser === 'Ismael') ? '2px solid #60a5fa' : '1px solid var(--glass-border)',
                  background: (!trainTogether && workoutUser === 'Ismael') ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                👦 Solo Ismael
              </button>
              <button
                type="button"
                onClick={() => { setTrainTogether(false); setWorkoutUser('Sandra'); }}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '10px',
                  border: (!trainTogether && workoutUser === 'Sandra') ? '2px solid #f472b6' : '1px solid var(--glass-border)',
                  background: (!trainTogether && workoutUser === 'Sandra') ? 'rgba(244, 114, 182, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                👧 Solo Sandra
              </button>
            </div>

            {/* Datos generales de la sesión */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.55rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Nombre del entreno</label>
                <input
                  type="text"
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Fecha</label>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Duración (min)</label>
                <input
                  type="number"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  min="5"
                  max="240"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kcal estimadas</label>
                <input
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                  min="20"
                  max="2000"
                />
              </div>
            </div>

            {/* Lista editable de ejercicios y pesos de la sesión */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>
                  🏋️ Ejercicios, Series y Peso (kg)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveExercises([
                      ...activeExercises,
                      { name: 'Nuevo ejercicio', machine: 'Gimnasio Marbella', sets: 3, reps: '12', weightKg: 20, durationMin: 0, completed: true }
                    ]);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    borderRadius: '6px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  + Añadir Ejercicio
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {activeExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: ex.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: ex.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={ex.completed !== false}
                      onChange={(e) => {
                        const copy = [...activeExercises];
                        copy[idx].completed = e.target.checked;
                        setActiveExercises(copy);
                      }}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => {
                        const copy = [...activeExercises];
                        copy[idx].name = e.target.value;
                        setActiveExercises(copy);
                      }}
                      className="custom-input"
                      style={{ flex: '1 1 150px', fontSize: '0.76rem', padding: '0.3rem 0.45rem' }}
                      placeholder="Ejercicio / Máquina"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => {
                          const copy = [...activeExercises];
                          copy[idx].sets = Number(e.target.value);
                          setActiveExercises(copy);
                        }}
                        className="custom-input"
                        style={{ width: '46px', fontSize: '0.74rem', padding: '0.25rem', textAlign: 'center' }}
                        title="Series"
                      />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>series ×</span>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => {
                          const copy = [...activeExercises];
                          copy[idx].reps = e.target.value;
                          setActiveExercises(copy);
                        }}
                        className="custom-input"
                        style={{ width: '62px', fontSize: '0.74rem', padding: '0.25rem', textAlign: 'center' }}
                        title="Repeticiones o minutos"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={ex.weightKg}
                        onChange={(e) => {
                          const copy = [...activeExercises];
                          copy[idx].weightKg = e.target.value;
                          setActiveExercises(copy);
                        }}
                        className="custom-input"
                        style={{ width: '58px', fontSize: '0.74rem', padding: '0.25rem', textAlign: 'center' }}
                        placeholder="kg"
                        title="Peso en kg"
                      />
                      <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>kg</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveExercises(activeExercises.filter((_, i) => i !== idx));
                        }}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.2rem' }}
                        title="Quitar ejercicio"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensaciones y nota */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="custom-input"
                style={{ fontSize: '0.78rem', flex: '1 1 140px' }}
              >
                <option value="🔥 A tope">🔥 A tope de energía</option>
                <option value="💪 Muy bien">💪 Muy bien cumplido</option>
                <option value="😅 Duro pero hecho">😅 Duro pero hemos cumplido</option>
                <option value="🧘 Suave / Adaptación">🧘 Sesión suave / Adaptación</option>
              </select>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nota opcional (ej: Subimos 5kg en prensa, hicimos 20 min de cinta al 7%)"
                className="custom-input"
                style={{ flex: '2 1 220px', fontSize: '0.78rem' }}
              />
            </div>

            {saveSuccessMsg && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                color: '#6ee7b7',
                padding: '0.65rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                {saveSuccessMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={savingWorkout}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.88rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10b981, #059669)'
              }}
            >
              {savingWorkout ? 'Guardando...' : '✅ Guardar Entrenamiento Completado'}
            </button>
          </form>

          {/* Historial de Entrenamientos */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#ffffff' }}>
                🏅 Historial de Entrenamientos ({filteredWorkouts.length})
              </h3>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['ALL', 'Ismael', 'Sandra'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setHistoryFilter(f)}
                    style={{
                      background: historyFilter === f ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '6px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'ALL' ? 'Todos' : f === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                  </button>
                ))}
              </div>
            </div>

            {filteredWorkouts.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
                Aún no hay entrenamientos registrados. ¡La semana que viene empieza vuestro reto en el Gimnasio Marbella! 🚀
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {filteredWorkouts.map((w) => (
                  <div
                    key={w.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.55)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            background: w.user === 'Ismael' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 114, 182, 0.2)',
                            color: w.user === 'Ismael' ? '#93c5fd' : '#f9a8d4'
                          }}>
                            {w.user === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                          </span>
                          <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{w.routineName}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          📅 {w.date} · ⏱️ {w.durationMin} min · 🔥 ~{w.caloriesBurned} kcal · {w.feeling}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setRoutineName(w.routineName);
                            setDurationMin(w.durationMin);
                            setCaloriesBurned(w.caloriesBurned);
                            setActiveExercises((w.exercises || []).map(ex => ({ ...ex, completed: true })));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: '#6ee7b7',
                            borderRadius: '6px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.68rem',
                            cursor: 'pointer'
                          }}
                        >
                          🔄 Repetir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWorkout(w.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {w.notes && (
                      <div style={{ fontSize: '0.74rem', color: '#fde68a', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        💬 "{w.notes}"
                      </div>
                    )}

                    {Array.isArray(w.exercises) && w.exercises.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.55rem' }}>
                        {w.exercises.filter(ex => ex.completed !== false).map((ex, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.68rem',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              padding: '0.18rem 0.45rem',
                              borderRadius: '6px',
                              color: '#e2e8f0'
                            }}
                          >
                            {ex.name}: {ex.sets}×{ex.reps} {ex.weightKg > 0 ? `(${ex.weightKg}kg)` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 3: MÁQUINAS DEL GIMNASIO MARBELLA */}
      {subTab === 'machines' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div className="glass-card" style={{ padding: '0.9rem' }}>
            <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '0.98rem', color: '#ffffff' }}>
              🏢 Guía de Máquinas · Gimnasio Marbella (Fitness-Place Plaza Elíptica)
            </h3>
            <p style={{ margin: '0 0 0.7rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Aquí tenéis las máquinas y zonas del gimnasio de Vía Lusitana 1, cómo usarlas sin lesionaros y el último peso que habéis levantado en cada una.
            </p>

            {/* Filtro por zona */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['TODAS', 'Cardio', 'Pierna y Glúteo', 'Espalda y Pecho', 'Hombro, Brazo y Core', 'Clases y Piscina'].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setMachineZoneFilter(z)}
                  style={{
                    background: machineZoneFilter === z ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {filteredMachines.map((m) => {
              const lastIsmael = getLastWeightForExercise('Ismael', m.name, m.name);
              const lastSandra = getLastWeightForExercise('Sandra', m.name, m.name);

              return (
                <div
                  key={m.id}
                  className="glass-card"
                  style={{
                    padding: '0.9rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.55rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
                        {m.icon} {m.name}
                      </div>
                      <span style={{
                        fontSize: '0.64rem',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#93c5fd',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap'
                      }}>
                        {m.zone}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '0.2rem', fontWeight: 600 }}>
                      🎯 {m.muscles}
                    </div>

                    <div style={{
                      fontSize: '0.73rem',
                      color: '#cbd5e1',
                      marginTop: '0.45rem',
                      lineHeight: 1.4,
                      background: 'rgba(0,0,0,0.25)',
                      padding: '0.5rem',
                      borderRadius: '8px'
                    }}>
                      🎓 <strong>Cómo usarla:</strong> {m.technique}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginBottom: '0.4rem' }}>
                      ⚖️ <strong>Referencia inicial:</strong> {m.beginnerWeight}
                    </div>

                    {(lastIsmael || lastSandra) && (
                      <div style={{ fontSize: '0.7rem', color: '#6ee7b7', marginBottom: '0.45rem' }}>
                        🏆 <strong>Vuestro último peso:</strong>{' '}
                        {lastIsmael ? `👦 Ismael: ${lastIsmael} kg ` : ''}
                        {lastSandra ? `👧 Sandra: ${lastSandra} kg` : ''}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveExercises([
                          ...activeExercises,
                          {
                            name: m.name,
                            machine: m.name,
                            sets: m.isCardio ? 1 : 3,
                            reps: m.isCardio ? '20 min' : '12-15',
                            weightKg: (currentUser === 'Ismael' ? lastIsmael : lastSandra) || 0,
                            durationMin: m.isCardio ? 20 : 0,
                            completed: true
                          }
                        ]);
                        setSubTab('log');
                      }}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#6ee7b7',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + Añadir al entreno de hoy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 4: PESO Y PROGRESO */}
      {subTab === 'weight' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tarjetas de Progreso de Ismael y Sandra */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.8rem' }}>
            {['Ismael', 'Sandra'].map((u) => {
              const stats = getUserWeightStats(u);
              const userGoal = goals[u] || { targetDaysPerWeek: 3, targetWeightKg: null };
              const targetKg = userGoal.targetWeightKg;
              let progressPct = 0;
              if (stats.start && stats.current && targetKg && stats.start > targetKg) {
                progressPct = Math.min(100, Math.max(0, Math.round(((stats.start - stats.current) / (stats.start - targetKg)) * 100)));
              }

              return (
                <div
                  key={u}
                  className="glass-card"
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${u === 'Ismael' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', color: u === 'Ismael' ? '#93c5fd' : '#f9a8d4' }}>
                      {u === 'Ismael' ? '👦 Progreso de Ismael' : '👧 Progreso de Sandra'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGoalUser(editingGoalUser === u ? null : u);
                        setGoalWeightInput(userGoal.targetWeightKg || '');
                        setGoalDaysInput(userGoal.targetDaysPerWeek || 3);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--glass-border)',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.68rem',
                        cursor: 'pointer'
                      }}
                    >
                      🎯 Meta
                    </button>
                  </div>

                  {editingGoalUser === u && (
                    <div style={{
                      marginTop: '0.6rem',
                      padding: '0.6rem',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.7rem', color: '#cbd5e1', flex: 1 }}>Peso Meta (kg):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={goalWeightInput}
                          onChange={(e) => setGoalWeightInput(e.target.value)}
                          placeholder="Ej: 72"
                          className="custom-input"
                          style={{ width: '80px', fontSize: '0.76rem', padding: '0.25rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.7rem', color: '#cbd5e1', flex: 1 }}>Días de Gym / semana:</label>
                        <select
                          value={goalDaysInput}
                          onChange={(e) => setGoalDaysInput(Number(e.target.value))}
                          className="custom-input"
                          style={{ width: '80px', fontSize: '0.76rem', padding: '0.25rem' }}
                        >
                          <option value={2}>2 días</option>
                          <option value={3}>3 días</option>
                          <option value={4}>4 días</option>
                          <option value={5}>5 días</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSaveGoal(u)}
                        className="btn-primary"
                        style={{ padding: '0.35rem', fontSize: '0.74rem' }}
                      >
                        Guardar Meta
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Peso actual</span>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>
                        {stats.current ? `${stats.current} kg` : 'Sin datos'}
                      </span>
                    </div>
                    {stats.start && stats.entries.length > 1 && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Cambio total</span>
                        <span style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: stats.diff <= 0 ? '#34d399' : '#fbbf24'
                        }}>
                          {stats.diff > 0 ? `+${stats.diff} kg` : `${stats.diff} kg`}
                        </span>
                      </div>
                    )}
                    {targetKg && (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Objetivo</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#93c5fd' }}>
                          🎯 {targetKg} kg
                        </span>
                      </div>
                    )}
                  </div>

                  {targetKg && stats.current && (
                    <div style={{ marginTop: '0.6rem' }}>
                      <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6, #10b981)'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign: 'right' }}>
                        {stats.current > targetKg
                          ? `Faltan ${(stats.current - targetKg).toFixed(1)} kg para la meta (${progressPct}%)`
                          : '🎉 ¡Meta alcanzada!'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Formulario para registrar peso */}
          <form onSubmit={handleAddWeight} className="glass-card" style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.65rem 0', fontSize: '0.92rem', color: '#ffffff' }}>
              ⚖️ Registrar Peso en Báscula
            </h4>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <select
                value={weightUser}
                onChange={(e) => setWeightUser(e.target.value)}
                className="custom-input"
                style={{ fontSize: '0.8rem', width: '125px' }}
              >
                <option value="Ismael">👦 Ismael</option>
                <option value="Sandra">👧 Sandra</option>
              </select>
              <input
                type="number"
                step="0.1"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="Peso (ej: 76.4)"
                className="custom-input"
                style={{ width: '125px', fontSize: '0.8rem' }}
                required
              />
              <input
                type="date"
                value={weightDate}
                onChange={(e) => setWeightDate(e.target.value)}
                className="custom-input"
                style={{ width: '140px', fontSize: '0.8rem' }}
                required
              />
              <input
                type="text"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                placeholder="Nota opcional (ej: En ayunas)"
                className="custom-input"
                style={{ flex: 1, minWidth: '150px', fontSize: '0.8rem' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
                Guardar Peso
              </button>
            </div>
          </form>

          {/* Historial de Pesajes */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.65rem 0', fontSize: '0.92rem', color: '#ffffff' }}>
              📉 Evolución de Peso
            </h4>
            {bodyWeights.length === 0 ? (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Pesaos en ayunas antes de empezar vuestra primera semana en el Gimnasio Marbella para tener vuestro punto de partida.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {bodyWeights.map((w) => (
                  <div
                    key={w.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.7rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: w.user === 'Ismael' ? '#93c5fd' : '#f9a8d4', fontWeight: 700 }}>
                        {w.user === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                      </span>
                      <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{w.weightKg} kg</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({w.date})</span>
                      {w.note && <span style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>· {w.note}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteWeight(w.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GymManager;
