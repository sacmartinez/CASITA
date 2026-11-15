import React, { useState, useEffect } from 'react';

const GOAL_OPTIONS = [
  {
    id: 'tonificar',
    icon: '⚡',
    label: 'Tonificar y Ponerse en Forma',
    shortLabel: 'Tonificación y Forma',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Ganar firmeza muscular, mejorar la silueta, sentirte ágil y con más energía cada día.',
    trainerAdvice: {
      reps: '12 a 15 repeticiones controladas',
      rest: '60 a 75 segundos entre series',
      cardio: '15-20 min de cardio moderado o clases colectivas al terminar las máquinas',
      keyTip: 'Elige un peso con el que las últimas 2 repeticiones cuesten pero manteniendo buena postura.'
    }
  },
  {
    id: 'hipertrofia',
    icon: '💪',
    label: 'Ganar Músculo y Fuerza',
    shortLabel: 'Músculo y Fuerza',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    desc: 'Desarrollar masa muscular, aumentar tu fuerza en máquinas y peso libre semana a semana.',
    trainerAdvice: {
      reps: '8 a 12 repeticiones intensas',
      rest: '90 a 120 segundos entre series para recuperar toda la fuerza',
      cardio: '5-10 min suaves solo para calentar; prioriza toda tu energía en mover más kilos progresivamente',
      keyTip: 'Apunta siempre el peso en la app e intenta subir 1 repetición o 2.5 kg cada 1-2 semanas (sobrecarga progresiva).'
    }
  },
  {
    id: 'salud',
    icon: '🏃',
    label: 'Salud, Resistencia y Energía',
    shortLabel: 'Salud y Resistencia',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    desc: 'Crear el hábito del gimnasio, mejorar capacidad pulmonar, corazón fuerte y desconectar del estrés.',
    trainerAdvice: {
      reps: '12 a 15 repeticiones fluidas en circuito',
      rest: '60 segundos entre ejercicios',
      cardio: '20-25 min combinando elíptica, bici o cinta + clases dirigidas del Marbella',
      keyTip: 'La clave es la constancia: mejor cumplir tus 3 días a ritmo agradable que agotarte el primer día.'
    }
  },
  {
    id: 'gluteo',
    icon: '🍑',
    label: 'Foco Pierna, Glúteo y Core',
    shortLabel: 'Pierna, Glúteo y Core',
    color: '#db2777',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    desc: 'Priorizar el fortalecimiento y forma de glúteos, piernas firmes y zona abdominal.',
    trainerAdvice: {
      reps: '10 a 15 repeticiones con pausa de 1s apretando al final',
      rest: '75 a 90 segundos en ejercicios de pierna',
      cardio: 'Caminata en cinta con inclinación (7-10%) o elíptica para activar aún más el glúteo',
      keyTip: 'En prensa y puentes de glúteo empuja siempre desde los talones y controla la bajada en 2 segundos.'
    }
  },
  {
    id: 'movilidad',
    icon: '🧘',
    label: 'Espalda Sana, Postura y Cero Impacto',
    shortLabel: 'Espalda Sana y Postura',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    desc: 'Fortalecer espalda, hombros y abdomen cuidando las articulaciones y eliminando dolores posturales.',
    trainerAdvice: {
      reps: '12 a 15 repeticiones suaves sin tirones',
      rest: '60 a 90 segundos',
      cardio: 'Bicicleta estática o elíptica (0% impacto en rodillas y columna) + Pilates/Yoga',
      keyTip: 'Prioriza los remos en polea, jalón al pecho y planchas abdominales juntando bien las escápulas.'
    }
  },
  {
    id: 'grasa',
    icon: '🔥',
    label: 'Quemar Calorías y Composición Corporal',
    shortLabel: 'Quema Calórica',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    desc: 'Maximizar el gasto calórico combinando máquinas de grandes grupos musculares y bloque metabólico.',
    trainerAdvice: {
      reps: '12 a 15 repeticiones dinámicas',
      rest: '45 a 60 segundos para mantener las pulsaciones activas',
      cardio: '20 min tras las pesas (cinta inclinada, elíptica por intervalos o clase de Spinning/Zumba)',
      keyTip: 'Hacer fuerza antes del cardio mantiene tus músculos firmes y multiplica el gasto de energía diario.'
    }
  }
];

const MARBELLA_MACHINES = [
  {
    id: 'prensa',
    name: 'Prensa de Piernas (Placas / Discos)',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Cuádriceps · Glúteos · Isquiotibiales',
    setup: 'Asiento a distancia donde las rodillas formen 90° al apoyar los pies en el centro de la plataforma.',
    technique: 'Pies a la anchura de los hombros (más altos = más glúteo; más bajos = más cuádriceps). Empuja desde los talones y nunca bloquees las rodillas de golpe al estirar.',
    isCardio: false
  },
  {
    id: 'extension-cuadriceps',
    name: 'Extensión de Cuádriceps en Máquina',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Cuádriceps (cara frontal del muslo)',
    setup: 'Ajusta el respaldo para que tu corva apoye bien y el rodillo quede justo encima del empeine/tobillo.',
    technique: 'Extiende las piernas arriba, aguanta 1 segundo apretando el muslo y baja controlado en 2 segundos sin que las placas choquen.',
    isCardio: false
  },
  {
    id: 'curl-femoral',
    name: 'Curl Femoral (Sentado o Tumbado)',
    zone: 'Pierna y Glúteo',
    icon: '🦵',
    muscles: 'Isquiotibiales (parte posterior del muslo) y Glúteo',
    setup: 'El rodillo debe apoyar en la parte baja del gemelo/tendón de Aquiles, alineando tu rodilla con el giro de la máquina.',
    technique: 'Mantén la cadera y el abdomen pegados al soporte para no arquear la espalda baja al flexionar las piernas.',
    isCardio: false
  },
  {
    id: 'abductores',
    name: 'Máquina de Abductores y Aductores',
    zone: 'Pierna y Glúteo',
    icon: '🍑',
    muscles: 'Glúteo medio/superior y Aductores (cara interna)',
    setup: 'Gira las almohadillas hacia dentro para Abductores (abrir piernas) o hacia fuera para Aductores (cerrar).',
    technique: 'Controla el movimiento en ambos sentidos y haz una pausa de 1 segundo en el punto de máxima contracción.',
    isCardio: false
  },
  {
    id: 'multipower',
    name: 'Multipower (Barra Guiada) · Sentadilla / Hip Thrust',
    zone: 'Peso Libre y Multipower',
    icon: '🏋️',
    muscles: 'Glúteo · Pierna completa · Core',
    setup: 'Gira la barra para desenganchar los seguros de los raíles y vuelve a girarla al terminar la serie.',
    technique: 'Ideal para hacer Hip Thrust (empuje de cadera con espalda apoyada en banco) o sentadilla segura adelantando ligeramente los pies.',
    isCardio: false
  },
  {
    id: 'jalon-pecho',
    name: 'Jalón al Pecho en Polea Alta',
    zone: 'Pecho y Espalda',
    icon: '🦍',
    muscles: 'Dorsal ancho (Espalda) · Bíceps · Postura',
    setup: 'Ajusta los rodillos sobre los muslos para que el peso no te levante del asiento.',
    technique: 'Agarre algo más ancho que los hombros. Saca pecho, inclínate solo un poco atrás y lleva la barra hacia la parte alta del pecho tirando con los codos hacia abajo.',
    isCardio: false
  },
  {
    id: 'remo-polea',
    name: 'Remo Sentado en Polea Baja (Gironda)',
    zone: 'Pecho y Espalda',
    icon: '🚣',
    muscles: 'Espalda media · Romboides · Bíceps',
    setup: 'Pies en los apoyos con las rodillas ligeramente flexionadas (nunca totalmente rígidas).',
    technique: 'Espalda recta, pecho fuera y hombros lejos de las orejas. Lleva el agarre al abdomen juntando las escápulas atrás.',
    isCardio: false
  },
  {
    id: 'press-pecho',
    name: 'Press de Pecho Sentado en Máquina',
    zone: 'Pecho y Espalda',
    icon: '💪',
    muscles: 'Pectoral · Hombro anterior · Tríceps',
    setup: 'Regula la altura del sillín para que los agarres queden a la altura de la línea media del pecho.',
    technique: 'Mantén las escápulas juntas contra el respaldo. Empuja al frente exhalando y vuelve despacio controlando el peso.',
    isCardio: false
  },
  {
    id: 'contractora',
    name: 'Contractora Pectoral / Pec Deck (Mariposa)',
    zone: 'Pecho y Espalda',
    icon: '🦋',
    muscles: 'Pectoral (aislamiento y firmeza)',
    setup: 'Asiento a una altura donde los codos queden ligeramente por debajo de la línea de los hombros.',
    technique: 'Junta los brazos al frente sintiendo el trabajo en el pecho y abre controlando sin llevar los codos excesivamente atrás.',
    isCardio: false
  },
  {
    id: 'press-hombro',
    name: 'Press de Hombros en Máquina',
    zone: 'Hombros y Brazos',
    icon: '🏋️‍♂️',
    muscles: 'Deltoides (Hombros) · Tríceps',
    setup: 'Ajusta el asiento para que los agarres comiencen a la altura de las orejas o barbilla.',
    technique: 'Espalda bien pegada al respaldo. Empuja verticalmente sin arquear la zona lumbar.',
    isCardio: false
  },
  {
    id: 'polea-triceps-biceps',
    name: 'Estación de Poleas (Extensión Tríceps / Curl Bíceps)',
    zone: 'Hombros y Brazos',
    icon: '💪',
    muscles: 'Tríceps y Bíceps',
    setup: 'Polea arriba con cuerda/barra para Tríceps; polea abajo para Curl de Bíceps.',
    technique: 'Mantén los codos pegados a los costados durante todo el recorrido; solo debe moverse el antebrazo.',
    isCardio: false
  },
  {
    id: 'mancuernas-bancos',
    name: 'Zona de Mancuernas, Barras y Bancos Regulables',
    zone: 'Peso Libre y Multipower',
    icon: '🔩',
    muscles: 'Cuerpo completo · Estabilizadores',
    setup: 'Elige bancos planos o inclinados (30°-45°) según el ejercicio.',
    technique: 'Perfecto para elevaciones laterales de hombro, curl de bíceps alterno, press con mancuernas o peso muerto rumano.',
    isCardio: false
  },
  {
    id: 'trx-colchoneta',
    name: 'Zona Funcional: TRX, Colchonetas, Steps y Fitball',
    zone: 'Funcional y Clases',
    icon: '🧘',
    muscles: 'Core (Abdomen y Lumbar) · Glúteo · Funcional',
    setup: 'Espacio libre con esterillas y anclajes de suspensión TRX.',
    technique: 'Ideal para planchas abdominales, puente de glúteo en suelo, remo en TRX, sentadillas asistidas y estiramientos.',
    isCardio: false
  },
  {
    id: 'cinta',
    name: 'Cinta de Correr (Zona Cardio)',
    zone: 'Cardio',
    icon: '🏃',
    muscles: 'Resistencia cardiovascular · Piernas',
    setup: 'Pulsa Start, ajusta velocidad progresiva y regula la inclinación (Incline).',
    technique: 'Puedes trotar o caminar a buen ritmo (4.8-5.5 km/h) con pendiente (5-9%) sin sujetarte a los agarres.',
    isCardio: true
  },
  {
    id: 'eliptica',
    name: 'Bicicleta Elíptica (Zona Cardio)',
    zone: 'Cardio',
    icon: '⚡',
    muscles: 'Cardio global · Tren superior e inferior sin impacto',
    setup: 'Sube apoyando primero el pie que esté en el pedal más bajo y selecciona nivel de resistencia.',
    technique: 'Movimiento continuo y fluido acompañando con el empuje y tracción de los brazos.',
    isCardio: true
  },
  {
    id: 'bici-clases',
    name: 'Bicis Spinning, Clases Dirigidas y Piscina Marbella',
    zone: 'Funcional y Clases',
    icon: '🚴',
    muscles: 'Cardio · Diversión · Movilidad',
    setup: 'En bici: sillín a la altura de la cadera. Consulta el cuadrante de clases en recepción.',
    technique: 'Aprovechad las clases de Ciclo Indoor, Zumba, Pilates, Yoga y la piscina de verano / sauna del centro.',
    isCardio: true
  }
];

const MARBELLA_ROUTINES = [
  {
    id: 'fullbody-tonificar-a',
    title: '⚡ Full Body Equilibrado A (Máquinas Marbella)',
    subtitle: 'Trabaja todo el cuerpo en una sola sesión · Ideal para 2-3 días/semana',
    goalTag: 'tonificar',
    duration: '45-50 min',
    calories: '~350 kcal',
    coachTip: 'Sesión redonda para activar piernas, espalda, pecho y core sin agujetas extremas. Concéntrate en controlar cada repetición.',
    exercises: [
      { name: 'Activación en Elíptica', machine: 'Bicicleta Elíptica (Zona Cardio)', sets: 1, reps: '5 min', weightKg: 0, durationMin: 5, tip: 'Ritmo suave para entrar en calor.' },
      { name: 'Prensa de Piernas', machine: 'Prensa de Piernas (Placas / Discos)', sets: 3, reps: '12', weightKg: 40, durationMin: 0, tip: 'Pies al centro, no bloquees rodillas.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Jalón al Pecho en Polea Alta', sets: 3, reps: '12', weightKg: 25, durationMin: 0, tip: 'Saca pecho y baja la barra hacia la clavícula.' },
      { name: 'Press de Pecho en Máquina', machine: 'Press de Pecho Sentado en Máquina', sets: 3, reps: '12', weightKg: 20, durationMin: 0, tip: 'Hombros atrás pegados al respaldo.' },
      { name: 'Curl Femoral en Máquina', machine: 'Curl Femoral (Sentado o Tumbado)', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Baja despacio en 2 segundos.' },
      { name: 'Plancha Abdominal en Colchoneta', machine: 'Zona Funcional: TRX, Colchonetas, Steps y Fitball', sets: 3, reps: '35 seg', weightKg: 0, durationMin: 0, tip: 'Abdomen y glúteo firmes.' }
    ]
  },
  {
    id: 'hipertrofia-torso',
    title: '💪 Fuerza e Hipertrofia: Tren Superior (Pecho, Espalda y Brazos)',
    subtitle: 'Enfocada en ganar fuerza, masa muscular y mejorar el torso',
    goalTag: 'hipertrofia',
    duration: '50 min',
    calories: '~340 kcal',
    coachTip: 'Descansa 90 segundos entre series e intenta anotar el peso exacto para superarlo en la próxima semana.',
    exercises: [
      { name: 'Press de Pecho Sentado en Máquina', machine: 'Press de Pecho Sentado en Máquina', sets: 4, reps: '8-10', weightKg: 35, durationMin: 0, tip: 'Empuje potente y bajada controlada.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Jalón al Pecho en Polea Alta', sets: 4, reps: '8-10', weightKg: 35, durationMin: 0, tip: 'Tracción firme llevando codos a los costados.' },
      { name: 'Remo Sentado en Polea Baja', machine: 'Remo Sentado en Polea Baja (Gironda)', sets: 3, reps: '10-12', weightKg: 30, durationMin: 0, tip: 'Aprieta escápulas 1 segundo atrás.' },
      { name: 'Contractora Pectoral (Pec Deck)', machine: 'Contractora Pectoral / Pec Deck (Mariposa)', sets: 3, reps: '12', weightKg: 25, durationMin: 0, tip: 'Estira bien el pectoral sin forzar hombros.' },
      { name: 'Press de Hombros en Máquina', machine: 'Press de Hombros en Máquina', sets: 3, reps: '10-12', weightKg: 20, durationMin: 0, tip: 'Control total en todo el recorrido.' },
      { name: 'Superserie: Extensión Tríceps + Curl Bíceps en Polea', machine: 'Estación de Poleas (Extensión Tríceps / Curl Bíceps)', sets: 3, reps: '12 + 12', weightKg: 15, durationMin: 0, tip: 'Codos pegados al cuerpo.' }
    ]
  },
  {
    id: 'hipertrofia-pierna-gluteo',
    title: '🍑 Especial Pierna, Glúteo y Core Fuerte',
    subtitle: 'Tren inferior completo en las máquinas de placas y Multipower del Marbella',
    goalTag: 'gluteo',
    duration: '50 min',
    calories: '~390 kcal',
    coachTip: 'Coloca los pies un poco más altos en la plataforma de la prensa para dar mayor protagonismo al glúteo e isquios.',
    exercises: [
      { name: 'Prensa de Piernas (Enfoque Glúteo/Muslo)', machine: 'Prensa de Piernas (Placas / Discos)', sets: 4, reps: '10-12', weightKg: 50, durationMin: 0, tip: 'Empuja fuerte con los talones.' },
      { name: 'Hip Thrust o Sentadilla Guiada en Multipower', machine: 'Multipower (Barra Guiada) · Sentadilla / Hip Thrust', sets: 3, reps: '10-12', weightKg: 25, durationMin: 0, tip: 'Aprieta glúteo arriba durante 1-2 segundos.' },
      { name: 'Curl Femoral Sentado/Tumbado', machine: 'Curl Femoral (Sentado o Tumbado)', sets: 3, reps: '12', weightKg: 25, durationMin: 0, tip: 'No despegues la cadera del banco.' },
      { name: 'Extensión de Cuádriceps', machine: 'Extensión de Cuádriceps en Máquina', sets: 3, reps: '12-15', weightKg: 25, durationMin: 0, tip: 'Pausa de 1 segundo arriba.' },
      { name: 'Máquina de Abductores (Glúteo Medio)', machine: 'Máquina de Abductores y Aductores', sets: 3, reps: '15-20', weightKg: 35, durationMin: 0, tip: 'Movimiento controlado sin rebotes.' },
      { name: 'Abdomen en Colchoneta (Crunch + Puente)', machine: 'Zona Funcional: TRX, Colchonetas, Steps y Fitball', sets: 3, reps: '15 reps', weightKg: 0, durationMin: 0, tip: 'Suelta el aire al subir.' }
    ]
  },
  {
    id: 'espalda-sana-movilidad',
    title: '🧘 Espalda Sana, Postura y Cero Impacto',
    subtitle: 'Fortalece espalda, hombros y faja abdominal cuidando las articulaciones',
    goalTag: 'movilidad',
    duration: '45 min',
    calories: '~280 kcal',
    coachTip: 'Ideal si pasáis horas sentados o con tensión en cuello y lumbares. Movimientos suaves y respiración fluida.',
    exercises: [
      { name: 'Bicicleta Estática Suave', machine: 'Bicis Spinning, Clases Dirigidas y Piscina Marbella', sets: 1, reps: '8 min', weightKg: 0, durationMin: 8, tip: 'Pedaleo redondo sin impacto.' },
      { name: 'Remo en Polea Baja (Corrección Postural)', machine: 'Remo Sentado en Polea Baja (Gironda)', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Lleva los hombros atrás y abajo.' },
      { name: 'Jalón al Pecho Agarre Cómodo', machine: 'Jalón al Pecho en Polea Alta', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Estira bien la espalda al subir la barra.' },
      { name: 'Remo en Suspensión con TRX', machine: 'Zona Funcional: TRX, Colchonetas, Steps y Fitball', sets: 3, reps: '12', weightKg: 0, durationMin: 0, tip: 'Cuerpo recto como una tabla.' },
      { name: 'Abductores + Puente de Glúteo (Estabilidad Lumbar)', machine: 'Máquina de Abductores y Aductores', sets: 3, reps: '15', weightKg: 25, durationMin: 0, tip: 'Un glúteo fuerte protege la zona lumbar.' },
      { name: 'Elíptica Fluida', machine: 'Bicicleta Elíptica (Zona Cardio)', sets: 1, reps: '12 min', weightKg: 0, durationMin: 12, tip: 'Moviliza brazos y piernas sin impacto.' }
    ]
  },
  {
    id: 'circuito-metabolico-quema',
    title: '🔥 Circuito Metabólico + Cardio (Alto Gasto Calórico)',
    subtitle: 'Combina fuerza dinámica en máquinas con bloque cardiovascular final',
    goalTag: 'grasa',
    duration: '50 min',
    calories: '~440 kcal',
    coachTip: 'Mantén descansos cortos (45-60 seg) entre máquinas y remata con 20 minutos de cinta inclinada o elíptica.',
    exercises: [
      { name: 'Prensa de Piernas', machine: 'Prensa de Piernas (Placas / Discos)', sets: 3, reps: '15', weightKg: 35, durationMin: 0, tip: 'Ritmo constante.' },
      { name: 'Jalón al Pecho en Polea', machine: 'Jalón al Pecho en Polea Alta', sets: 3, reps: '12-15', weightKg: 25, durationMin: 0, tip: 'Activa toda la espalda.' },
      { name: 'Press de Pecho en Máquina', machine: 'Press de Pecho Sentado en Máquina', sets: 3, reps: '12-15', weightKg: 20, durationMin: 0, tip: 'Controla el regreso.' },
      { name: 'Sentadilla con TRX + Plancha', machine: 'Zona Funcional: TRX, Colchonetas, Steps y Fitball', sets: 3, reps: '15 + 30s', weightKg: 0, durationMin: 0, tip: 'Sin descanso entre sentadilla y plancha.' },
      { name: 'Caminata Rápida con Inclinación o Elíptica', machine: 'Cinta de Correr (Zona Cardio)', sets: 1, reps: '20 min', weightKg: 0, durationMin: 20, tip: 'Pendiente 6-8% a buen ritmo.' }
    ]
  },
  {
    id: 'cardio-clases-salud',
    title: '🏃 Sesión Cardio Mix / Clases del Gimnasio Marbella',
    subtitle: 'Resistencia cardiovascular, corazón fuerte y endorfinas',
    goalTag: 'salud',
    duration: '45 min',
    calories: '~400 kcal',
    coachTip: 'Perfecta para los días en que os apetezca moveros, sudar y despejar la mente sin pensar en contar repeticiones.',
    exercises: [
      { name: 'Cinta de Correr (Progresión de ritmo/pendiente)', machine: 'Cinta de Correr (Zona Cardio)', sets: 1, reps: '15 min', weightKg: 0, durationMin: 15, tip: 'Empieza suave 3 min y sube ritmo.' },
      { name: 'Bicicleta Elíptica por Intervalos', machine: 'Bicicleta Elíptica (Zona Cardio)', sets: 1, reps: '15 min', weightKg: 0, durationMin: 15, tip: 'Alterna 2 min cómodos con 1 min intenso.' },
      { name: 'Bici Estática / Clase Colectiva + Core en Colchoneta', machine: 'Bicis Spinning, Clases Dirigidas y Piscina Marbella', sets: 1, reps: '15 min', weightKg: 0, durationMin: 15, tip: 'Termina estirando 5 min en colchoneta.' }
    ]
  }
];

function GymApp({ onBackToCasita }) {
  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('hogar_user');
    return (saved === 'Ismael' || saved === 'Sandra') ? saved : 'Ismael';
  });
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'train' | 'routines' | 'machines' | 'profile'

  // Datos sincronizados con el servidor
  const [workouts, setWorkouts] = useState([]);
  const [bodyWeights, setBodyWeights] = useState([]);
  const [goals, setGoals] = useState({
    Ismael: { goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo', targetDaysPerWeek: 3, targetWeightKg: null },
    Sandra: { goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo', targetDaysPerWeek: 3, targetWeightKg: null }
  });
  const [customRoutines, setCustomRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cronómetro de descanso
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Estado del Entrenamiento Activo (Tab 'train')
  const [trainMode, setTrainMode] = useState('single'); // 'single' | 'together'
  const [workoutDate, setWorkoutDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [routineName, setRoutineName] = useState('⚡ Full Body Equilibrado A');
  const [durationMin, setDurationMin] = useState(50);
  const [feeling, setFeeling] = useState('💪 Muy bien');
  const [notes, setNotes] = useState('');
  const [activeExercises, setActiveExercises] = useState([]);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [saveBanner, setSaveBanner] = useState('');
  const [historyFilter, setHistoryFilter] = useState('ALL');

  // Estado de Rutinas y Entrenador IA (Tab 'routines')
  const [routineGoalFilter, setRoutineGoalFilter] = useState('TODOS');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDuration, setAiDuration] = useState(45);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Estado de Máquinas (Tab 'machines')
  const [machineZone, setMachineZone] = useState('TODAS');
  const [machineSearch, setMachineSearch] = useState('');

  // Estado de Perfil y Objetivos (Tab 'profile')
  const [profileUser, setProfileUser] = useState(activeUser);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [weightNote, setWeightNote] = useState('');

  // Cambiar título y manifest cuando se abre la app del gimnasio
  useEffect(() => {
    document.title = 'Marbella Fit · Personal Trainer';
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = '/manifest-gym.json';
  }, []);

  const switchUser = (u) => {
    setActiveUser(u);
    setProfileUser(u);
    localStorage.setItem('hogar_user', u);
  };

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
    } catch (e) {
      console.error('Error cargando datos de Marbella Fit:', e);
    } finally {
      setLoading(false);
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

  // Buscar último peso y récord personal (PR) de un usuario en un ejercicio/máquina
  const getExerciseStatsForUser = (user, exName, machineName) => {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const tEx = norm(exName);
    const tMach = norm(machineName);
    let lastWeight = null;
    let lastReps = null;
    let prWeight = 0;

    for (const w of workouts) {
      if (user && w.user !== user) continue;
      for (const ex of (w.exercises || [])) {
        const eName = norm(ex.name);
        const eMach = norm(ex.machine);
        const matches = (tEx && eName === tEx) || (tMach && eMach && (eMach.includes(tMach) || tMach.includes(eMach)));
        if (!matches) continue;

        const wKg = Number(ex.weightKg) || 0;
        if (wKg > 0 && lastWeight === null) {
          lastWeight = wKg;
          lastReps = ex.reps || '12';
        }
        if (wKg > prWeight) prWeight = wKg;

        if (Array.isArray(ex.setDetails)) {
          for (const s of ex.setDetails) {
            const sw = Number(s.weightKg) || 0;
            if (sw > prWeight) prWeight = sw;
          }
        }
      }
    }
    return { lastWeight, lastReps, prWeight: prWeight > 0 ? prWeight : null };
  };

  // Preparar ejercicios con series desglosadas (Set 1, Set 2, Set 3...)
  const buildExerciseWithSets = (ex, userForWeights) => {
    const stats = getExerciseStatsForUser(userForWeights || activeUser, ex.name, ex.machine);
    const numSets = Number(ex.sets) || 3;
    const defaultWeight = stats.lastWeight !== null ? stats.lastWeight : (Number(ex.weightKg) || 0);
    const defaultReps = String(ex.reps || '12');

    const setDetails = Array.from({ length: numSets }, () => ({
      reps: defaultReps,
      weightKg: defaultWeight,
      done: true
    }));

    return {
      name: ex.name,
      machine: ex.machine || 'Gimnasio Marbella',
      sets: numSets,
      reps: defaultReps,
      weightKg: defaultWeight,
      durationMin: Number(ex.durationMin) || 0,
      tip: ex.tip || '',
      completed: true,
      setDetails
    };
  };

  // Inicializar el logger con la primera rutina por defecto
  useEffect(() => {
    if (activeExercises.length === 0) {
      const r = MARBELLA_ROUTINES[0];
      setActiveExercises(r.exercises.map(ex => buildExerciseWithSets(ex, activeUser)));
    }
  }, []);

  const loadRoutineToTrain = (routine) => {
    setRoutineName(routine.title);
    const mins = parseInt(String(routine.duration).replace(/\D/g, ''), 10) || 50;
    setDurationMin(mins);
    setActiveExercises((routine.exercises || []).map(ex => buildExerciseWithSets(ex, activeUser)));
    setActiveTab('train');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calcular volumen en vivo del entreno actual
  const liveVolumeKg = activeExercises.reduce((sum, ex) => {
    if (ex.completed === false) return sum;
    if (Array.isArray(ex.setDetails) && ex.setDetails.length > 0) {
      return sum + ex.setDetails.reduce((sSum, s) => {
        if (!s.done) return sSum;
        const r = parseInt(String(s.reps), 10) || 0;
        const w = Number(s.weightKg) || 0;
        return sSum + (r * w);
      }, 0);
    }
    return sum + ((Number(ex.sets) || 0) * (parseInt(String(ex.reps), 10) || 0) * (Number(ex.weightKg) || 0));
  }, 0);

  // Estadísticas semanales
  const getMondayStr = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  };
  const mondayStr = getMondayStr();
  const weekWorkouts = workouts.filter(w => w.date >= mondayStr);
  const ismaelWeekDays = weekWorkouts.filter(w => w.user === 'Ismael').length;
  const sandraWeekDays = weekWorkouts.filter(w => w.user === 'Sandra').length;

  // Guardar entrenamiento
  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    setSavingWorkout(true);
    setSaveBanner('');
    try {
      const normalizedExercises = activeExercises.map(ex => {
        const doneSets = (ex.setDetails || []).filter(s => s.done);
        const maxWeight = doneSets.reduce((m, s) => Math.max(m, Number(s.weightKg) || 0), Number(ex.weightKg) || 0);
        return {
          ...ex,
          sets: (ex.setDetails || []).length || ex.sets || 3,
          weightKg: maxWeight
        };
      });

      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: {
            user: activeUser,
            date: workoutDate,
            routineName,
            durationMin: Number(durationMin) || 45,
            caloriesBurned: Math.round((Number(durationMin) || 45) * 7.5),
            feeling,
            notes,
            exercises: normalizedExercises
          },
          together: trainMode === 'together'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setNotes('');
        setSaveBanner(
          trainMode === 'together'
            ? '🎉 ¡Entrenamiento guardado para Ismael y Sandra!'
            : `🎉 ¡Entrenamiento de ${activeUser} guardado con éxito!`
        );
        setTimeout(() => setSaveBanner(''), 5000);
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
    } catch (e) {
      console.error(e);
    }
  };

  // Guardar objetivo personal del usuario en Tab 'profile'
  const handleUpdateUserProfile = async (user, updates) => {
    const current = goals[user] || {};
    const merged = { ...current, ...updates };
    setGoals({ ...goals, [user]: merged });
    setSavingProfile(true);
    try {
      const res = await fetch('/api/gym/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, ...merged })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.goals) setGoals(data.goals);
        setProfileSavedMsg(`✅ Objetivos de ${user} actualizados`);
        setTimeout(() => setProfileSavedMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  // Pedir rutina al Entrenador IA
  const handleAskCoach = async (customQuery) => {
    const q = customQuery || aiPrompt;
    if (!q.trim()) return;
    setAiLoading(true);
    const userGoal = goals[activeUser] || {};
    try {
      const res = await fetch('/api/gym/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          user: activeUser,
          durationMin: aiDuration,
          goalLabel: userGoal.goalLabel,
          customFocus: userGoal.customFocus
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.routine) setAiResult(data.routine);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveCustomRoutine = async () => {
    if (!aiResult) return;
    try {
      const res = await fetch('/api/gym/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiResult)
      });
      if (res.ok) {
        const data = await res.json();
        setCustomRoutines(data.customRoutines || []);
        setAiResult(null);
        setAiPrompt('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWeightEntry = async (e) => {
    e.preventDefault();
    if (!weightInput) return;
    try {
      const res = await fetch('/api/gym/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: profileUser,
          date: new Date().toISOString().split('T')[0],
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

  // Obtener metadatos del objetivo actual del usuario activo
  const activeUserGoal = goals[activeUser] || {};
  const activeGoalMeta = GOAL_OPTIONS.find(g => g.id === activeUserGoal.goalType) || GOAL_OPTIONS[0];
  const recommendedRoutines = MARBELLA_ROUTINES.filter(r => r.goalTag === activeGoalMeta.id);
  const todaySuggestedRoutine = recommendedRoutines[0] || MARBELLA_ROUTINES[0];

  // Estilos base del tema claro (Light Mode Fitness App)
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
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 1rem',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
    },
    container: {
      maxWidth: '880px',
      margin: '0 auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '1.1rem',
      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
    },
    input: {
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '0.55rem 0.75rem',
      color: '#0f172a',
      fontSize: '0.85rem',
      outline: 'none'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.7rem 1.1rem',
      fontWeight: 700,
      fontSize: '0.88rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
    },
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      background: 'rgba(255, 255, 255, 0.98)',
      borderTop: '1px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      padding: '0.4rem 0.3rem calc(0.4rem + env(safe-area-inset-bottom, 0px))',
      boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.06)'
    }
  };

  return (
    <div style={S.page}>
      {/* CABECERA SUPERIOR CLARA */}
      <header style={S.header}>
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            {onBackToCasita && (
              <button
                type="button"
                onClick={onBackToCasita}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  borderRadius: '10px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Volver a Casita Hub"
              >
                🏠 Casita
              </button>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏋️</span>
                <span style={{ fontWeight: 900, fontSize: '1.08rem', color: '#0f172a', letterSpacing: '-0.3px' }}>
                  Marbella Fit
                </span>
                <span style={{
                  fontSize: '0.64rem',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontWeight: 700
                }}>
                  Carabanchel
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Personal Trainer · Vía Lusitana 1
              </div>
            </div>
          </div>

          {/* Selector de usuario (Ismael / Sandra) y Cronómetro rápido */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {timerSeconds > 0 && (
              <button
                type="button"
                onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                style={{
                  background: timerSeconds <= 10 ? '#fef2f2' : '#ecfdf5',
                  border: `1px solid ${timerSeconds <= 10 ? '#fecaca' : '#a7f3d0'}`,
                  color: timerSeconds <= 10 ? '#dc2626' : '#059669',
                  borderRadius: '999px',
                  padding: '0.28rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
                title="Pulsar para cancelar cronómetro"
              >
                ⏱️ {formatTimer(timerSeconds)} &times;
              </button>
            )}

            <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              {['Ismael', 'Sandra'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => switchUser(u)}
                  style={{
                    background: activeUser === u ? '#ffffff' : 'transparent',
                    color: activeUser === u ? '#0f172a' : '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: activeUser === u ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  {u === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main style={S.container}>

        {/* ============================================================
            PESTAÑA 1: INICIO (DASHBOARD DEL ENTRENADOR PERSONAL)
           ============================================================ */}
        {activeTab === 'dashboard' && (
          <>
            {/* Tarjeta de Bienvenida y Objetivo Personal Activo */}
            <div style={{
              ...S.card,
              background: `linear-gradient(135deg, ${activeGoalMeta.bg} 0%, #ffffff 100%)`,
              border: `1px solid ${activeGoalMeta.border}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: activeGoalMeta.color,
                    background: '#ffffff',
                    border: `1px solid ${activeGoalMeta.border}`,
                    padding: '0.18rem 0.6rem',
                    borderRadius: '999px',
                    marginBottom: '0.4rem'
                  }}>
                    {activeGoalMeta.icon} Objetivo de {activeUser}: {activeGoalMeta.label}
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    ¡Hola, {activeUser}! Tu Entrenador Personal está listo
                  </h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                    {activeUserGoal.customFocus
                      ? `📌 Tu foco personal: "${activeUserGoal.customFocus}"`
                      : activeGoalMeta.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { setProfileUser(activeUser); setActiveTab('profile'); }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    borderRadius: '10px',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🎯 Cambiar mi objetivo
                </button>
              </div>

              {/* Resumen de ambos esta semana */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.7rem', marginTop: '1rem' }}>
                {['Ismael', 'Sandra'].map((u) => {
                  const uGoal = goals[u] || {};
                  const uMeta = GOAL_OPTIONS.find(g => g.id === uGoal.goalType) || GOAL_OPTIONS[0];
                  const doneDays = u === 'Ismael' ? ismaelWeekDays : sandraWeekDays;
                  const targetDays = uGoal.targetDaysPerWeek || 3;
                  const pct = Math.min(100, Math.round((doneDays / targetDays) * 100));

                  return (
                    <div
                      key={u}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                          {u === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: uMeta.color, fontWeight: 700 }}>
                          {uMeta.icon} {uMeta.shortLabel}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                          {doneDays} / {targetDays} días
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          esta semana {doneDays >= targetDays ? '🏆' : ''}
                        </span>
                      </div>
                      <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginTop: '0.4rem' }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: u === 'Ismael' ? '#2563eb' : '#db2777',
                          borderRadius: '999px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cronómetro rápido de sala */}
            <div style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', padding: '0.85rem 1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Cronómetro de Descanso entre Series</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Recomendado para tu objetivo: {activeGoalMeta.trainerAdvice.rest}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => startTimer(sec)}
                    style={{
                      background: timerSeconds === sec ? '#059669' : '#f1f5f9',
                      color: timerSeconds === sec ? '#ffffff' : '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Sesión Recomendada Hoy según el objetivo elegido */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                    🎯 Sesión recomendada para el objetivo de {activeUser}
                  </span>
                  <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.05rem', color: '#0f172a' }}>
                    {todaySuggestedRoutine.title}
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '8px' }}>
                  ⏱️ {todaySuggestedRoutine.duration}
                </span>
              </div>

              <p style={{ margin: '0 0 0.7rem 0', fontSize: '0.8rem', color: '#475569' }}>
                🎓 <strong>Personal Trainer:</strong> {todaySuggestedRoutine.coachTip}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '0.9rem' }}>
                {todaySuggestedRoutine.exercises.map((ex, i) => {
                  const st = getExerciseStatsForUser(activeUser, ex.name, ex.machine);
                  return (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.55rem 0.7rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{i + 1}. {ex.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#2563eb', marginTop: '0.1rem' }}>📍 {ex.machine}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                        <span>{ex.sets} series × {ex.reps}</span>
                        {st.lastWeight && <span style={{ color: '#059669' }}>Último: {st.lastWeight} kg</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => loadRoutineToTrain(todaySuggestedRoutine)}
                  style={{ ...S.btnPrimary, flex: 1 }}
                >
                  ▶️ Empezar este Entreno Ahora
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('routines')}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    borderRadius: '12px',
                    padding: '0.7rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Ver todas las rutinas →
                </button>
              </div>
            </div>

            {/* Pautas de tu Entrenador según tu objetivo */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '0.95rem', color: '#0f172a' }}>
                📋 Guía Rápida de tu Entrenador para "{activeGoalMeta.shortLabel}"
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>REPETICIONES OBJETIVO</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{activeGoalMeta.trainerAdvice.reps}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DESCANSO ENTRE SERIES</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{activeGoalMeta.trainerAdvice.rest}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>USO DEL CARDIO</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginTop: '0.2rem' }}>{activeGoalMeta.trainerAdvice.cardio}</div>
                </div>
              </div>
              <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#047857', background: '#ecfdf5', padding: '0.65rem 0.8rem', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                💡 <strong>Clave de tu entrenador:</strong> {activeGoalMeta.trainerAdvice.keyTip}
              </div>
            </div>
          </>
        )}

        {/* ============================================================
            PESTAÑA 2: ENTRENAR (REGISTRO EN VIVO SERIE POR SERIE + HISTORIAL)
           ============================================================ */}
        {activeTab === 'train' && (
          <>
            <form onSubmit={handleSaveWorkout} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                    🏋️ Cuaderno de Entrenamiento en Vivo
                  </h2>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Volumen actual de la sesión: <strong style={{ color: '#059669' }}>{Math.round(liveVolumeKg)} kg movidos</strong>
                  </span>
                </div>

                <select
                  onChange={(e) => {
                    const found = [...customRoutines, ...MARBELLA_ROUTINES].find(r => r.id === e.target.value);
                    if (found) loadRoutineToTrain(found);
                  }}
                  defaultValue=""
                  style={{ ...S.input, fontSize: '0.78rem', padding: '0.4rem 0.6rem' }}
                >
                  <option value="" disabled>🔄 Cargar otra rutina...</option>
                  {[...customRoutines, ...MARBELLA_ROUTINES].map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              {/* Selector Individual vs En Pareja */}
              <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setTrainMode('single')}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '10px',
                    border: trainMode === 'single' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: trainMode === 'single' ? '#eff6ff' : '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {activeUser === 'Ismael' ? '👦 Entreno de Ismael' : '👧 Entreno de Sandra'}
                </button>
                <button
                  type="button"
                  onClick={() => setTrainMode('together')}
                  style={{
                    flex: 1,
                    padding: '0.55rem',
                    borderRadius: '10px',
                    border: trainMode === 'together' ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: trainMode === 'together' ? '#ecfdf5' : '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  👫 ¡Entrenamos Juntos! (Guardar a ambos)
                </button>
              </div>

              {/* Título, Fecha y Duración */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Sesión / Rutina</label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    style={{ ...S.input, width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Fecha</label>
                  <input
                    type="date"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    style={{ ...S.input, width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Duración (min)</label>
                  <input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    style={{ ...S.input, width: '100%', boxSizing: 'border-box' }}
                    min="5"
                    max="240"
                  />
                </div>
              </div>

              {/* Ejercicios con tabla de series individual (Set 1, Set 2, Set 3...) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {activeExercises.map((ex, exIdx) => {
                  const prevStats = getExerciseStatsForUser(activeUser, ex.name, ex.machine);
                  const setsList = Array.isArray(ex.setDetails) && ex.setDetails.length > 0
                    ? ex.setDetails
                    : [{ reps: ex.reps || '12', weightKg: ex.weightKg || 0, done: true }];

                  return (
                    <div
                      key={exIdx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => {
                              const copy = [...activeExercises];
                              copy[exIdx].name = e.target.value;
                              setActiveExercises(copy);
                            }}
                            style={{
                              ...S.input,
                              background: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              width: '100%',
                              boxSizing: 'border-box',
                              padding: '0.4rem 0.6rem'
                            }}
                            placeholder="Nombre del ejercicio o máquina"
                          />
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
                              📍 {ex.machine || 'Gimnasio Marbella'}
                            </span>
                            {prevStats.lastWeight && (
                              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                                ⏮️ Anterior ({activeUser}): {prevStats.lastWeight} kg × {prevStats.lastReps}
                              </span>
                            )}
                            {prevStats.prWeight && (
                              <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>
                                🏆 Récord: {prevStats.prWeight} kg
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveExercises(activeExercises.filter((_, i) => i !== exIdx))}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            borderRadius: '8px',
                            padding: '0.3rem 0.55rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                          title="Quitar ejercicio"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Filas de series */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                        {setsList.map((s, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              background: s.done ? '#ecfdf5' : '#ffffff',
                              border: `1px solid ${s.done ? '#a7f3d0' : '#e2e8f0'}`,
                              borderRadius: '8px',
                              padding: '0.35rem 0.6rem'
                            }}
                          >
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', minWidth: '52px' }}>
                              Serie {sIdx + 1}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                              <input
                                type="number"
                                step="0.5"
                                value={s.weightKg}
                                onChange={(e) => {
                                  const copy = [...activeExercises];
                                  const newSets = [...setsList];
                                  newSets[sIdx] = { ...newSets[sIdx], weightKg: e.target.value };
                                  copy[exIdx].setDetails = newSets;
                                  setActiveExercises(copy);
                                }}
                                style={{ ...S.input, background: '#ffffff', width: '68px', padding: '0.3rem', textAlign: 'center', fontWeight: 700 }}
                                placeholder="0"
                              />
                              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>kg</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                              <input
                                type="text"
                                value={s.reps}
                                onChange={(e) => {
                                  const copy = [...activeExercises];
                                  const newSets = [...setsList];
                                  newSets[sIdx] = { ...newSets[sIdx], reps: e.target.value };
                                  copy[exIdx].setDetails = newSets;
                                  setActiveExercises(copy);
                                }}
                                style={{ ...S.input, background: '#ffffff', width: '68px', padding: '0.3rem', textAlign: 'center', fontWeight: 700 }}
                                placeholder="12"
                              />
                              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>reps/min</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...activeExercises];
                                const newSets = [...setsList];
                                newSets[sIdx] = { ...newSets[sIdx], done: !newSets[sIdx].done };
                                copy[exIdx].setDetails = newSets;
                                setActiveExercises(copy);
                              }}
                              style={{
                                background: s.done ? '#059669' : '#e2e8f0',
                                color: s.done ? '#ffffff' : '#64748b',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              ✓
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Botones para añadir o quitar serie */}
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...activeExercises];
                            const lastSet = setsList[setsList.length - 1] || { reps: '12', weightKg: 20, done: true };
                            copy[exIdx].setDetails = [...setsList, { ...lastSet, done: true }];
                            setActiveExercises(copy);
                          }}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#2563eb',
                            borderRadius: '8px',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          + Añadir Serie
                        </button>
                        {setsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...activeExercises];
                              copy[exIdx].setDetails = setsList.slice(0, -1);
                              setActiveExercises(copy);
                            }}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#64748b',
                              borderRadius: '8px',
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            - Quitar Serie
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Añadir máquina del Marbella o ejercicio libre */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select
                    onChange={(e) => {
                      const mach = MARBELLA_MACHINES.find(m => m.id === e.target.value);
                      if (mach) {
                        setActiveExercises([
                          ...activeExercises,
                          buildExerciseWithSets({
                            name: mach.name,
                            machine: mach.zone,
                            sets: mach.isCardio ? 1 : 3,
                            reps: mach.isCardio ? '15 min' : '12',
                            weightKg: 20
                          }, activeUser)
                        ]);
                      }
                      e.target.value = '';
                    }}
                    defaultValue=""
                    style={{ ...S.input, flex: 1, minWidth: '210px', fontWeight: 600 }}
                  >
                    <option value="" disabled>➕ Añadir máquina del Gimnasio Marbella...</option>
                    {MARBELLA_MACHINES.map(m => (
                      <option key={m.id} value={m.id}>{m.icon} {m.name} ({m.zone})</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveExercises([
                        ...activeExercises,
                        buildExerciseWithSets({ name: 'Ejercicio Libre', machine: 'Gimnasio Marbella', sets: 3, reps: '12', weightKg: 10 }, activeUser)
                      ]);
                    }}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      borderRadius: '10px',
                      padding: '0.55rem 0.9rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Ejercicio Libre
                  </button>
                </div>
              </div>

              {/* Sensación y notas */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                <select
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  style={{ ...S.input, flex: '1 1 150px' }}
                >
                  <option value="🔥 A tope">🔥 A tope de fuerza y energía</option>
                  <option value="💪 Muy bien">💪 Muy buenas sensaciones</option>
                  <option value="😅 Duro pero hecho">😅 Duro pero hemos cumplido</option>
                  <option value="🧘 Sesión técnica / suave">🧘 Sesión técnica o movilidad</option>
                </select>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas (ej: Subí 5 kg en prensa, muy cómodos hoy...)"
                  style={{ ...S.input, flex: '2 1 220px' }}
                />
              </div>

              {saveBanner && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  color: '#047857',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  marginBottom: '0.8rem'
                }}>
                  {saveBanner}
                </div>
              )}

              <button type="submit" disabled={savingWorkout} style={{ ...S.btnPrimary, width: '100%', padding: '0.85rem', fontSize: '0.92rem' }}>
                {savingWorkout ? 'Guardando entrenamiento...' : '✅ Finalizar y Guardar Entrenamiento'}
              </button>
            </form>

            {/* Historial de Entrenamientos */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                  🏅 Historial de Entrenamientos ({workouts.length})
                </h3>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['ALL', 'Ismael', 'Sandra'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHistoryFilter(f)}
                      style={{
                        background: historyFilter === f ? '#0f172a' : '#f1f5f9',
                        color: historyFilter === f ? '#ffffff' : '#475569',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {f === 'ALL' ? 'Todos' : f === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                    </button>
                  ))}
                </div>
              </div>

              {(historyFilter === 'ALL' ? workouts : workouts.filter(w => w.user === historyFilter)).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '1.5rem 0', margin: 0 }}>
                  Aún no hay entrenamientos guardados en este filtro. ¡Cuando empecéis en el Gimnasio Marbella aparecerán aquí todas vuestras sesiones!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {(historyFilter === 'ALL' ? workouts : workouts.filter(w => w.user === historyFilter)).map(w => (
                    <div
                      key={w.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '6px',
                              background: w.user === 'Ismael' ? '#dbeafe' : '#fce7f3',
                              color: w.user === 'Ismael' ? '#1d4ed8' : '#be185d'
                            }}>
                              {w.user === 'Ismael' ? '👦 Ismael' : '👧 Sandra'}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{w.routineName}</strong>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                            📅 {w.date} · ⏱️ {w.durationMin} min {w.totalVolumeKg > 0 ? `· 🏋️ Volumen: ${w.totalVolumeKg} kg` : ''} · {w.feeling}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setRoutineName(w.routineName);
                              setDurationMin(w.durationMin);
                              setActiveExercises((w.exercises || []).map(ex => buildExerciseWithSets(ex, activeUser)));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#047857',
                              borderRadius: '8px',
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            🔄 Repetir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkout(w.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {w.notes && (
                        <div style={{ fontSize: '0.76rem', color: '#334155', marginTop: '0.4rem', fontStyle: 'italic' }}>
                          💬 "{w.notes}"
                        </div>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.55rem' }}>
                        {(w.exercises || []).map((ex, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.7rem',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              color: '#334155',
                              fontWeight: 600
                            }}
                          >
                            {ex.name}: {ex.sets}×{ex.reps} {ex.weightKg > 0 ? `(${ex.weightKg} kg)` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ============================================================
            PESTAÑA 3: RUTINAS & ENTRENADOR PERSONAL IA
           ============================================================ */}
        {activeTab === 'routines' && (
          <>
            {/* Consultorio del Personal Trainer IA */}
            <div style={{ ...S.card, background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.02rem', color: '#1e3a8a' }}>
                    Entrenador Personal IA · Crea tu sesión a medida
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569' }}>
                    Adaptado al objetivo actual de <strong>{activeUser}</strong> ({activeGoalMeta.shortLabel}) y a las máquinas del Gimnasio Marbella.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                {[
                  '💪 Rutina de fuerza para torso y brazos',
                  '🍑 Sesión intensa de glúteo, pierna y abdomen',
                  '⚡ Entreno completo de 35 min sin parar',
                  '🧘 Sesión de espalda sana y cero impacto en rodillas'
                ].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => { setAiPrompt(chip); handleAskCoach(chip); }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #93c5fd',
                      color: '#1d4ed8',
                      borderRadius: '999px',
                      padding: '0.3rem 0.7rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Pídele lo que quieras a tu entrenador (ej: Quiero entrenar pecho, hombro y tríceps en 45 min)..."
                  style={{ ...S.input, background: '#ffffff', flex: 1, minWidth: '210px' }}
                />
                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(Number(e.target.value))}
                  style={{ ...S.input, background: '#ffffff', width: '95px' }}
                >
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={() => handleAskCoach()}
                  style={S.btnPrimary}
                >
                  {aiLoading ? 'Creando...' : '✨ Diseñar'}
                </button>
              </div>

              {aiResult && (
                <div style={{ marginTop: '0.9rem', background: '#ffffff', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#047857' }}>{aiResult.title}</h4>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>⏱️ {aiResult.duration}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#334155', margin: '0.4rem 0' }}>
                    🎓 <strong>Consejo:</strong> {aiResult.coachTip}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    {(aiResult.exercises || []).map((ex, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', background: '#f8fafc', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <strong>{i + 1}. {ex.name}</strong> <span style={{ color: '#2563eb' }}>({ex.machine})</span> — <strong>{ex.sets} × {ex.reps}</strong>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => loadRoutineToTrain(aiResult)} style={{ ...S.btnPrimary, flex: 1 }}>
                      ▶️ Entrenar esta Rutina Ahora
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomRoutine}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #93c5fd',
                        color: '#1d4ed8',
                        borderRadius: '12px',
                        padding: '0.6rem 0.9rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      💾 Guardar en Biblioteca
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filtro por objetivo */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setRoutineGoalFilter('TODOS')}
                style={{
                  background: routineGoalFilter === 'TODOS' ? '#0f172a' : '#ffffff',
                  color: routineGoalFilter === 'TODOS' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Todas las Rutinas
              </button>
              {GOAL_OPTIONS.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setRoutineGoalFilter(g.id)}
                  style={{
                    background: routineGoalFilter === g.id ? g.color : '#ffffff',
                    color: routineGoalFilter === g.id ? '#ffffff' : '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {g.icon} {g.shortLabel}
                </button>
              ))}
            </div>

            {/* Listado de rutinas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[...customRoutines, ...MARBELLA_ROUTINES]
                .filter(r => routineGoalFilter === 'TODOS' || r.goalTag === routineGoalFilter)
                .map((routine) => {
                  const gMeta = GOAL_OPTIONS.find(g => g.id === routine.goalTag) || activeGoalMeta;
                  return (
                    <div key={routine.id} style={S.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: gMeta.color,
                            background: gMeta.bg,
                            border: `1px solid ${gMeta.border}`,
                            padding: '0.12rem 0.5rem',
                            borderRadius: '999px'
                          }}>
                            {gMeta.icon} {gMeta.shortLabel}
                          </span>
                          <h4 style={{ margin: '0.35rem 0 0.15rem 0', fontSize: '1.02rem', color: '#0f172a' }}>{routine.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>{routine.subtitle}</p>
                        </div>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', background: '#f1f5f9', padding: '0.25rem 0.55rem', borderRadius: '8px' }}>
                          ⏱️ {routine.duration}
                        </span>
                      </div>

                      <div style={{
                        margin: '0.65rem 0',
                        padding: '0.55rem 0.75rem',
                        background: '#f8fafc',
                        borderLeft: `3px solid ${gMeta.color}`,
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#334155'
                      }}>
                        🎓 <strong>Personal Trainer:</strong> {routine.coachTip}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.45rem', marginBottom: '0.8rem' }}>
                        {(routine.exercises || []).map((ex, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 0.65rem', fontSize: '0.76rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{idx + 1}. {ex.name}</div>
                            <div style={{ fontSize: '0.68rem', color: '#2563eb' }}>📍 {ex.machine}</div>
                            <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, marginTop: '0.15rem' }}>
                              {ex.sets} series × {ex.reps}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button type="button" onClick={() => loadRoutineToTrain(routine)} style={{ ...S.btnPrimary, width: '100%' }}>
                        ▶️ Cargar en Entrenar Hoy
                      </button>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* ============================================================
            PESTAÑA 4: MÁQUINAS DEL GIMNASIO MARBELLA
           ============================================================ */}
        {activeTab === 'machines' && (
          <>
            <div style={S.card}>
              <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.08rem', color: '#0f172a' }}>
                🏢 Guía de Máquinas · Gimnasio Marbella (Vía Lusitana 1)
              </h2>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem', color: '#64748b' }}>
                Consulta cómo regular cada máquina, qué músculos trabaja y vuestro récord de peso registrado.
              </p>

              <input
                type="text"
                value={machineSearch}
                onChange={(e) => setMachineSearch(e.target.value)}
                placeholder="🔍 Buscar máquina o músculo (ej: prensa, espalda, glúteo, polea)..."
                style={{ ...S.input, width: '100%', boxSizing: 'border-box', marginBottom: '0.65rem' }}
              />

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['TODAS', 'Pierna y Glúteo', 'Pecho y Espalda', 'Hombros y Brazos', 'Peso Libre y Multipower', 'Cardio', 'Funcional y Clases'].map(z => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setMachineZone(z)}
                    style={{
                      background: machineZone === z ? '#0f172a' : '#f1f5f9',
                      color: machineZone === z ? '#ffffff' : '#334155',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.32rem 0.7rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '0.8rem' }}>
              {MARBELLA_MACHINES
                .filter(m => machineZone === 'TODAS' || m.zone === machineZone)
                .filter(m => {
                  if (!machineSearch.trim()) return true;
                  const q = machineSearch.toLowerCase();
                  return m.name.toLowerCase().includes(q) || m.muscles.toLowerCase().includes(q) || m.zone.toLowerCase().includes(q);
                })
                .map(m => {
                  const stIsmael = getExerciseStatsForUser('Ismael', m.name, m.name);
                  const stSandra = getExerciseStatsForUser('Sandra', m.name, m.name);

                  return (
                    <div key={m.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.6rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a' }}>{m.icon} {m.name}</h4>
                          <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {m.zone}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.25rem' }}>
                          🎯 {m.muscles}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#334155', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', marginTop: '0.45rem', border: '1px solid #e2e8f0' }}>
                          <div><strong>⚙️ Ajuste:</strong> {m.setup}</div>
                          <div style={{ marginTop: '0.25rem' }}><strong>🎓 Técnica:</strong> {m.technique}</div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                          <span>👦 Ismael: <strong>{stIsmael.lastWeight ? `${stIsmael.lastWeight} kg` : '—'}</strong></span>
                          <span>👧 Sandra: <strong>{stSandra.lastWeight ? `${stSandra.lastWeight} kg` : '—'}</strong></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveExercises([
                              ...activeExercises,
                              buildExerciseWithSets({
                                name: m.name,
                                machine: m.zone,
                                sets: m.isCardio ? 1 : 3,
                                reps: m.isCardio ? '15 min' : '12',
                                weightKg: 20
                              }, activeUser)
                            ]);
                            setActiveTab('train');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '10px',
                            border: '1px solid #a7f3d0',
                            background: '#ecfdf5',
                            color: '#047857',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          + Añadir a mi entrenamiento de hoy
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* ============================================================
            PESTAÑA 5: OBJETIVOS Y PERFIL DE CADA UNO
           ============================================================ */}
        {activeTab === 'profile' && (
          <>
            {/* Selector de de quién estamos editando los objetivos */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.9rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                    🎯 Objetivos Personales en el Gimnasio
                  </h2>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Cada uno podéis elegir qué queréis conseguir en el gimnasio y vuestro entrenador adaptará las sesiones.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['Ismael', 'Sandra'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setProfileUser(u)}
                      style={{
                        background: profileUser === u ? '#0f172a' : '#f1f5f9',
                        color: profileUser === u ? '#ffffff' : '#334155',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {u === 'Ismael' ? '👦 Objetivos de Ismael' : '👧 Objetivos de Sandra'}
                    </button>
                  ))}
                </div>
              </div>

              {profileSavedMsg && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  color: '#047857',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '0.8rem',
                  textAlign: 'center'
                }}>
                  {profileSavedMsg}
                </div>
              )}

              {/* Tarjetas de elección de objetivo principal */}
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                1. ¿Qué quiere conseguir {profileUser} en el Gimnasio Marbella?
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = (goals[profileUser]?.goalType || 'tonificar') === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => handleUpdateUserProfile(profileUser, { goalType: g.id, goalLabel: `${g.icon} ${g.label}` })}
                      style={{
                        padding: '0.8rem',
                        borderRadius: '12px',
                        border: isSelected ? `2px solid ${g.color}` : '1px solid #e2e8f0',
                        background: isSelected ? g.bg : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                          {g.icon} {g.label}
                        </span>
                        {isSelected && <span style={{ color: g.color, fontWeight: 900 }}>✓</span>}
                      </div>
                      <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.74rem', color: '#475569', lineHeight: 1.35 }}>
                        {g.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Meta de días por semana y Foco específico */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    2. Días de entrenamiento por semana ({profileUser})
                  </label>
                  <select
                    value={goals[profileUser]?.targetDaysPerWeek || 3}
                    onChange={(e) => handleUpdateUserProfile(profileUser, { targetDaysPerWeek: Number(e.target.value) })}
                    style={{ ...S.input, width: '100%' }}
                  >
                    <option value={2}>2 días / semana (Mantenimiento y hábito)</option>
                    <option value={3}>3 días / semana (Ideal y equilibrado)</option>
                    <option value={4}>4 días / semana (Progreso rápido)</option>
                    <option value={5}>5 días / semana (Avanzado)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    3. Nivel de experiencia actual
                  </label>
                  <select
                    value={goals[profileUser]?.level || 'Adaptación / Progresivo'}
                    onChange={(e) => handleUpdateUserProfile(profileUser, { level: e.target.value })}
                    style={{ ...S.input, width: '100%' }}
                  >
                    <option value="Empezando de cero">🌱 Empezando de cero (Adaptación)</option>
                    <option value="Adaptación / Progresivo">⚡ Intermedio / Progresivo</option>
                    <option value="Avanzado / Intenso">🔥 Avanzado / Entreno intenso</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  4. Nota o prioridad personal de {profileUser} (el Entrenador IA la tendrá siempre en cuenta)
                </label>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={goals[profileUser]?.customFocus || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGoals({
                        ...goals,
                        [profileUser]: { ...(goals[profileUser] || {}), customFocus: val }
                      });
                    }}
                    placeholder="Ej: Quiero ganar fuerza en pecho y brazos / Priorizar glúteo y cuidar rodillas..."
                    style={{ ...S.input, flex: 1, minWidth: '220px' }}
                  />
                  <button
                    type="button"
                    disabled={savingProfile}
                    onClick={() => handleUpdateUserProfile(profileUser, { customFocus: goals[profileUser]?.customFocus || '' })}
                    style={S.btnPrimary}
                  >
                    Guardar Prioridad
                  </button>
                </div>
              </div>
            </div>

            {/* Registro opcional de medidas / peso corporal */}
            <div style={S.card}>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '0.98rem', color: '#0f172a' }}>
                📏 Seguimiento Corporal Opcional ({profileUser})
              </h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.76rem', color: '#64748b' }}>
                Si queréis llevar registro de vuestro peso corporal (ya sea para ganar masa muscular, manteneros o definir), podéis apuntarlo aquí.
              </p>

              <form onSubmit={handleAddWeightEntry} style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder={`Peso de ${profileUser} (kg)`}
                  style={{ ...S.input, width: '150px' }}
                  required
                />
                <input
                  type="text"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  placeholder="Nota opcional (ej: Semana 1, buenas sensaciones)"
                  style={{ ...S.input, flex: 1, minWidth: '180px' }}
                />
                <button type="submit" style={S.btnPrimary}>
                  + Anotar
                </button>
              </form>

              {bodyWeights.filter(w => w.user === profileUser).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {bodyWeights.filter(w => w.user === profileUser).map(w => (
                    <div
                      key={w.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.45rem 0.7rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#0f172a' }}>{w.weightKg} kg</strong>
                        <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.74rem' }}>{w.date}</span>
                        {w.note && <span style={{ color: '#475569', marginLeft: '0.5rem' }}>· {w.note}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await fetch(`/api/gym/weights/${w.id}`, { method: 'DELETE' });
                          if (res.ok) {
                            const d = await res.json();
                            setBodyWeights(d.bodyWeights || []);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR PROPIA DE LA APP DE GIMNASIO (5 PESTAÑAS) */}
      <nav style={S.bottomNav} aria-label="Menú de Marbella Fit">
        {[
          { id: 'dashboard', icon: '🏠', label: 'Inicio' },
          { id: 'train', icon: '🏋️', label: 'Entrenar' },
          { id: 'routines', icon: '🎯', label: 'Rutinas IA' },
          { id: 'machines', icon: '🏢', label: 'Máquinas' },
          { id: 'profile', icon: '👤', label: 'Objetivos' }
        ].map((tab) => {
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
                padding: '0.25rem 0',
                cursor: 'pointer',
                color: isAct ? '#059669' : '#64748b',
                fontWeight: isAct ? 800 : 600,
                fontSize: '0.7rem'
              }}
            >
              <span style={{
                fontSize: '1.2rem',
                background: isAct ? '#ecfdf5' : 'transparent',
                padding: '0.15rem 0.65rem',
                borderRadius: '999px',
                transition: 'all 0.15s'
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
