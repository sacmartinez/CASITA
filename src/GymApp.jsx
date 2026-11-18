import React, { useState, useEffect, useRef } from 'react';
import ExerciseVisualModal from './components/ExerciseVisualModal';
import GymSocialShareModal from './components/GymSocialShareModal';
import GymCoopArena from './components/GymCoopArena';

const GOAL_OPTIONS = [
  {
    id: 'brazos_abs_grasa',
    icon: '🔥💪🍫',
    label: 'Perder Peso + Muscular Brazos y Tableta de Chocolate (Duro)',
    shortLabel: 'Brazos + Tableta + Quema Grasa',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    kcalTarget: { Ismael: 1950, Sandra: 1650 },
    desc: 'Entrenamiento intenso para quemar grasa, ganar volumen en bíceps/tríceps/hombros y marcar abdominales.'
  },
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

// ============================================================================
// PLAN PRIVADO DURO DE ISMAEL: PERDER PESO + MUSCULAR BRAZOS + TABLETA ABS
// ============================================================================
const GYM_DAYS_ISMAEL = [
  {
    id: 'dia-1',
    dayNumber: 1,
    shortTab: 'Día 1: Torso + Brazos + Abs',
    title: '🔥💪 Día 1: Pecho, Espalda, Bombeo de Brazos + Tableta + Cardio',
    subtitle: 'Entreno duro de torso superior, bíceps/tríceps, abdomen con peso y quema de grasa',
    duration: 55,
    exercises: [
      { name: 'Press de Pecho Sentado', machine: 'Máquina de Pecho', sets: 4, baseReps: 12, baseKg: { Ismael: 30, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Hombros atrás pegados al respaldo. Empuja potente y baja en 2 segundos.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Polea Alta (Espalda en V)', sets: 4, baseReps: 12, baseKg: { Ismael: 35, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Ensancha la espalda para que la cintura se vea más estrecha.' },
      { name: 'Curl de Bíceps en Polea Baja o Mancuernas', machine: 'Polea Baja / Mancuernas', sets: 4, baseReps: 12, baseKg: { Ismael: 12, Sandra: 5 }, stepKg: 2, isCardio: false, tip: 'Aprieta fuerte el bíceps 1 segundo arriba en cada repetición.' },
      { name: 'Extensión de Tríceps con Cuerda en Polea', machine: 'Estación de Poleas', sets: 4, baseReps: 12, baseKg: { Ismael: 17.5, Sandra: 7.5 }, stepKg: 2.5, isCardio: false, tip: 'El tríceps da el 60% del tamaño del brazo: abre la cuerda abajo del todo.' },
      { name: 'Crunch Abdominal con Peso en Polea / Máquina', machine: 'Polea Alta / Máquina Abs', sets: 4, baseReps: 15, baseKg: { Ismael: 25, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Encoge las costillas hacia la pelvis soltando todo el aire para sacar los cuadritos.' },
      { name: 'Plancha Abdominal Dura (Core de Acero)', machine: 'Zona Colchonetas', sets: 3, baseReps: '45 seg', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Aprieta abdomen y glúteos al máximo sin hundir la cadera.' },
      { name: 'Cardio Quema-Grasa (Elíptica / Cinta / Bici)', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '21 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.3, baseKcal: 120, baseLevel: 6, tip: 'Supera la distancia o calorías de tu última pantalla (Nivel 6+).' }
    ]
  },
  {
    id: 'dia-2',
    dayNumber: 2,
    shortTab: 'Día 2: Pierna + Tableta Abs',
    title: '🍫🦵 Día 2: Pierna Potente (Quema-Grasa) + Circuito Tableta de Chocolate',
    subtitle: 'Entrenar pierna dispara la testosterona y quema de grasa + ataque total al abdomen',
    duration: 55,
    exercises: [
      { name: 'Prensa de Piernas', machine: 'Máquina de Prensa (Placas)', sets: 4, baseReps: 12, baseKg: { Ismael: 60, Sandra: 30 }, stepKg: 5, isCardio: false, tip: 'Pies a la anchura de los hombros. Empuja fuerte desde los talones.' },
      { name: 'Extensión de Cuádriceps Sentado', machine: 'Máquina Cuádriceps', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Aguanta 1 segundo arriba apretando el muslo.' },
      { name: 'Curl Femoral (Parte trasera muslo)', machine: 'Máquina Femoral', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Controla la bajada en 2 segundos sin dar tirones.' },
      { name: 'Elevación de Piernas / Rodillas al Pecho (Abdomen Inferior)', machine: 'Silla Romana / Colchoneta', sets: 4, baseReps: '15 reps', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Sube las rodillas hacia el pecho levantando un pelín la pelvis para atacar la barriga baja.' },
      { name: 'Crunch Abdominal + Oblicuos Alternos', machine: 'Zona Colchonetas', sets: 4, baseReps: '20 reps', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Lleva el codo hacia la rodilla contraria apretando la cintura.' },
      { name: 'Bicicleta Elíptica / Cinta Quema-Grasa', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '21 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.3, baseKcal: 120, baseLevel: 6, tip: 'Ritmo alto constante para vaciar depósitos de grasa.' }
    ]
  },
  {
    id: 'dia-3',
    dayNumber: 3,
    shortTab: 'Día 3: Especial Brazos + Hombro',
    title: '💥💪 Día 3: Especial Hombros y Brazos Grandes (Bíceps/Tríceps) + Six-Pack',
    subtitle: 'Día clave para hinchar brazos, ensanchar hombros y esculpir el abdomen',
    duration: 55,
    exercises: [
      { name: 'Press de Hombros en Máquina', machine: 'Máquina de Hombros', sets: 4, baseReps: 12, baseKg: { Ismael: 20, Sandra: 7.5 }, stepKg: 2.5, isCardio: false, tip: 'Hombros redondos y fuertes. Empuja sin arquear la espalda.' },
      { name: 'Remo Sentado en Polea Baja', machine: 'Polea Baja (Gironda)', sets: 3, baseReps: 12, baseKg: { Ismael: 35, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Tira hacia el abdomen sacando pecho; activa espalda y bíceps.' },
      { name: 'Contractora Pectoral (Mariposa)', machine: 'Máquina Pec Deck', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Aprieta 1 segundo juntando los brazos delante del pecho.' },
      { name: 'Curl de Bíceps Martillo con Mancuernas (Brazo Ancho)', machine: 'Zona Mancuernas', sets: 4, baseReps: 12, baseKg: { Ismael: 12, Sandra: 5 }, stepKg: 2, isCardio: false, tip: 'Palmas mirándose entre sí: da grosor al bíceps y al antebrazo.' },
      { name: 'Extensión de Tríceps en Polea Alta (Barra o Cuerda)', machine: 'Estación de Poleas', sets: 4, baseReps: 12, baseKg: { Ismael: 20, Sandra: 7.5 }, stepKg: 2.5, isCardio: false, tip: 'Codos clavados a las costillas, estira el brazo a tope abajo.' },
      { name: 'Crunch Abdominal con Peso + Plancha Final', machine: 'Polea / Colchoneta', sets: 3, baseReps: '45 seg', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: '15 crunches seguidos de 45 segundos de plancha isométrica.' },
      { name: 'Cardio Final en Cinta Inclinada o Elíptica', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '21 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.3, baseKcal: 120, baseLevel: 6, tip: 'Apunta los Km y Calorías de la pantalla al terminar.' }
    ]
  },
  {
    id: 'dia-4',
    dayNumber: 4,
    shortTab: 'Día 4: Quema-Grasa + Abs + TRX',
    title: '🔥🍫 Día 4: Circuito Metabólico Duro (Abdomen + Brazos TRX + Cardio)',
    subtitle: 'Máxima definición abdominal, congestión de brazos y gran gasto calórico',
    duration: 50,
    exercises: [
      { name: 'Bloque 1: Cardio Potente en Cinta o Elíptica', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.3, baseKcal: 120, baseLevel: 6, tip: 'Calienta 2 min y mete ritmo fuerte en nivel 6 o superior.' },
      { name: 'Bloque 2: Remo + Curl de Bíceps y Flexiones en TRX', machine: 'Zona Funcional TRX', sets: 4, baseReps: '12 + 12', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Usa tu propio peso en las correas TRX para congestionar brazos y pecho.' },
      { name: 'Bloque 3: Triserie Tableta de Chocolate (Superior + Inferior + Plancha)', machine: 'Zona Colchonetas / Silla Romana', sets: 4, baseReps: '45 seg', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: '15 elevaciones de piernas + 15 crunches + 45s de plancha sin descanso.' },
      { name: 'Bloque 4: Remate Cardio Quema-Grasa', machine: 'Elíptica / Bici (Pantalla)', sets: 1, baseReps: '15 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 2.5, baseKcal: 95, baseLevel: 6, tip: 'Último empujón para salir del gym habiendo quemado al máximo.' }
    ]
  }
];

// ============================================================================
// PLAN DE SANDRA: TONIFICAR, PIERNA/GLÚTEO, CUERPO FIRME Y CARDIO
// ============================================================================
const GYM_DAYS_SANDRA = [
  {
    id: 'dia-1',
    dayNumber: 1,
    shortTab: 'Día 1: Cuerpo Completo',
    title: '🔥 Día 1: Full Body + Cardio (Casita Gym)',
    subtitle: 'Activa piernas, espalda, pecho y remata quemando calorías',
    duration: 50,
    exercises: [
      { name: 'Prensa de Piernas', machine: 'Máquina de Prensa (Placas)', sets: 3, baseReps: 12, baseKg: { Ismael: 45, Sandra: 25 }, stepKg: 5, isCardio: false, tip: 'Pies a la anchura de los hombros. Empuja con los talones sin bloquear rodillas.' },
      { name: 'Jalón al Pecho en Polea Alta', machine: 'Polea Alta (Espalda)', sets: 3, baseReps: 12, baseKg: { Ismael: 30, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Saca pecho y baja la barra hasta la clavícula tirando con los codos.' },
      { name: 'Press de Pecho Sentado', machine: 'Máquina de Pecho', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 10 }, stepKg: 2.5, isCardio: false, tip: 'Hombros atrás pegados al respaldo al empujar.' },
      { name: 'Plancha Abdominal en Colchoneta', machine: 'Zona Colchonetas', sets: 3, baseReps: '35 seg', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Aprieta abdomen y glúteo manteniendo el cuerpo recto.' },
      { name: 'Cinta Inclinada o Elíptica', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.0, baseKcal: 110, baseLevel: 5, tip: 'Cinta con pendiente o Elíptica a ritmo constante.' }
    ]
  },
  {
    id: 'dia-2',
    dayNumber: 2,
    shortTab: 'Día 2: Pierna y Glúteo',
    title: '🍑 Día 2: Pierna, Glúteo y Abdomen + Elíptica',
    subtitle: 'Trabaja tren inferior, glúteos firmes y cintura',
    duration: 50,
    exercises: [
      { name: 'Prensa de Piernas (Pies altos para Glúteo)', machine: 'Máquina de Prensa', sets: 3, baseReps: 12, baseKg: { Ismael: 50, Sandra: 30 }, stepKg: 5, isCardio: false, tip: 'Apoya los pies un poco más arriba para activar más el glúteo.' },
      { name: 'Curl Femoral (Parte trasera muslo)', machine: 'Máquina Femoral', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Controla la vuelta del peso en 2 segundos sin dar tirones.' },
      { name: 'Extensión de Cuádriceps Sentado', machine: 'Máquina Cuádriceps', sets: 3, baseReps: 12, baseKg: { Ismael: 25, Sandra: 15 }, stepKg: 2.5, isCardio: false, tip: 'Aguanta 1 segundo arriba apretando el muslo.' },
      { name: 'Máquina de Abductores (Abrir piernas)', machine: 'Máquina Abductores', sets: 3, baseReps: 15, baseKg: { Ismael: 35, Sandra: 25 }, stepKg: 2.5, isCardio: false, tip: 'Abre con control y aguanta 1 segundo.' },
      { name: 'Puente de Glúteo + Abdominales', machine: 'Zona Colchonetas', sets: 3, baseReps: '15 reps', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Tumbado boca arriba, sube la cadera apretando glúteo.' },
      { name: 'Bicicleta Elíptica Sin Impacto', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.1, baseKcal: 115, baseLevel: 5, tip: 'Ritmo continuo moviendo también los brazos.' }
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
      { name: 'Caminata Inclinada o Elíptica', machine: 'Zona Cardio (Pantalla)', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.1, baseKcal: 115, baseLevel: 5, tip: '20 minutos finales para rematar el gasto calórico.' }
    ]
  },
  {
    id: 'dia-4',
    dayNumber: 4,
    shortTab: 'Día 4: Cardio / Clase',
    title: '🚴 Día 4: Quema-Calorías (Circuito o Clase de Cardio)',
    subtitle: 'Spinning, Zumba, TRX o Circuito de Cardio para sudar y disfrutar',
    duration: 45,
    exercises: [
      { name: 'Bloque 1: Cinta con Inclinación', machine: 'Zona Cardio - Cinta', sets: 1, baseReps: '15 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 2.2, baseKcal: 90, baseLevel: 5, tip: 'Pendiente entre 5% y 8% a paso ligero.' },
      { name: 'Bloque 2: Remo y Sentadilla en TRX + Abdomen', machine: 'Zona Funcional TRX', sets: 3, baseReps: '12 + 12', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: false, tip: 'Usa las cuerdas TRX para hacer 12 sentadillas y 12 remos seguidos.' },
      { name: 'Bloque 3: Elíptica o Clase Colectiva', machine: 'Elíptica / Sala Clases', sets: 1, baseReps: '20 min', baseKg: { Ismael: 0, Sandra: 0 }, stepKg: 0, isCardio: true, hasCardioScreen: true, baseKm: 3.2, baseKcal: 115, baseLevel: 6, tip: 'Alterna 2 minutos suaves con 1 minuto rápido.' }
    ]
  }
];

// Rutinas Express para hacer en CASA (Salón o Despacho) — Exclusivas del perfil de Ismael
const HOME_ROUTINES = [
  {
    id: 'casa-brazos-tableta',
    title: '🍫💪 Especial Duro Ismael: Brazos + Tableta de Chocolate (8 min)',
    place: 'Salón o Despacho · Foco Abdomen y Brazos',
    durationMin: 8,
    calories: 90,
    desc: 'Diseñada por Adán para tu objetivo privado: congestiona pecho/tríceps/brazos y ataca las 3 zonas del abdomen (superior, inferior y oblicuos).',
    exercises: [
      { name: 'Flexiones cerradas (Foco Tríceps y Pecho)', baseTarget: 12, unit: 'reps', scalePerLevel: 2, tip: 'Manos a la anchura de los hombros bajando con los codos pegados al cuerpo para hinchar el brazo.' },
      { name: 'Crunch Abdominal Superior (Apretando 1s arriba)', baseTarget: 20, unit: 'reps', scalePerLevel: 4, tip: 'Suelta todo el aire al subir clavando la zona lumbar en el suelo.' },
      { name: 'Elevación de Piernas tumbado (Abdomen Inferior)', baseTarget: 15, unit: 'reps', scalePerLevel: 3, tip: 'Manos debajo del glúteo, sube y baja las piernas sin que toquen el suelo.' },
      { name: 'Bicicleta Abdominal (Oblicuos y Cintura)', baseTarget: 24, unit: 'toques alternos', scalePerLevel: 4, tip: 'Lleva el codo a la rodilla contraria estirando bien la otra pierna.' },
      { name: 'Plancha Abdominal RKC (Máxima Tensión)', baseTarget: 45, unit: 'seg', scalePerLevel: 5, tip: 'Aprieta puños, abdomen y glúteos al 100% durante todo el cronómetro.' }
    ]
  },
  {
    id: 'casa-manana',
    title: '☀️ Antes del Curro: Despertar, Activar y Quemar (5 min)',
    place: 'Salón o Despacho · Sin sudar en exceso',
    durationMin: 6,
    calories: 55,
    desc: 'Ideal recién levantado o antes de salir a trabajar: activa el metabolismo, los brazos y el abdomen desde primera hora.',
    exercises: [
      { name: 'Sentadillas al aire (a ritmo fluido)', baseTarget: 15, unit: 'reps', scalePerLevel: 3, tip: 'Baja con la espalda recta empujando con los talones.' },
      { name: 'Flexiones de brazos', baseTarget: 12, unit: 'reps', scalePerLevel: 2, tip: 'Controla la bajada y empuja fuerte al subir.' },
      { name: 'Plancha Abdominal en alfombra/suelo', baseTarget: 35, unit: 'seg', scalePerLevel: 5, tip: 'Aprieta la tripa y el glúteo sin dejar caer la cadera.' },
      { name: 'Abdominales Crunch + Puente lumbar', baseTarget: 15, unit: 'reps', scalePerLevel: 3, tip: 'Activa el core y protege la espalda antes de ir al curro.' }
    ]
  },
  {
    id: 'casa-reto-flex-abs',
    title: '⚡ Reto Obligatorio Express: Flexiones + Tableta (4 min)',
    place: 'Cualquier rincón de casa · Cero excusas',
    durationMin: 4,
    calories: 50,
    desc: 'Para los días con cero tiempo: 2 bloques intensos seguidos de brazos y abdominales para no fallar jamás.',
    exercises: [
      { name: 'Bloque 1: Flexiones al fallo + Crunch Abdominal', baseTarget: 14, unit: 'reps de cada', scalePerLevel: 2, tip: 'Haz las flexiones y sin descansar pasa directo a los abdominales.' },
      { name: 'Bloque 2: Flexiones + Plancha isométrica', baseTarget: 40, unit: 'seg plancha (+12 flex)', scalePerLevel: 5, tip: '¡En 4 minutos has cumplido con tu objetivo!' }
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
  "👫 Entrenar en equipo multiplica las ganas por dos. ¡Hoy vais a salir del gym con una sonrisa enorme!",
  "💎 La disciplina es elegir entre lo que te apetece ahora mismo y lo que más quieres conseguir.",
  "✨ Cada gota de esfuerzo de hoy es energía, salud y confianza para mañana. ¡Tú puedes con esto y más!"
];

const USER_PINS = {
  Ismael: '280894',
  Sandra: '100415'
};

// Detecta si un ejercicio es por tiempo (segundos o minutos) y devuelve los segundos totales
function parseExerciseDurationSeconds(text = '') {
  const s = String(text).toLowerCase();
  // Buscar segundos explícitos: "35 seg", "30s", "40 segundos"
  const secMatch = s.match(/(\d+)\s*(seg|segundos|s\b)/i);
  if (secMatch) {
    return parseInt(secMatch[1], 10);
  }
  // Buscar minutos explícitos: "20 min", "15-20 min", "18 minutos"
  const minMatch = s.match(/(\d+)(?:\s*-\s*(\d+))?\s*(min|minutos)/i);
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    return mins * 60;
  }
  return null;
}

// Pitido suave al terminar el cronómetro sin requerir archivos externos
function playTimerFinishBeep() {
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 250]);
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.15);
    });
  } catch (_) {}
}

// Cronómetro integrado directamente dentro de la ficha de cualquier ejercicio por tiempo
function InlineExerciseTimer({ initialSeconds, sets = 1, onComplete }) {
  const [baseSeconds, setBaseSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  useEffect(() => {
    if (!running) {
      setBaseSeconds(initialSeconds);
      setSecondsLeft(initialSeconds);
      setFinished(false);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          setFinished(true);
          playTimerFinishBeep();
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const formatMMSS = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const step = baseSeconds >= 120 ? 60 : 5;
  const stepLabel = baseSeconds >= 120 ? '1m' : '5s';
  const pct = baseSeconds > 0 ? Math.round(((baseSeconds - secondsLeft) / baseSeconds) * 100) : 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        marginTop: '0.6rem',
        background: finished ? '#ecfdf5' : running ? '#eff6ff' : '#f8fafc',
        border: finished ? '2px solid #10b981' : running ? '2px solid #3b82f6' : '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '0.6rem 0.75rem',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            fontFamily: 'monospace',
            color: finished ? '#047857' : running ? '#1d4ed8' : '#0f172a',
            background: '#ffffff',
            padding: '0.2rem 0.55rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1'
          }}>
            ⏱️ {formatMMSS(secondsLeft)}
          </span>

          <div>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: finished ? '#047857' : '#334155' }}>
              {finished
                ? '🎉 ¡Tiempo completado!'
                : running
                ? '🔥 ¡Aguanta, tú puedes!'
                : 'Cronómetro del ejercicio'}
            </div>
            {sets > 1 && (
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>
                Serie {currentSet} de {sets}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          {/* Ajustar tiempo rápido */}
          {!running && (
            <>
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(5, baseSeconds - step);
                  setBaseSeconds(next);
                  setSecondsLeft(next);
                  setFinished(false);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.28rem 0.45rem',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                -{stepLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = baseSeconds + step;
                  setBaseSeconds(next);
                  setSecondsLeft(next);
                  setFinished(false);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.28rem 0.45rem',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                +{stepLabel}
              </button>
            </>
          )}

          {/* Botón Empezar / Pausar / Siguiente serie */}
          {finished && sets > 1 && currentSet < sets ? (
            <button
              type="button"
              onClick={() => {
                setCurrentSet(currentSet + 1);
                setSecondsLeft(baseSeconds);
                setFinished(false);
                setRunning(true);
              }}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9px',
                padding: '0.38rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ▶️ Empezar Serie {currentSet + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (finished || secondsLeft === 0) {
                  setSecondsLeft(baseSeconds);
                  setFinished(false);
                  setRunning(true);
                } else {
                  setRunning(!running);
                }
              }}
              style={{
                background: running ? '#f59e0b' : '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9px',
                padding: '0.38rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}
            >
              {running ? '⏸️ Pausar' : finished ? '🔄 Repetir' : '▶️ Empezar'}
            </button>
          )}

          {(running || secondsLeft !== baseSeconds) && (
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setFinished(false);
                setSecondsLeft(baseSeconds);
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                borderRadius: '9px',
                padding: '0.36rem 0.55rem',
                fontSize: '0.73rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              title="Reiniciar cronómetro"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Barra de progreso visual mientras corre */}
      {(running || finished) && (
        <div style={{ marginTop: '0.45rem', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: finished ? '#10b981' : '#3b82f6',
            transition: 'width 0.4s linear'
          }} />
        </div>
      )}
    </div>
  );
}

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

function GymApp({ onBackToCasita }) {
  const [unlockedUser, setUnlockedUser] = useState(() => {
    const activeHogarUser = localStorage.getItem('hogar_user') || 'Ismael';
    if (localStorage.getItem(`gym_unlocked_${activeHogarUser}`) === 'true') {
      return activeHogarUser;
    }
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
  const [serverInProgress, setServerInProgress] = useState({});
  const [goals, setGoals] = useState({
    Ismael: { goalType: 'brazos_abs_grasa', goalLabel: '🔥💪🍫 Perder Grasa + Brazos y Tableta de Chocolate', customFocus: '', level: 'Duro / Progresivo', targetDaysPerWeek: 4, targetWeightKg: null },
    Sandra: { goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo', targetDaysPerWeek: 3, targetWeightKg: null }
  });

  // Mantener la pantalla encendida (Screen Wake Lock API) para que no se bloquee en el gimnasio
  const [wakeLockActive, setWakeLockActive] = useState(false);

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
  const [editingCompletedToday, setEditingCompletedToday] = useState(false);
  const [analyzingCardioIdx, setAnalyzingCardioIdx] = useState(null);
  const [autoSaveFlash, setAutoSaveFlash] = useState('');
  const [stepByStepMode, setStepByStepMode] = useState(true);
  const [currentExerciseStep, setCurrentExerciseStep] = useState(0);

  const todayDateStr = getMadridDateStr(0);

  // Auto-posicionar al primer ejercicio a medias / pendiente
  const hasAutoPositionedRef = useRef(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareWorkoutData, setShareWorkoutData] = useState(null);
  const [coopSession, setCoopSession] = useState(null);
  const [showWorkoutTypeModal, setShowWorkoutTypeModal] = useState(false);

  const [workoutStartTime, setWorkoutStartTime] = useState(() => {
    try {
      const raw = localStorage.getItem(`casita_gym_session_${activeUser}_${todayDateStr}`);
      if (raw) return JSON.parse(raw).startTime || null;
    } catch (_) {}
    return null;
  });

  const [workoutStartTimestamp, setWorkoutStartTimestamp] = useState(() => {
    try {
      const raw = localStorage.getItem(`casita_gym_session_${activeUser}_${todayDateStr}`);
      if (raw) return JSON.parse(raw).startTimestamp || null;
    } catch (_) {}
    return null;
  });

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(() => {
    try {
      const raw = localStorage.getItem(`casita_gym_session_${activeUser}_${todayDateStr}`);
      if (raw) return !!JSON.parse(raw).active;
    } catch (_) {}
    return false;
  });

  // Consultar y sincronizar sesión Co-Op periódicamente
  const fetchCoopSession = async () => {
    try {
      const res = await fetch('/api/gym/coop');
      if (res.ok) {
        const data = await res.json();
        setCoopSession(data.coopSession || null);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchCoopSession();
    const interval = setInterval(fetchCoopSession, 2500);
    return () => clearInterval(interval);
  }, []);

  // Función para fusionar las rutinas del día de Ismael y Sandra en una rutina Co-Op compartida
  const buildCoopRoutineForDay = (dayPlan) => {
    const ismaelPlan = GYM_DAYS_ISMAEL.find(d => d.id === dayPlan.id) || GYM_DAYS_ISMAEL[0];
    const sandraPlan = GYM_DAYS_SANDRA.find(d => d.id === dayPlan.id) || GYM_DAYS_SANDRA[0];

    const merged = [];
    const seenMachines = new Set();

    (ismaelPlan.exercises || []).forEach((ex, idx) => {
      const sMatch = (sandraPlan.exercises || []).find(se =>
        se.machine.toLowerCase() === ex.machine.toLowerCase() ||
        se.name.toLowerCase().includes(ex.name.toLowerCase().split(' ')[0])
      );
      seenMachines.add(ex.machine.toLowerCase());
      merged.push({
        id: `coop-m-${idx}`,
        name: ex.name,
        machine: ex.machine,
        sets: Math.max(Number(ex.sets) || 3, Number(sMatch?.sets) || 3),
        tip: ex.tip || sMatch?.tip || 'Coordinad los descansos para no enfriaros.',
        isCardio: !!ex.isCardio,
        userConfigs: {
          Ismael: {
            weightKg: ex.baseKg?.Ismael ?? 30,
            reps: ex.baseReps ?? 12
          },
          Sandra: {
            weightKg: sMatch?.baseKg?.Sandra ?? ex.baseKg?.Sandra ?? 15,
            reps: sMatch?.baseReps ?? ex.baseReps ?? 12
          }
        }
      });
    });

    (sandraPlan.exercises || []).forEach((se, idx) => {
      if (!seenMachines.has(se.machine.toLowerCase())) {
        seenMachines.add(se.machine.toLowerCase());
        merged.push({
          id: `coop-s-${idx}`,
          name: se.name,
          machine: se.machine,
          sets: Number(se.sets) || 3,
          tip: se.tip || 'Ajustad el peso en cada turno.',
          isCardio: !!se.isCardio,
          userConfigs: {
            Ismael: {
              weightKg: se.baseKg?.Ismael ?? 30,
              reps: se.baseReps ?? 12
            },
            Sandra: {
              weightKg: se.baseKg?.Sandra ?? 15,
              reps: se.baseReps ?? 12
            }
          }
        });
      }
    });

    return merged;
  };

  const proceedStartWorkoutSolo = () => {
    const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const nowTs = Date.now();
    setWorkoutStartTime(nowStr);
    setWorkoutStartTimestamp(nowTs);
    setIsWorkoutStarted(true);
    try {
      localStorage.setItem(
        `casita_gym_session_${activeUser}_${todayDateStr}`,
        JSON.stringify({ startTime: nowStr, startTimestamp: nowTs, active: true })
      );
    } catch (_) {}
  };

  const handleStartWorkout = () => {
    setShowWorkoutTypeModal(true);
  };

  const handleStartCoopWorkout = async () => {
    try {
      const dayPlan = activeGymDays[selectedDayIdx] || activeGymDays[0];
      const mergedExercises = buildCoopRoutineForDay(dayPlan);
      const res = await fetch('/api/gym/coop/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: activeUser,
          dayId: dayPlan.id,
          routineName: `🔥 ${dayPlan.shortTab || 'Entrenamiento'} Co-Op`,
          exercises: mergedExercises
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoopSession(data.coopSession);
        setShowWorkoutTypeModal(false);
      }
    } catch (e) {
      console.error('Error starting coop:', e);
    }
  };

  // Estado de Pestaña 2: EN CASA (Salón / Despacho) — Guardado persistente por rutina
  const [selectedHomeIdx, setSelectedHomeIdx] = useState(0);
  const [homeCheckedByRoutine, setHomeCheckedByRoutine] = useState(() => {
    try {
      const todayKey = getMadridDateStr(0);
      const u = localStorage.getItem('marbella_fit_unlocked_user') || 'Ismael';
      const raw = localStorage.getItem(`marbella_fit_home_checked_${u}_${todayKey}`);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });
  const [savingHome, setSavingHome] = useState(false);
  const [homeSavedBanner, setHomeSavedBanner] = useState('');

  // Estado de Pestaña Calendario Positivo / Negativo (Gym + Casa)
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => getMadridDateStr(0));

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
  const [visualModalItem, setVisualModalItem] = useState(null);

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const activeGymDays = activeUser === 'Ismael' ? GYM_DAYS_ISMAEL : GYM_DAYS_SANDRA;

  // Screen Wake Lock: evita que el móvil apague/bloquee la pantalla mientras estás en Marbella Fit
  useEffect(() => {
    let wakeLockSentinel = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          wakeLockSentinel = await navigator.wakeLock.request('screen');
          setWakeLockActive(true);
          wakeLockSentinel.addEventListener('release', () => {
            setWakeLockActive(false);
          });
        }
      } catch (_) {
        setWakeLockActive(false);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    const handleUserInteraction = () => {
      if (!wakeLockSentinel && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [unlockedUser]);

  useEffect(() => {
    document.title = 'Casita Gym · Adán Entrenador';
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
        if (data.inProgress) setServerInProgress(data.inProgress);
        if (data.goals) setGoals(data.goals);
        if (data.coopSession !== undefined) setCoopSession(data.coopSession);
      }
    } catch (e) {
      console.error('Error cargando Casita Gym:', e);
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
  // LÓGICA DE PROGRESIÓN POR CADA MÁQUINA Y CARDIO CON TU ENTRENADOR ADÁN
  // ============================================================================
  const getSmartProgressionForExercise = (user, exTemplate) => {
    const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const targetName = norm(exTemplate.name);

    // Buscar la última vez (en días anteriores) que este usuario hizo esta máquina
    for (const w of workouts) {
      if (w.user !== user) continue;
      if (w.date === todayDateStr && !editingCompletedToday) continue;
      for (const loggedEx of (w.exercises || [])) {
        if (loggedEx.completed === false) continue;
        const loggedNorm = norm(loggedEx.name);
        const isBothCardioScreen = exTemplate.hasCardioScreen && (loggedEx.distanceKm || loggedEx.caloriesKcal || loggedNorm.includes('cardio') || loggedNorm.includes('eliptica') || loggedNorm.includes('cinta'));

        if (loggedNorm === targetName || (targetName && loggedNorm.includes(targetName.slice(0, 10))) || isBothCardioScreen) {
          const lastKg = Number(loggedEx.weightKg) || 0;
          const lastRepsNum = parseInt(String(loggedEx.reps), 10) || 12;
          const decision = loggedEx.nextAction || (w.feeling === '😅 Costó bastante' ? 'mantener' : 'mejorar');

          // Progresión específica para máquinas de Cardio con pantalla (Distancia Km, Calorías, Nivel, Pulso)
          if (exTemplate.hasCardioScreen) {
            const lastKm = Number(loggedEx.distanceKm) || exTemplate.baseKm || 3.28;
            const lastKcal = Number(loggedEx.caloriesKcal) || exTemplate.baseKcal || 115;
            const lastLevel = Number(loggedEx.levelMax) || exTemplate.baseLevel || 6;

            if (decision === 'mejorar') {
              const targetKm = Number((lastKm + 0.2).toFixed(2));
              const targetKcal = Math.round(lastKcal + 12);
              return {
                weightKg: 0,
                reps: loggedEx.reps || exTemplate.baseReps,
                distanceKm: targetKm,
                caloriesKcal: targetKcal,
                levelMax: lastLevel,
                badge: `🚀 Reto Cardio de Adán hoy: Superar ${targetKm} Km o ~${targetKcal} kcal en Nivel ${lastLevel}+ (Última vez: ${lastKm} Km · ${lastKcal} kcal)`,
                isUpgraded: true,
                lastDecision: 'mejorar'
              };
            }
            if (decision === 'bajar') {
              const targetKm = Number(Math.max(1.5, lastKm - 0.25).toFixed(2));
              return {
                weightKg: 0,
                reps: String(exTemplate.baseReps),
                distanceKm: targetKm,
                caloriesKcal: Math.round(lastKcal * 0.9),
                levelMax: Math.max(3, lastLevel - 1),
                badge: `🌱 Adán: Hoy cardio suave de recuperación (${targetKm} Km · Nivel ${Math.max(3, lastLevel - 1)})`,
                isUpgraded: false,
                lastDecision: 'bajar'
              };
            }
            return {
              weightKg: 0,
              reps: loggedEx.reps || exTemplate.baseReps,
              distanceKm: lastKm,
              caloriesKcal: lastKcal,
              levelMax: lastLevel,
              badge: `⚖️ Objetivo Cardio de Adán hoy: Igualar ${lastKm} Km · ~${lastKcal} kcal en Nivel ${lastLevel}`,
              isUpgraded: false,
              lastDecision: 'mantener'
            };
          }

          if (exTemplate.isCardio || lastKg === 0) {
            if (decision === 'mejorar') {
              return {
                weightKg: 0,
                reps: loggedEx.reps || exTemplate.baseReps,
                badge: `🚀 Adán: Marcaste "Mejorar" la última vez (${loggedEx.reps || exTemplate.baseReps}) · ¡Hoy intenta sumar +5s o +2 reps!`,
                isUpgraded: true,
                lastDecision: 'mejorar'
              };
            }
            if (decision === 'bajar') {
              return {
                weightKg: 0,
                reps: String(exTemplate.baseReps),
                badge: `🌱 Adán: Marcaste "Suavizar" la última vez · Haz ${exTemplate.baseReps} a ritmo cómodo`,
                isUpgraded: false,
                lastDecision: 'bajar'
              };
            }
            return {
              weightKg: 0,
              reps: loggedEx.reps || exTemplate.baseReps,
              badge: `⚖️ Adán: Marcaste "Mantener" · Repetimos ${loggedEx.reps || exTemplate.baseReps}`,
              isUpgraded: false,
              lastDecision: 'mantener'
            };
          }

          // 1. Si en esta máquina marcaste MEJORAR / SUBIR:
          if (decision === 'mejorar') {
            if (lastRepsNum >= 14) {
              const nextKg = Number((lastKg + (exTemplate.stepKg || 2.5)).toFixed(1));
              return {
                weightKg: nextKg,
                reps: String(exTemplate.baseReps || 12),
                badge: `🚀 Adán: Marcaste "Mejorar" en esta máquina → Subimos a ${nextKg} kg (hiciste ${lastKg} kg × ${lastRepsNum})`,
                isUpgraded: true,
                lastDecision: 'mejorar'
              };
            } else {
              const nextReps = lastRepsNum + 2;
              return {
                weightKg: lastKg,
                reps: String(nextReps),
                badge: `🚀 Adán: Marcaste "Mejorar" aquí → Hoy toca ${lastKg} kg × ${nextReps} reps (+2 reps más que el último día)`,
                isUpgraded: true,
                lastDecision: 'mejorar'
              };
            }
          }

          // 2. Si en esta máquina marcaste BAJAR UN POCO:
          if (decision === 'bajar') {
            const lowerKg = Math.max(2.5, Number((lastKg - (exTemplate.stepKg || 2.5)).toFixed(1)));
            return {
              weightKg: lowerKg,
              reps: String(exTemplate.baseReps || 12),
              badge: `🌱 Adán: Marcaste "Bajar un poco" aquí → Bajamos a ${lowerKg} kg × ${exTemplate.baseReps || 12} reps para ir más cómodo`,
              isUpgraded: false,
              lastDecision: 'bajar'
            };
          }

          // 3. Si en esta máquina marcaste MANTENER:
          return {
            weightKg: lastKg,
            reps: String(lastRepsNum),
            badge: `⚖️ Adán: Marcaste "Mantener" en esta máquina → Repetimos ${lastKg} kg × ${lastRepsNum} reps`,
            isUpgraded: false,
            lastDecision: 'mantener'
          };
        }
      }
    }

    // Si es la primera vez que lo hace:
    if (exTemplate.hasCardioScreen) {
      const refKm = exTemplate.baseKm || 3.28;
      const refKcal = exTemplate.baseKcal || 115;
      const refLvl = exTemplate.baseLevel || 6;
      return {
        weightKg: 0,
        reps: String(exTemplate.baseReps),
        distanceKm: refKm,
        caloriesKcal: refKcal,
        levelMax: refLvl,
        badge: `🎯 Objetivo Cardio de Adán: ${exTemplate.baseReps} · ~${refKm} Km · ~${refKcal} kcal (Nivel ${refLvl})`,
        isUpgraded: false,
        lastDecision: 'mantener'
      };
    }

    const startKg = exTemplate.baseKg?.[user] ?? 20;
    return {
      weightKg: startKg,
      reps: String(exTemplate.baseReps),
      badge: startKg > 0 ? `🧑‍🏫 Adán · Peso inicial recomendado: ${startKg} kg` : `🧑‍🏫 Adán · Objetivo inicial: ${exTemplate.baseReps}`,
      isUpgraded: false,
      lastDecision: 'mantener'
    };
  };

  // Comprobar si hoy ya se ha completado y cerrado el entrenamiento de gimnasio
  const todayCompletedGymWorkout = workouts.find(
    w => w.user === activeUser && w.type !== 'home' && w.date === todayDateStr
  );

  // Detectar qué Día (1, 2, 3 o 4) le toca hoy al usuario:
  // - Si HOY ya completó un entreno, se queda fijo en ese mismo Día (NO salta al siguiente hasta mañana).
  // - Si tiene un borrador guardado de hoy, mantiene el día de ese borrador.
  // - Si su último entreno fue un día ANTERIOR a hoy, avanza automáticamente al siguiente día.
  useEffect(() => {
    const draftKey = `marbella_fit_inprogress_${activeUser}_${todayDateStr}`;
    try {
      const localDraftRaw = localStorage.getItem(draftKey);
      if (localDraftRaw) {
        const parsed = JSON.parse(localDraftRaw);
        if (parsed && typeof parsed.selectedDayIdx === 'number') {
          setSelectedDayIdx(parsed.selectedDayIdx);
          return;
        }
      }
    } catch (_) {}

    const srvDraft = serverInProgress[`${activeUser}_${todayDateStr}`];
    if (srvDraft && typeof srvDraft.selectedDayIdx === 'number') {
      setSelectedDayIdx(srvDraft.selectedDayIdx);
      return;
    }

    const userGymWorkouts = workouts.filter(w => w.user === activeUser && w.type !== 'home');
    if (userGymWorkouts.length > 0) {
      const last = userGymWorkouts[0];
      const lastIdx = activeGymDays.findIndex(d => d.id === last.routineId || last.routineName?.includes(`Día ${d.dayNumber}`));
      if (lastIdx !== -1) {
        if (last.date === todayDateStr) {
          // Si ya entrenó hoy, NO saltar al día siguiente hasta mañana
          setSelectedDayIdx(lastIdx);
        } else {
          // Si el último entreno fue ayer o antes, hoy toca el siguiente día
          const nextIdx = (lastIdx + 1) % activeGymDays.length;
          setSelectedDayIdx(nextIdx);
        }
      }
    }
  }, [workouts.length, activeUser, todayDateStr]);

  // Guardar instantáneamente el progreso de cada ejercicio en localStorage y en el servidor
  const saveDraftImmediately = (nextExercises, dayIdx = selectedDayIdx) => {
    setTodayExercises(nextExercises);
    const dayPlan = activeGymDays[dayIdx] || activeGymDays[0];
    const draftPayload = {
      routineId: dayPlan.id,
      selectedDayIdx: dayIdx,
      exercises: nextExercises,
      byRoutine: {
        [dayPlan.id]: nextExercises
      },
      updatedAt: new Date().toISOString()
    };
    const draftKey = `marbella_fit_inprogress_${activeUser}_${todayDateStr}`;
    const routineDraftKey = `marbella_fit_inprogress_${activeUser}_${dayPlan.id}_${todayDateStr}`;
    try {
      localStorage.setItem(draftKey, JSON.stringify(draftPayload));
      localStorage.setItem(routineDraftKey, JSON.stringify(draftPayload));
    } catch (_) {}

    setAutoSaveFlash('💾 Progreso guardado al instante');
    setTimeout(() => setAutoSaveFlash(''), 2000);

    fetch('/api/gym/inprogress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: activeUser,
        date: todayDateStr,
        stateObj: draftPayload
      })
    }).catch(() => {});

    // Si acaba de marcar como ✓ Hecho el último ejercicio que faltaba del día, autovalidar también la sesión completa
    if (nextExercises.length > 0 && nextExercises.every(ex => ex.completed) && !editingCompletedToday && !savingGym) {
      const cardioKcalSum = nextExercises
        .filter(ex => ex.completed && Number(ex.caloriesKcal) > 0)
        .reduce((acc, ex) => acc + Number(ex.caloriesKcal), 0);
      const strengthCount = nextExercises.filter(ex => ex.completed && !ex.hasCardioScreen).length;
      const totalBurned = cardioKcalSum > 0
        ? Math.round(cardioKcalSum + strengthCount * 42)
        : Math.round(dayPlan.duration * 8);

      fetch('/api/gym/workouts', {
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
            caloriesBurned: totalBurned,
            feeling,
            notes: gymNotes,
            exercises: nextExercises
          },
          together: trainTogether
        })
      })
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d && d.workouts) {
            setWorkouts(d.workouts);
            setGymSavedBanner('🎉 ¡Has marcado todos los ejercicios! Día de hoy validado y bloqueado automáticamente.');
            setTimeout(() => setGymSavedBanner(''), 6000);
          }
        })
        .catch(() => {});
    }
  };

  // Construir o restaurar los ejercicios de hoy (respetando el autoguardado si ya habías marcado ejercicios hoy)
  useEffect(() => {
    const dayPlan = activeGymDays[selectedDayIdx] || activeGymDays[0];

    // 1. Si está editando el entreno ya completado de hoy, cargar sus datos
    if (editingCompletedToday && todayCompletedGymWorkout && todayCompletedGymWorkout.routineId === dayPlan.id) {
      setTodayExercises(todayCompletedGymWorkout.exercises || []);
      return;
    }

    // 2. Si hay borrador autoguardado de hoy para este día en localStorage o en el servidor, restaurarlo sin resetear nada
    const routineDraftKey = `marbella_fit_inprogress_${activeUser}_${dayPlan.id}_${todayDateStr}`;
    const draftKey = `marbella_fit_inprogress_${activeUser}_${todayDateStr}`;
    try {
      const localRoutineRaw = localStorage.getItem(routineDraftKey);
      if (localRoutineRaw) {
        const parsed = JSON.parse(localRoutineRaw);
        if (parsed && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
          setTodayExercises(parsed.exercises);
          return;
        }
      }

      const localDraftRaw = localStorage.getItem(draftKey);
      if (localDraftRaw) {
        const parsed = JSON.parse(localDraftRaw);
        if (parsed) {
          if (parsed.byRoutine && Array.isArray(parsed.byRoutine[dayPlan.id]) && parsed.byRoutine[dayPlan.id].length > 0) {
            setTodayExercises(parsed.byRoutine[dayPlan.id]);
            return;
          }
          if (parsed.routineId === dayPlan.id && Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
            setTodayExercises(parsed.exercises);
            return;
          }
        }
      }
    } catch (_) {}

    const srvDraft = serverInProgress[`${activeUser}_${todayDateStr}`];
    if (srvDraft) {
      if (srvDraft.byRoutine && Array.isArray(srvDraft.byRoutine[dayPlan.id]) && srvDraft.byRoutine[dayPlan.id].length > 0) {
        setTodayExercises(srvDraft.byRoutine[dayPlan.id]);
        return;
      }
      if (srvDraft.routineId === dayPlan.id && Array.isArray(srvDraft.exercises) && srvDraft.exercises.length > 0) {
        setTodayExercises(srvDraft.exercises);
        return;
      }
    }

    // 3. Si aún no ha empezado este día hoy, construir con la progresión inteligente de Adán (empezando con completed: false para ir marcando según los haces)
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
        hasCardioScreen: !!ex.hasCardioScreen,
        distanceKm: prog.distanceKm ?? (ex.baseKm || ''),
        caloriesKcal: prog.caloriesKcal ?? (ex.baseKcal || ''),
        levelMax: prog.levelMax ?? (ex.baseLevel || ''),
        avgPulse: '',
        avgRpm: '',
        nextAction: 'mantener',
        completed: false // Se marca ✓ Hecho al terminar cada máquina y queda guardado al instante
      };
    });
    setTodayExercises(built);
  }, [selectedDayIdx, activeUser, workouts.length, editingCompletedToday]);

  // Analizar foto de la pantalla de Cardio con IA (extrae Tiempo, Km, Calorías, RPM, Pulso y Nivel)
  const handleAnalyzeCardioPhoto = async (idx, file) => {
    if (!file) return;
    setAnalyzingCardioIdx(idx);
    try {
      // Comprimir imagen en canvas para que suba rápido desde el gimnasio
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1100;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
              else { w = Math.round((w * maxDim) / h); h = maxDim; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          };
          img.onerror = reject;
          img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/gym/analyze-cardio-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      if (res.ok) {
        const data = await res.json();
        const cd = data.cardioData || {};
        const copy = [...todayExercises];
        if (cd.timeStr) copy[idx].reps = cd.timeStr;
        if (cd.distanceKm !== null && cd.distanceKm !== undefined) copy[idx].distanceKm = cd.distanceKm;
        if (cd.caloriesKcal !== null && cd.caloriesKcal !== undefined) copy[idx].caloriesKcal = cd.caloriesKcal;
        if (cd.levelMax !== null && cd.levelMax !== undefined) copy[idx].levelMax = cd.levelMax;
        if (cd.avgPulse !== null && cd.avgPulse !== undefined) copy[idx].avgPulse = cd.avgPulse;
        if (cd.avgRpm !== null && cd.avgRpm !== undefined) copy[idx].avgRpm = cd.avgRpm;
        copy[idx].completed = true;
        saveDraftImmediately(copy);
      }
    } catch (err) {
      console.error('Error leyendo pantalla de cardio:', err);
    } finally {
      setAnalyzingCardioIdx(null);
    }
  };

  // Guardar y cerrar el entreno completo de hoy en el gimnasio
  const handleSaveTodayGym = async (e) => {
    e.preventDefault();
    setSavingGym(true);
    setGymSavedBanner('');
    const dayPlan = activeGymDays[selectedDayIdx] || activeGymDays[0];

    // Si algún ejercicio se quedó sin marcar pero el usuario le da a Terminar Día, guardamos los marcados (o todos si no marcó ninguno)
    const anyMarked = todayExercises.some(ex => ex.completed);
    const finalExercises = todayExercises.map(ex => ({
      ...ex,
      completed: anyMarked ? ex.completed : true
    }));

    // Sumar calorías reales de máquinas de cardio + estimación de pesas
    const cardioKcalSum = finalExercises
      .filter(ex => ex.completed && Number(ex.caloriesKcal) > 0)
      .reduce((acc, ex) => acc + Number(ex.caloriesKcal), 0);
    const strengthCount = finalExercises.filter(ex => ex.completed && !ex.hasCardioScreen).length;
    const totalBurned = cardioKcalSum > 0
      ? Math.round(cardioKcalSum + strengthCount * 42)
      : Math.round(dayPlan.duration * 8);

    // Calcular hora de fin y tiempo total transcurrido
    const finishTimeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const calculatedElapsed = workoutStartTimestamp
      ? Math.max(1, Math.round((Date.now() - workoutStartTimestamp) / 60000))
      : (dayPlan.duration || 60);

    const savedWorkoutObj = {
      user: activeUser,
      type: 'gym',
      routineId: dayPlan.id,
      date: todayDateStr,
      routineName: dayPlan.title,
      startTime: workoutStartTime || '18:30',
      endTime: finishTimeStr,
      durationMin: calculatedElapsed,
      caloriesBurned: totalBurned,
      feeling,
      notes: gymNotes,
      exercises: finalExercises
    };

    try {
      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: savedWorkoutObj,
          together: trainTogether
        })
      });
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.removeItem(`marbella_fit_inprogress_${activeUser}_${todayDateStr}`);
          localStorage.removeItem(`casita_gym_session_${activeUser}_${todayDateStr}`);
        } catch (_) {}
        setEditingCompletedToday(false);
        setIsWorkoutStarted(false);
        setWorkouts(data.workouts || []);
        setGymNotes('');
        setGymSavedBanner('🎉 ¡Entreno de hoy completado y bloqueado hasta mañana!');
        setTimeout(() => setGymSavedBanner(''), 6000);
        // Preparar tarjeta para compartir en redes
        setShareWorkoutData(savedWorkoutObj);
        setShowShareModal(true);
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

  // Comprobar si una rutina concreta de casa ya está validada en una fecha (por defecto hoy)
  const getValidatedHomeWorkout = (routineObj, dateStr = todayDateStr) => {
    if (!routineObj) return null;
    return userHomeWorkouts.find(
      w => w.date === dateStr && (w.routineId === routineObj.id || w.routineName === routineObj.title)
    );
  };

  // Validar y guardar una rutina de Casa en el servidor (al pulsar el botón o automáticamente al marcar todos sus ejercicios)
  const handleCompleteHomeWorkout = async (customRoutine = null, customDate = todayDateStr) => {
    const routine = customRoutine || HOME_ROUTINES[selectedHomeIdx] || HOME_ROUTINES[0];
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
            date: customDate,
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
        // Dejar todos los ejercicios de esta rutina marcados como hechos hoy
        const allTrue = {};
        routine.exercises.forEach((_, i) => { allTrue[i] = true; });
        const nextMap = { ...homeCheckedByRoutine, [routine.id]: allTrue };
        setHomeCheckedByRoutine(nextMap);
        try {
          localStorage.setItem(`marbella_fit_home_checked_${activeUser}_${customDate}`, JSON.stringify(nextMap));
        } catch (_) {}
        setHomeSavedBanner(`✅ ¡Validado! "${routine.title}" guardado en tu Calendario Positivo (${customDate}).`);
        setTimeout(() => setHomeSavedBanner(''), 6000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingHome(false);
    }
  };

  // Marcar un ejercicio individual en Casa (guarda al instante y si completas todos los de la rutina, la valida automáticamente)
  const toggleHomeExerciseCheck = (routine, idx, forceTrue = false) => {
    const currentMap = homeCheckedByRoutine[routine.id] || {};
    const alreadyValidated = !!getValidatedHomeWorkout(routine, todayDateStr);
    const currentVal = alreadyValidated ? true : !!currentMap[idx];
    const nextVal = forceTrue ? true : !currentVal;
    const updatedRoutineMap = { ...currentMap };
    if (alreadyValidated) {
      routine.exercises.forEach((_, i) => { updatedRoutineMap[i] = true; });
    }
    updatedRoutineMap[idx] = nextVal;

    const nextAll = { ...homeCheckedByRoutine, [routine.id]: updatedRoutineMap };
    setHomeCheckedByRoutine(nextAll);
    try {
      localStorage.setItem(`marbella_fit_home_checked_${activeUser}_${todayDateStr}`, JSON.stringify(nextAll));
    } catch (_) {}

    // Sincronizar inmediatamente al servidor para que NUNCA se pierda nada
    fetch('/api/gym/inprogress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: activeUser,
        date: todayDateStr,
        stateObj: {
          homeCheckedByRoutine: nextAll
        }
      })
    }).catch(() => {});

    // Si todos los ejercicios de la rutina están marcados ✓ y aún no estaba validada hoy, validarla sola al instante
    const allDoneNow = routine.exercises.every((_, i) => !!updatedRoutineMap[i]);
    if (allDoneNow && !alreadyValidated && !savingHome) {
      handleCompleteHomeWorkout(routine, todayDateStr);
    }
  };

  // Restaurar marcas de casa desde el servidor si estaban guardadas
  useEffect(() => {
    const srvDraft = serverInProgress[`${activeUser}_${todayDateStr}`];
    if (srvDraft && srvDraft.homeCheckedByRoutine) {
      setHomeCheckedByRoutine(prev => {
        const merged = { ...srvDraft.homeCheckedByRoutine, ...prev };
        try {
          localStorage.setItem(`marbella_fit_home_checked_${activeUser}_${todayDateStr}`, JSON.stringify(merged));
        } catch (_) {}
        return merged;
      });
    }
  }, [serverInProgress, activeUser, todayDateStr]);

  // Validar rápidamente un día de Gimnasio en cualquier fecha (ej. desde el Calendario o con 1 toque)
  const handleQuickValidateGymDay = async (dayPlan, targetDate = todayDateStr) => {
    if (!dayPlan) return;
    setSavingGym(true);
    try {
      const builtEx = dayPlan.exercises.map(ex => {
        const prog = getSmartProgressionForExercise(activeUser, ex);
        return {
          name: ex.name,
          machine: ex.machine,
          sets: ex.sets,
          reps: prog.reps,
          weightKg: prog.weightKg,
          isCardio: !!ex.isCardio,
          distanceKm: prog.distanceKm || ex.baseKm || null,
          caloriesKcal: prog.caloriesKcal || ex.baseKcal || null,
          levelMax: prog.levelMax || ex.baseLevel || null,
          nextAction: 'mejorar',
          completed: true
        };
      });
      const res = await fetch('/api/gym/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: {
            user: activeUser,
            type: 'gym',
            routineId: dayPlan.id,
            date: targetDate,
            routineName: dayPlan.title,
            durationMin: dayPlan.duration,
            caloriesBurned: Math.round(dayPlan.duration * 7.5),
            feeling: '💪 Muy bien',
            notes: `Validado (${targetDate})`,
            exercises: builtEx
          },
          together: false
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data.workouts || []);
        setGymSavedBanner(`✅ ¡${dayPlan.shortTab} validado en el fecha ${targetDate}!`);
        setTimeout(() => setGymSavedBanner(''), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingGym(false);
    }
  };

  // ============================================================================
  // DATOS PARA EL CALENDARIO POSITIVO (✅) / NEGATIVO (❌) DE GYM Y CASA
  // ============================================================================
  const userAllWorkouts = workouts.filter(w => w.user === activeUser);
  const earliestUserDate = userAllWorkouts.length > 0
    ? userAllWorkouts.reduce((min, w) => (w.date && w.date < min ? w.date : min), todayDateStr)
    : todayDateStr;

  const getDayCalendarStatus = (dateStr) => {
    const dayWorkouts = userAllWorkouts.filter(w => w.date === dateStr);
    const gymList = dayWorkouts.filter(w => w.type !== 'home');
    const homeList = dayWorkouts.filter(w => w.type === 'home');
    const hasGym = gymList.length > 0;
    const hasHome = homeList.length > 0;
    const isPositive = hasGym || hasHome;
    const isFuture = dateStr > todayDateStr;
    const isBeforeStart = dateStr < earliestUserDate && dateStr < '2026-11-15';
    const isToday = dateStr === todayDateStr;
    // Un día es Negativo (❌) si ya ha pasado (o es hoy sin entreno aún) desde que empezaste y no hiciste ni Gym ni Casa
    const isNegative = !isPositive && !isFuture && !isBeforeStart && !isToday;
    return { dateStr, dayWorkouts, gymList, homeList, hasGym, hasHome, isPositive, isNegative, isFuture, isToday, isBeforeStart };
  };

  // Construir los 7 días de la semana actual (Lunes a Domingo) para la tira superior
  const getCurrentWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 Dom, 1 Lun ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return labels.map((lbl, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${dayNum}`;
      return {
        shortDay: lbl,
        dayNumber: d.getDate(),
        ...getDayCalendarStatus(dStr)
      };
    });
  };
  const currentWeekDays = getCurrentWeekDays();

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
      localStorage.setItem(`gym_unlocked_${loginTargetUser}`, 'true');
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

  const currentGymDay = activeGymDays[selectedDayIdx] || activeGymDays[0];
  const currentHomeRoutine = HOME_ROUTINES[selectedHomeIdx] || HOME_ROUTINES[0];

  const visibleTabs = activeUser === 'Ismael'
    ? [
        { id: 'gym', icon: '🏋️', label: 'Gym' },
        { id: 'home', icon: '🏠', label: 'En Casa' },
        { id: 'calendar', icon: '📅', label: 'Calendario' },
        { id: 'nutrition', icon: '🍎', label: 'Comida/Peso' },
        { id: 'machines', icon: '🏢', label: 'Máquinas' }
      ]
    : [
        { id: 'gym', icon: '🏋️', label: 'Hoy (Gym)' },
        { id: 'calendar', icon: '📅', label: 'Calendario' },
        { id: 'nutrition', icon: '🍎', label: 'Comida y Peso' },
        { id: 'machines', icon: '🏢', label: 'Máquinas' }
      ];

  // Si aún no ha iniciado sesión con su contraseña individual, mostrar pantalla de acceso
  if (!unlockedUser) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.2rem' }}>
        <div style={{ ...S.card, maxWidth: '400px', width: '100%', padding: '1.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: '0.3rem' }}>🏋️</div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
            Casita Gym · Entrenador Adán
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
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '0.4rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>‹</span>
                <span>Volver a CasitaOS</span>
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  borderRadius: '999px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>‹</span>
                <span>Inicio</span>
              </button>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 900, fontSize: '1.02rem', color: '#0f172a' }}>
                  {activeUser === 'Ismael' ? '👦 Gym de Ismael' : '👧 Gym de Sandra'}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    background: wakeLockActive ? '#ecfdf5' : '#f1f5f9',
                    color: wakeLockActive ? '#059669' : '#64748b',
                    border: `1px solid ${wakeLockActive ? '#6ee7b7' : '#cbd5e1'}`,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px'
                  }}
                  title="La pantalla no se bloqueará mientras estás entrenando"
                >
                  {wakeLockActive ? '🔆 Sin bloqueo' : '🔆 Pantalla activa'}
                </span>
                {autoSaveFlash && (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #93c5fd',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px'
                  }}>
                    💾 Guardado
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                🧑‍🏫 Entrenador Adán · {activeGoalObj.icon} {activeGoalObj.shortLabel}
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

        {/* Tarjeta de Frase Motivadora de Adán antes de entrenar (Visible en Gym y En Casa) */}
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
                🧑‍🏫 Adán te dice hoy, {activeUser}:
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
              title="Ver otra frase motivadora de Adán"
            >
              ✨ Otra frase
            </button>
          </div>
        )}

        {/* TIRA SEMANAL DE DÍAS POSITIVOS (✅) Y NEGATIVOS (❌) EN GYM Y EN CASA */}
        {(activeTab === 'gym' || activeTab === 'home') && (
          <div style={{ ...S.card, padding: '0.75rem 0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.73rem', fontWeight: 900, color: '#0f172a' }}>
                📅 Tu Semana: Positivo (✅) vs Negativo (❌) · Gym y Casa
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                style={{
                  background: '#eff6ff',
                  border: '1px solid #93c5fd',
                  color: '#1d4ed8',
                  borderRadius: '999px',
                  padding: '0.18rem 0.6rem',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                📅 Ver Mes / Validar Días →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.28rem' }}>
              {currentWeekDays.map((wd) => {
                const bg = wd.isPositive
                  ? '#ecfdf5'
                  : wd.isNegative
                  ? '#fef2f2'
                  : wd.isToday
                  ? '#fffbeb'
                  : '#f8fafc';
                const border = wd.isPositive
                  ? '2px solid #10b981'
                  : wd.isNegative
                  ? '2px solid #ef4444'
                  : wd.isToday
                  ? '2px solid #f59e0b'
                  : '1px solid #e2e8f0';
                return (
                  <button
                    key={wd.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedCalendarDate(wd.dateStr);
                      setActiveTab('calendar');
                    }}
                    style={{
                      background: bg,
                      border,
                      borderRadius: '10px',
                      padding: '0.35rem 0.15rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.1rem'
                    }}
                  >
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: wd.isToday ? '#b45309' : '#64748b' }}>
                      {wd.shortDay} {wd.dayNumber}
                    </span>
                    <span style={{ fontSize: '0.88rem', lineHeight: 1.1 }}>
                      {wd.isPositive ? '✅' : wd.isNegative ? '❌' : wd.isToday ? '⏳' : '·'}
                    </span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: wd.isPositive ? '#047857' : wd.isNegative ? '#dc2626' : '#94a3b8' }}>
                      {wd.hasGym && wd.hasHome
                        ? '🏋️+🏠'
                        : wd.hasGym
                        ? '🏋️ Gym'
                        : wd.hasHome
                        ? `🏠×${wd.homeList.length}`
                        : wd.isNegative
                        ? 'Falta'
                        : wd.isToday
                        ? 'Hoy'
                        : '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 1: 🏋️ HOY EN EL GYM (FÁCIL, RÁPIDO Y PROGRESIÓN POR MÁQUINA)
           ==================================================================== */}
        {activeTab === 'gym' && (
          <>
            {/* SI YA SE HA COMPLETADO EL ENTRENAMIENTO DE HOY: BLOQUEADO HASTA MAÑANA PARA NO LIAR */}
            {todayCompletedGymWorkout && !editingCompletedToday ? (
              <div style={{
                ...S.card,
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
                border: '2px solid #10b981'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '2.1rem' }}>🔒</span>
                  <div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      background: '#059669',
                      color: '#ffffff',
                      padding: '0.18rem 0.6rem',
                      borderRadius: '999px'
                    }}>
                      ✅ Entrenamiento de Hoy Completado y Bloqueado
                    </span>
                    <h2 style={{ margin: '0.35rem 0 0.1rem 0', fontSize: '1.15rem', color: '#0f172a' }}>
                      {todayCompletedGymWorkout.routineName}
                    </h2>
                  </div>
                </div>

                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.83rem', color: '#334155', lineHeight: 1.45 }}>
                  🧑‍🏫 <strong>Adán:</strong> ¡Gran trabajo hoy, {activeUser}! He dejado el entrenamiento de hoy <strong>bloqueado hasta mañana</strong> para que no salga el día siguiente antes de tiempo ni metas datos sin querer. Mañana al abrir la app se activará automáticamente tu siguiente sesión.
                </p>

                {gymSavedBanner && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #6ee7b7',
                    color: '#047857',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    marginBottom: '0.85rem'
                  }}>
                    {gymSavedBanner}
                  </div>
                )}

                {/* Resumen de lo guardado hoy */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  marginBottom: '0.9rem'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                    📋 Máquinas registradas hoy ({todayCompletedGymWorkout.date}) · 🔥 ~{todayCompletedGymWorkout.caloriesBurned} kcal:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(todayCompletedGymWorkout.exercises || []).map((ex, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingBottom: '0.3rem', borderBottom: '1px dashed #e2e8f0', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>
                          ✓ {ex.name}
                        </span>
                        <span style={{ color: '#059669', fontWeight: 800 }}>
                          {ex.isCardio
                            ? `${ex.reps}${ex.distanceKm ? ` · ${ex.distanceKm} Km` : ''}${ex.caloriesKcal ? ` · ${ex.caloriesKcal} kcal` : ''}${ex.levelMax ? ` · Niv ${ex.levelMax}` : ''}`
                            : `${ex.weightKg} kg × ${ex.reps}`}
                          {' · '}
                          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
                            {ex.nextAction === 'mejorar' ? '🚀 Subir' : ex.nextAction === 'bajar' ? '🌱 Bajar' : '⚖️ Mantener'}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tiempos de Entrada, Salida y Duración de la sesión */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.4rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.65rem 0.8rem',
                  marginBottom: '0.85rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Entrada</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{todayCompletedGymWorkout.startTime || '18:30'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Salida</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{todayCompletedGymWorkout.endTime || '19:35'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Duración</span>
                    <strong style={{ fontSize: '0.95rem', color: '#059669' }}>{todayCompletedGymWorkout.durationMin || 60} min</strong>
                  </div>
                </div>

                {/* Botón para Generar y Compartir en Redes con el nombre de Casita Gym y del atleta */}
                <button
                  type="button"
                  onClick={() => {
                    setShareWorkoutData(todayCompletedGymWorkout);
                    setShowShareModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.8rem 1rem',
                    fontSize: '0.88rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                    width: '100%',
                    marginBottom: '0.85rem'
                  }}
                >
                  <span>📸</span>
                  <span>Generar Imagen para Redes (Casita Gym · {activeUser})</span>
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setEditingCompletedToday(true)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      borderRadius: '10px',
                      padding: '0.6rem 0.9rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    🔓 Desbloquear para corregir un dato de hoy
                  </button>
                  {activeUser === 'Ismael' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #93c5fd',
                        color: '#1d4ed8',
                        borderRadius: '10px',
                        padding: '0.6rem 0.9rem',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      🍫 Ir a Abdominales / Brazos en Casa →
                    </button>
                  )}
                </div>
              </div>
            ) : coopSession && (coopSession.status === 'active' || coopSession.status === 'completed' || (coopSession.status === 'waiting' && coopSession.ready?.[activeUser])) ? (
              <GymCoopArena
                activeUser={activeUser}
                coopSession={coopSession}
                onRefreshSession={fetchCoopSession}
                onOpenShareModal={(duoData) => {
                  setShareWorkoutData(duoData);
                  setShowShareModal(true);
                }}
                onExitCoop={() => {
                  setCoopSession(null);
                  fetchGymData();
                }}
              />
            ) : (
              <>
                {/* Banner de invitación entrante de la pareja si está esperando */}
                {coopSession && coopSession.status === 'waiting' && !coopSession.ready?.[activeUser] && (
                  <div style={{
                    padding: '1.1rem',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
                    color: '#ffffff',
                    boxShadow: '0 8px 25px rgba(219, 39, 119, 0.45)',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '2rem' }}>👫</span>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.05rem' }}>
                          ¡{coopSession.initiatedBy} te ha invitado a Entrenar Juntos!
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.92 }}>
                          {coopSession.routineName} · Mismas máquinas y turnos de descanso
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/gym/coop/confirm', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user: activeUser })
                          });
                          fetchCoopSession();
                        }}
                        style={{
                          flex: 1,
                          padding: '0.8rem',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#ffffff',
                          color: '#db2777',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                      >
                        ✅ ¡Aceptar y Empezar Juntos!
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/gym/coop/leave', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user: activeUser })
                          });
                          fetchCoopSession();
                        }}
                        style={{
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          background: 'transparent',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Ahora no
                      </button>
                    </div>
                  </div>
                )}

                {/* Selector de los 4 Días de Gimnasio (Se selecciona solo el que te toca hoy) */}
                <div style={S.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.55rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                      📍 Al llegar a entrenar · Plan de Casita Gym
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      {todayCompletedGymWorkout && editingCompletedToday && (
                        <button
                          type="button"
                          onClick={() => setEditingCompletedToday(false)}
                          style={{
                            background: '#ecfdf5',
                            border: '1px solid #6ee7b7',
                            color: '#047857',
                            borderRadius: '999px',
                            padding: '0.2rem 0.6rem',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          🔒 Volver a bloquear hoy
                        </button>
                      )}
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
                  </div>

                  {/* Botones Día 1, Día 2, Día 3, Día 4 (Mostrando cuáles ya están validados) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.8rem' }}>
                    {activeGymDays.map((d, idx) => {
                      const recentCompletion = workouts.find(
                        w => w.user === activeUser && w.type !== 'home' && (w.routineId === d.id || w.routineName?.includes(`Día ${d.dayNumber}`))
                      );
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setSelectedDayIdx(idx)}
                          style={{
                            padding: '0.45rem 0.2rem',
                            borderRadius: '10px',
                            border: selectedDayIdx === idx ? '2px solid #059669' : recentCompletion ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
                            background: selectedDayIdx === idx ? '#ecfdf5' : recentCompletion ? '#f0fdf4' : '#f8fafc',
                            color: selectedDayIdx === idx ? '#047857' : '#475569',
                            fontWeight: 800,
                            fontSize: '0.73rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.1rem'
                          }}
                        >
                          <span>Día {d.dayNumber} {recentCompletion ? '✅' : ''}</span>
                          {recentCompletion && (
                            <span style={{ fontSize: '0.58rem', color: '#059669', fontWeight: 800 }}>
                              Hecho {recentCompletion.date.slice(5)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <h2 style={{ margin: '0 0 0.2rem 0', fontSize: '1.12rem', color: '#0f172a' }}>
                    {currentGymDay.title}
                  </h2>
                  <p style={{ margin: '0 0 0.55rem 0', fontSize: '0.8rem', color: '#475569' }}>
                    {currentGymDay.subtitle} · ⏱️ ~{currentGymDay.duration} min
                  </p>

                  <div style={{
                    fontSize: '0.72rem',
                    color: '#047857',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    marginBottom: '0.65rem',
                    fontWeight: 700
                  }}>
                    💾 <strong>Autoguardado activo:</strong> Cada ejercicio que marques o cambies se queda guardado al instante aunque salgas de la app o pase tiempo.
                  </div>

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
                      {activeUser === 'Ismael' ? '👦 Solo Ismael' : '👧 Solo Sandra'}
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

                {/* BANNER PARA EMPEZAR ENTRENAMIENTO (REGISTRA HORA DE ENTRADA) */}
                {!isWorkoutStarted ? (
                  <div style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff',
                    padding: '1.25rem 1rem',
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
                    textAlign: 'center',
                    marginBottom: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <span style={{ fontSize: '2.4rem' }}>🚀</span>
                    <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 900 }}>
                      ¿Listo para entrenar hoy en Casita Gym?
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.92, maxWidth: '420px', lineHeight: 1.45 }}>
                      Pulsa para marcar tu <strong>hora de entrada</strong>. Calcularemos el tiempo exacto en el gym y tus estadísticas para la tarjeta de <strong>Casita Gym</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartWorkout}
                      style={{
                        background: '#ffffff',
                        color: '#047857',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.8rem 1.6rem',
                        fontSize: '0.95rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        marginTop: '0.4rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>⏱️ Iniciar Entrenamiento Ahora</span>
                      <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 800 }}>
                        {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '12px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#065f46',
                    marginBottom: '0.9rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🟢</span>
                      <span>Entrenando desde las <strong>{workoutStartTime || '18:30'}</strong></span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 800 }}>
                      ⏱️ En curso
                    </span>
                  </div>
                )}

                {/* INTERFAZ PASO A PASO (STEP-BY-STEP) O LISTA COMPLETA */}
                <form onSubmit={handleSaveTodayGym} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Selector de modo y barra de progreso */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '0.85rem 1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
                        🎯 {stepByStepMode ? `Paso ${currentExerciseStep + 1} de ${todayExercises.length}` : 'Lista Completa de Ejercicios'}:{' '}
                        <span style={{ color: '#059669' }}>
                          {todayExercises.filter(e => e.completed).length} de {todayExercises.length} completados
                        </span>
                      </div>

                      {/* Conmutador entre Modo Paso a Paso y Modo Lista */}
                      <button
                        type="button"
                        onClick={() => setStepByStepMode(prev => !prev)}
                        style={{
                          background: stepByStepMode ? '#eff6ff' : '#f1f5f9',
                          border: stepByStepMode ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                          color: stepByStepMode ? '#1d4ed8' : '#475569',
                          borderRadius: '8px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <span>{stepByStepMode ? '📋 Ver Lista Completa' : '🎯 Modo Paso a Paso'}</span>
                      </button>
                    </div>

                    {/* Barra de progreso visual continua */}
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${todayExercises.length > 0 ? (todayExercises.filter(e => e.completed).length / todayExercises.length) * 100 : 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    {/* Fila de pasos interactiva (círculos 1, 2, 3...) */}
                    {stepByStepMode && todayExercises.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '0.35rem',
                        overflowX: 'auto',
                        paddingBottom: '0.2rem',
                        scrollbarWidth: 'none'
                      }}>
                        {todayExercises.map((ex, idx) => {
                          const isCurrent = idx === currentExerciseStep;
                          const isDone = ex.completed;
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setCurrentExerciseStep(idx)}
                              style={{
                                flex: '0 0 auto',
                                minWidth: '32px',
                                height: '32px',
                                padding: '0 6px',
                                borderRadius: '10px',
                                border: isCurrent ? '2px solid #2563eb' : isDone ? '1px solid #059669' : '1px solid #cbd5e1',
                                background: isCurrent ? '#dbeafe' : isDone ? '#10b981' : '#ffffff',
                                color: isCurrent ? '#1d4ed8' : isDone ? '#ffffff' : '#64748b',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '2px',
                                boxShadow: isCurrent ? '0 0 8px rgba(37, 99, 235, 0.4)' : 'none',
                                transition: 'all 0.15s ease'
                              }}
                              title={`Paso ${idx + 1}: ${ex.name}`}
                            >
                              <span>{isDone ? '✓' : idx + 1}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Renderizado: O bien un solo ejercicio (Paso a Paso) o la lista entera */}
                  {(stepByStepMode
                    ? todayExercises.slice(currentExerciseStep, currentExerciseStep + 1)
                    : todayExercises
                  ).map((ex, relativeIdx) => {
                    const idx = stepByStepMode ? currentExerciseStep : relativeIdx;
                    return (
                      <div
                        key={idx}
                        style={{
                          ...S.card,
                          padding: '1.1rem',
                          border: ex.completed ? '2px solid #10b981' : '2px solid #3b82f6',
                          background: ex.completed ? '#ffffff' : '#f8fafc',
                          boxShadow: stepByStepMode ? '0 10px 25px rgba(0,0,0,0.06)' : undefined
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{
                                background: ex.completed ? '#059669' : '#0f172a',
                                color: '#ffffff',
                                borderRadius: '6px',
                                padding: '0.15rem 0.55rem',
                                fontSize: '0.76rem',
                                fontWeight: 800
                              }}>
                                {ex.completed ? `✓ Paso ${idx + 1} de ${todayExercises.length} Completado` : `Paso ${idx + 1} de ${todayExercises.length}`}
                              </span>
                              <strong style={{ fontSize: stepByStepMode ? '1.15rem' : '0.96rem', color: '#0f172a' }}>
                                {ex.name}
                              </strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                              <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>
                                📍 {ex.machine} · <strong>{ex.sets} {ex.sets === 1 ? 'bloque' : 'series'}</strong>
                              </span>

                              {/* Botón para ver Imagen Explicativa Paso 1 y Paso 2 del ejercicio */}
                              <button
                                type="button"
                                onClick={() => setVisualModalItem({ name: ex.name, machine: ex.machine })}
                                style={{
                                  background: '#eff6ff',
                                  border: '1px solid #93c5fd',
                                  color: '#1d4ed8',
                                  borderRadius: '999px',
                                  padding: '0.2rem 0.75rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                📸 Ver cómo se hace
                              </button>
                            </div>
                          </div>

                          {/* Botón de estado Hecho / Pendiente si estamos en modo lista */}
                          {!stepByStepMode && (
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...todayExercises];
                                copy[idx] = { ...copy[idx], completed: !copy[idx].completed };
                                saveDraftImmediately(copy);
                              }}
                              style={{
                                background: ex.completed ? '#10b981' : '#e2e8f0',
                                color: ex.completed ? '#ffffff' : '#334155',
                                border: ex.completed ? '1px solid #059669' : '1px solid #cbd5e1',
                                borderRadius: '10px',
                                padding: '0.45rem 0.75rem',
                                fontSize: '0.76rem',
                                fontWeight: 900,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {ex.completed ? '✓ Hecho' : 'Marcar Hecho'}
                            </button>
                          )}
                        </div>

                        {/* Etiqueta de Auto-Progresión del Entrenador Adán */}
                        <div style={{
                          marginTop: '0.65rem',
                          padding: '0.45rem 0.7rem',
                          borderRadius: '8px',
                          background: ex.isUpgraded ? '#ecfdf5' : '#f1f5f9',
                          color: ex.isUpgraded ? '#047857' : '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 700
                        }}>
                          {ex.badge}
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.4rem', lineHeight: '1.4' }}>
                          💡 {ex.tip}
                        </div>

                        {/* Controles rápidos y grandes para anotar el peso y las repeticiones de hoy */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          marginTop: '0.85rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #f1f5f9',
                          flexWrap: 'wrap'
                        }}>
                          {!ex.isCardio && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>Peso hoy:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...todayExercises];
                                  copy[idx] = {
                                    ...copy[idx],
                                    weightKg: Math.max(0, (Number(copy[idx].weightKg) || 0) - 2.5),
                                    completed: true
                                  };
                                  saveDraftImmediately(copy);
                                }}
                                style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                step="0.5"
                                value={ex.weightKg}
                                onChange={(e) => {
                                  const copy = [...todayExercises];
                                  copy[idx] = { ...copy[idx], weightKg: e.target.value };
                                  saveDraftImmediately(copy);
                                }}
                                style={{ ...S.input, width: '68px', textAlign: 'center', fontWeight: 800, padding: '0.4rem' }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...todayExercises];
                                  copy[idx] = {
                                    ...copy[idx],
                                    weightKg: (Number(copy[idx].weightKg) || 0) + 2.5,
                                    completed: true
                                  };
                                  saveDraftImmediately(copy);
                                }}
                                style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}
                              >
                                +
                              </button>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>kg</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>
                              {ex.isCardio ? 'Tiempo:' : 'Repeticiones:'}
                            </span>
                            <input
                              type="text"
                              value={ex.reps}
                              onChange={(e) => {
                                const copy = [...todayExercises];
                                copy[idx] = { ...copy[idx], reps: e.target.value };
                                saveDraftImmediately(copy);
                              }}
                              style={{ ...S.input, width: '95px', textAlign: 'center', fontWeight: 800, padding: '0.4rem' }}
                            />
                          </div>
                        </div>

                        {/* PANEL ESPECIAL DE PANTALLA DE CARDIO (Distancia, Calorías, Nivel Máx, Pulso y Foto IA) */}
                        {ex.hasCardioScreen && (
                          <div style={{
                            marginTop: '0.8rem',
                            padding: '0.85rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
                            border: '1px solid #bae6fd'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1' }}>
                                📟 Datos de la Pantalla de Cardio (Casita Gym)
                              </div>

                              <label style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                borderRadius: '999px',
                                padding: '0.3rem 0.8rem',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                cursor: analyzingCardioIdx === idx ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                              }}>
                                {analyzingCardioIdx === idx ? '⏳ Leyendo pantalla...' : '📸 Subir foto pantalla Cardio (IA)'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  disabled={analyzingCardioIdx === idx}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleAnalyzeCardioPhoto(idx, f);
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                              <div>
                                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.15rem' }}>
                                  🛣️ Distancia (Km)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Ej: 3.28"
                                  value={ex.distanceKm ?? ''}
                                  onChange={(e) => {
                                    const copy = [...todayExercises];
                                    copy[idx] = { ...copy[idx], distanceKm: e.target.value, completed: true };
                                    saveDraftImmediately(copy);
                                  }}
                                  style={{ ...S.input, width: '100%', padding: '0.35rem 0.45rem', fontWeight: 800, fontSize: '0.82rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.15rem' }}>
                                  🔥 Calorías (kcal)
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="Ej: 115.2"
                                  value={ex.caloriesKcal ?? ''}
                                  onChange={(e) => {
                                    const copy = [...todayExercises];
                                    copy[idx] = { ...copy[idx], caloriesKcal: e.target.value, completed: true };
                                    saveDraftImmediately(copy);
                                  }}
                                  style={{ ...S.input, width: '100%', padding: '0.35rem 0.45rem', fontWeight: 800, fontSize: '0.82rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.15rem' }}>
                                  ⚙️ Nivel Máx
                                </label>
                                <input
                                  type="number"
                                  step="1"
                                  placeholder="Ej: 6"
                                  value={ex.levelMax ?? ''}
                                  onChange={(e) => {
                                    const copy = [...todayExercises];
                                    copy[idx] = { ...copy[idx], levelMax: e.target.value, completed: true };
                                    saveDraftImmediately(copy);
                                  }}
                                  style={{ ...S.input, width: '100%', padding: '0.35rem 0.45rem', fontWeight: 800, fontSize: '0.82rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.15rem' }}>
                                  ❤️ Pulso medio
                                </label>
                                <input
                                  type="number"
                                  step="1"
                                  placeholder="Ej: 107"
                                  value={ex.avgPulse ?? ''}
                                  onChange={(e) => {
                                    const copy = [...todayExercises];
                                    copy[idx] = { ...copy[idx], avgPulse: e.target.value, completed: true };
                                    saveDraftImmediately(copy);
                                  }}
                                  style={{ ...S.input, width: '100%', padding: '0.35rem 0.45rem', fontWeight: 800, fontSize: '0.82rem' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CRONÓMETRO INTEGRADO EN LA FICHA SI EL EJERCICIO ES POR TIEMPO (Plancha, Cinta, Elíptica...) */}
                        {parseExerciseDurationSeconds(ex.reps) && (
                          <InlineExerciseTimer
                            initialSeconds={parseExerciseDurationSeconds(ex.reps)}
                            sets={ex.sets || 1}
                            onComplete={() => {
                              const copy = [...todayExercises];
                              copy[idx] = { ...copy[idx], completed: true };
                              saveDraftImmediately(copy);
                            }}
                          />
                        )}

                        {/* DECISIÓN AL TERMINAR ESTA MÁQUINA CONCRETA (MEJORAR, MANTENER O BAJAR) */}
                        <div style={{
                          marginTop: '0.8rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px dashed #e2e8f0'
                        }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '0.4rem' }}>
                            🧑‍🏫 Al acabar esta máquina, ¿qué hace Adán el próximo día aquí?
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                            {[
                              { id: 'mejorar', label: '🚀 Mejorar', sub: ex.hasCardioScreen ? 'Subir Km/Nivel' : 'Subir peso/reps', activeBorder: '#059669', activeBg: '#ecfdf5', activeColor: '#047857' },
                              { id: 'mantener', label: '⚖️ Mantener', sub: 'Seguir igual', activeBorder: '#2563eb', activeBg: '#eff6ff', activeColor: '#1d4ed8' },
                              { id: 'bajar', label: '🌱 Bajar', sub: 'Costó mucho', activeBorder: '#d97706', activeBg: '#fffbeb', activeColor: '#b45309' }
                            ].map(opt => {
                              const isSel = (ex.nextAction || 'mantener') === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    const copy = [...todayExercises];
                                    copy[idx] = { ...copy[idx], nextAction: opt.id, completed: true };
                                    saveDraftImmediately(copy);
                                  }}
                                  style={{
                                    padding: '0.45rem 0.3rem',
                                    borderRadius: '10px',
                                    border: isSel ? `2px solid ${opt.activeBorder}` : '1px solid #e2e8f0',
                                    background: isSel ? opt.activeBg : '#f8fafc',
                                    color: isSel ? opt.activeColor : '#475569',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                  }}
                                >
                                  <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>{opt.label}</div>
                                  <div style={{ fontSize: '0.64rem', opacity: 0.85 }}>{opt.sub}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* BARRA DE NAVEGACIÓN CONTROLADA STEP-BY-STEP (Solo en modo paso a paso) */}
                        {stepByStepMode && (
                          <div style={{
                            display: 'flex',
                            gap: '0.6rem',
                            marginTop: '1.2rem',
                            paddingTop: '1rem',
                            borderTop: '2px solid #e2e8f0',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                          }}>
                            {/* Botón Anterior */}
                            {currentExerciseStep > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentExerciseStep(prev => Math.max(0, prev - 1));
                                  window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                style={{
                                  padding: '0.75rem 0.95rem',
                                  borderRadius: '12px',
                                  border: '1px solid #cbd5e1',
                                  background: '#f8fafc',
                                  color: '#334155',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer'
                                }}
                              >
                                ← Anterior
                              </button>
                            )}

                            {/* Botón Saltar Ejercicio */}
                            {currentExerciseStep < todayExercises.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentExerciseStep(prev => prev + 1);
                                  window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                style={{
                                  padding: '0.75rem 0.95rem',
                                  borderRadius: '12px',
                                  border: '1px dashed #d97706',
                                  background: '#fffbeb',
                                  color: '#b45309',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                                title="Saltar al siguiente ejercicio sin marcar completado"
                              >
                                ⏭️ Saltar Ejercicio
                              </button>
                            )}

                            {/* Botón Principal: Completar y Avanzar al siguiente paso */}
                            {currentExerciseStep < todayExercises.length - 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...todayExercises];
                                  copy[idx] = { ...copy[idx], completed: true };
                                  saveDraftImmediately(copy);
                                  setCurrentExerciseStep(prev => prev + 1);
                                  if (timerSeconds === 0) {
                                    startTimer(60);
                                  }
                                  window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                style={{
                                  flex: 1,
                                  minWidth: '160px',
                                  padding: '0.85rem 1.2rem',
                                  borderRadius: '12px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: '#ffffff',
                                  fontWeight: 900,
                                  fontSize: '0.92rem',
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.4rem'
                                }}
                              >
                                <span>✅ Completar y Siguiente</span>
                                <span style={{ fontSize: '1.1rem' }}>→</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...todayExercises];
                                  copy[idx] = { ...copy[idx], completed: true };
                                  saveDraftImmediately(copy);
                                }}
                                style={{
                                  flex: 1,
                                  minWidth: '160px',
                                  padding: '0.85rem 1.2rem',
                                  borderRadius: '12px',
                                  border: 'none',
                                  background: ex.completed ? '#059669' : '#10b981',
                                  color: '#ffffff',
                                  fontWeight: 900,
                                  fontSize: '0.92rem',
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                                }}
                              >
                                {ex.completed ? '✓ Último Ejercicio Completado' : '✅ Marcar Último Ejercicio'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Resumen y Botón Guardar Entreno de Hoy */}
                  <div style={S.card}>
                    <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '0.65rem', textAlign: 'center' }}>
                      🧑‍🏫 Al pulsar el botón de abajo, <strong>Adán cerrará y bloqueará el día de hoy</strong> hasta mañana para que no salte al día siguiente ni se mezclen datos.
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
                      {savingGym ? 'Guardando y bloqueando día...' : `✅ Terminar y Bloquear ${currentGymDay.shortTab} de Hoy`}
                    </button>
                  </div>
                </form>
              </>
            )}
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
              border: didHomeToday ? '2px solid #10b981' : '1px solid #fed7aa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    background: didHomeToday ? '#059669' : '#ffffff',
                    color: didHomeToday ? '#ffffff' : '#ea580c',
                    border: `1px solid ${didHomeToday ? '#059669' : '#fed7aa'}`
                  }}>
                    {didHomeToday
                      ? `✅ ¡Reto en casa VALIDADO HOY! (${userHomeWorkouts.filter(w => w.date === todayDateStr).length} ${userHomeWorkouts.filter(w => w.date === todayDateStr).length === 1 ? 'rutina hecha' : 'rutinas hechas'})`
                      : '⏰ ¡Oblígate 5-8 minutos hoy en el salón o despacho!'}
                  </span>
                  <h2 style={{ margin: '0.4rem 0 0.15rem 0', fontSize: '1.15rem', color: '#0f172a' }}>
                    🏠 Ejercicios Rápidos en Casa con Adán ({activeUser})
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                    Tus repeticiones suben solas cada 4 sesiones completadas · <strong>Nivel actual en casa: Nivel {homeLevel}</strong> ({userHomeWorkouts.length} sesiones validadas).
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de las 3 micro-rutinas de casa con indicador ✅ VALIDADO HOY en cada una */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {HOME_ROUTINES.map((hr, idx) => {
                const validatedToday = !!getValidatedHomeWorkout(hr, todayDateStr);
                const isSelected = selectedHomeIdx === idx;
                return (
                  <button
                    key={hr.id}
                    type="button"
                    onClick={() => setSelectedHomeIdx(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      border: validatedToday
                        ? '2px solid #10b981'
                        : isSelected
                        ? '2px solid #2563eb'
                        : '1px solid #e2e8f0',
                      background: validatedToday
                        ? '#ecfdf5'
                        : isSelected
                        ? '#eff6ff'
                        : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{hr.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {validatedToday && (
                          <span style={{
                            background: '#059669',
                            color: '#ffffff',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 900
                          }}>
                            ✅ VALIDADO HOY
                          </span>
                        )}
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669' }}>⏱️ {hr.durationMin} min</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.2rem' }}>{hr.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Ejercicios del reto en casa seleccionado */}
            {(() => {
              const currentRoutineValidated = getValidatedHomeWorkout(currentHomeRoutine, todayDateStr);
              const routineCheckMap = homeCheckedByRoutine[currentHomeRoutine.id] || {};
              return (
                <div style={{
                  ...S.card,
                  border: currentRoutineValidated ? '2px solid #10b981' : '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                      📋 {currentHomeRoutine.exercises.length} ejercicios seguidos (Nivel {homeLevel}):
                    </h3>
                    {currentRoutineValidated && (
                      <span style={{
                        background: '#ecfdf5',
                        border: '1px solid #6ee7b7',
                        color: '#047857',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 900
                      }}>
                        ✅ Completado y Validado Hoy
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.9rem' }}>
                    {currentHomeRoutine.exercises.map((ex, idx) => {
                      const targetVal = ex.baseTarget + ((homeLevel - 1) * ex.scalePerLevel);
                      const isDone = currentRoutineValidated ? true : !!routineCheckMap[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleHomeExerciseCheck(currentHomeRoutine, idx)}
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
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              <span style={{
                                background: isDone ? '#059669' : '#0f172a',
                                color: '#ffffff',
                                borderRadius: '6px',
                                padding: '0.1rem 0.45rem',
                                fontSize: '0.7rem',
                                fontWeight: 800
                              }}>
                                {isDone ? `✓ Hecho` : `Paso ${idx + 1}`}
                              </span>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                                {ex.name}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVisualModalItem({ name: ex.name, machine: 'En Casa' });
                                }}
                                style={{
                                  background: '#eff6ff',
                                  border: '1px solid #93c5fd',
                                  color: '#1d4ed8',
                                  borderRadius: '999px',
                                  padding: '0.15rem 0.6rem',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                📸 Imagen cómo se hace
                              </button>
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                              🎯 Objetivo hoy: {targetVal} {ex.unit}
                              {homeLevel > 1 && <span style={{ fontSize: '0.7rem', color: '#2563eb', marginLeft: '0.4rem' }}>(+{ (homeLevel - 1) * ex.scalePerLevel } por tu nivel {homeLevel})</span>}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '0.15rem' }}>
                              💡 {ex.tip}
                            </div>
                            {parseExerciseDurationSeconds(`${targetVal} ${ex.unit}`) && (
                              <InlineExerciseTimer
                                initialSeconds={parseExerciseDurationSeconds(`${targetVal} ${ex.unit}`)}
                                sets={1}
                                onComplete={() => toggleHomeExerciseCheck(currentHomeRoutine, idx, true)}
                              />
                            )}
                          </div>

                          <div style={{
                            minWidth: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: isDone ? '#10b981' : '#ffffff',
                            border: isDone ? '1px solid #059669' : '1px solid #cbd5e1',
                            color: isDone ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.15rem'
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

                  {currentRoutineValidated ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{
                        flex: 1,
                        background: '#ecfdf5',
                        border: '2px solid #10b981',
                        color: '#047857',
                        borderRadius: '12px',
                        padding: '0.8rem',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        textAlign: 'center'
                      }}>
                        ✅ VALIDADO Y GUARDADO EN TU CALENDARIO DE HOY
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm('¿Desmarcar esta rutina de hoy?')) return;
                          const res = await fetch(`/api/gym/workouts/${currentRoutineValidated.id}`, { method: 'DELETE' });
                          if (res.ok) {
                            const d = await res.json();
                            setWorkouts(d.workouts || []);
                            const nextMap = { ...homeCheckedByRoutine, [currentHomeRoutine.id]: {} };
                            setHomeCheckedByRoutine(nextMap);
                          }
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#64748b',
                          borderRadius: '12px',
                          padding: '0.8rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Desmarcar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={savingHome}
                      onClick={() => handleCompleteHomeWorkout(currentHomeRoutine, todayDateStr)}
                      style={{ ...S.btnGreen, width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                    >
                      {savingHome ? 'Validando...' : '✅ ¡Hecho! Validar y Guardar esta Rutina en Casa'}
                    </button>
                  )}
                </div>
              );
            })()}
          </>
        )}

        {/* ====================================================================
            PESTAÑA CALENDARIO: 📅 POSITIVO (✅) / NEGATIVO (❌) DE GYM Y CASA
           ==================================================================== */}
        {activeTab === 'calendar' && (() => {
          const baseNow = new Date();
          const viewDate = new Date(baseNow.getFullYear(), baseNow.getMonth() + calendarMonthOffset, 1);
          const viewYear = viewDate.getFullYear();
          const viewMonth = viewDate.getMonth();
          const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
          const firstDayDow = new Date(viewYear, viewMonth, 1).getDay(); // 0 Dom, 1 Lun...
          const leadingEmpty = firstDayDow === 0 ? 6 : firstDayDow - 1;

          const monthDayCells = [];
          for (let d = 1; d <= daysInMonth; d++) {
            const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            monthDayCells.push({ dayNum: d, ...getDayCalendarStatus(dStr) });
          }

          const positiveCount = monthDayCells.filter(c => c.isPositive).length;
          const negativeCount = monthDayCells.filter(c => c.isNegative).length;
          const gymCountMonth = monthDayCells.reduce((acc, c) => acc + c.gymList.length, 0);
          const homeCountMonth = monthDayCells.reduce((acc, c) => acc + c.homeList.length, 0);

          const selectedDayInfo = getDayCalendarStatus(selectedCalendarDate);

          return (
            <>
              {/* Resumen Mensual Positivo vs Negativo */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.12rem', color: '#0f172a' }}>
                      📅 Calendario de Disciplina de {activeUser}
                    </h2>
                    <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.77rem', color: '#64748b' }}>
                      Verde (✅ Positivo) cuando cumples en Gimnasio o Casa · Rojo (❌ Negativo) si pasa el día en blanco.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset(calendarMonthOffset - 1)}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.3rem 0.6rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ◀
                    </button>
                    <span style={{ fontWeight: 900, fontSize: '0.88rem', color: '#0f172a', minWidth: '125px', textAlign: 'center' }}>
                      {monthNames[viewMonth]} {viewYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset(calendarMonthOffset + 1)}
                      style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.3rem 0.6rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Marcadores grandes del mes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '0.55rem 0.35rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#047857' }}>DÍAS POSITIVOS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>✅ {positiveCount}</div>
                  </div>
                  <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '12px', padding: '0.55rem 0.35rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#1d4ed8' }}>SESIONES GYM</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563eb' }}>🏋️ {gymCountMonth}</div>
                  </div>
                  <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '0.55rem 0.35rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#c2410c' }}>RUTINAS CASA</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ea580c' }}>🏠 {homeCountMonth}</div>
                  </div>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '0.55rem 0.35rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#b91c1c' }}>DÍAS NEGATIVOS</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626' }}>❌ {negativeCount}</div>
                  </div>
                </div>

                {/* Cuadrícula del mes (Lunes a Domingo) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem', textAlign: 'center', marginBottom: '0.3rem' }}>
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', padding: '0.2rem 0' }}>{d}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem' }}>
                  {Array.from({ length: leadingEmpty }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ minHeight: '56px' }} />
                  ))}

                  {monthDayCells.map(cell => {
                    const isSel = selectedCalendarDate === cell.dateStr;
                    const bg = cell.isPositive
                      ? '#ecfdf5'
                      : cell.isNegative
                      ? '#fef2f2'
                      : cell.isToday
                      ? '#fffbeb'
                      : '#f8fafc';
                    const border = isSel
                      ? '2.5px solid #0f172a'
                      : cell.isPositive
                      ? '2px solid #10b981'
                      : cell.isNegative
                      ? '1.5px solid #fca5a5'
                      : cell.isToday
                      ? '2px solid #f59e0b'
                      : '1px solid #e2e8f0';

                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        onClick={() => setSelectedCalendarDate(cell.dateStr)}
                        style={{
                          minHeight: '58px',
                          background: bg,
                          border,
                          borderRadius: '10px',
                          padding: '0.25rem 0.15rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: cell.isPositive ? '#047857' : cell.isNegative ? '#b91c1c' : '#334155' }}>
                          {cell.dayNum}
                        </span>
                        <span style={{ fontSize: '0.88rem', lineHeight: 1 }}>
                          {cell.isPositive ? '✅' : cell.isNegative ? '❌' : cell.isToday ? '⏳' : ''}
                        </span>
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: cell.isPositive ? '#047857' : cell.isNegative ? '#dc2626' : '#94a3b8' }}>
                          {cell.hasGym && cell.hasHome
                            ? '🏋️+🏠'
                            : cell.hasGym
                            ? '🏋️ Gym'
                            : cell.hasHome
                            ? `🏠×${cell.homeList.length}`
                            : cell.isNegative
                            ? 'Negativo'
                            : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalle y Validador con 1 Toque del Día Seleccionado en el Calendario */}
              <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      padding: '0.18rem 0.6rem',
                      borderRadius: '999px',
                      background: selectedDayInfo.isPositive ? '#ecfdf5' : '#fef2f2',
                      color: selectedDayInfo.isPositive ? '#047857' : '#b91c1c',
                      border: `1px solid ${selectedDayInfo.isPositive ? '#6ee7b7' : '#fecaca'}`
                    }}>
                      {selectedDayInfo.isPositive ? '🟢 DÍA POSITIVO (VALIDADO)' : '🔴 SIN ENTRENO REGISTRADO'}
                    </span>
                    <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.02rem', color: '#0f172a' }}>
                      📌 Día seleccionado: {selectedCalendarDate} {selectedCalendarDate === todayDateStr ? '(HOY)' : ''}
                    </h3>
                  </div>
                </div>

                {/* Lista de lo completado en esa fecha */}
                {selectedDayInfo.dayWorkouts.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem 0' }}>
                    No hay entrenamientos validados en esta fecha. Si entrenaste este día en el gimnasio o en casa, márcalo abajo con 1 toque:
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.9rem' }}>
                    {selectedDayInfo.dayWorkouts.map(w => (
                      <div
                        key={w.id}
                        style={{
                          background: w.type === 'home' ? '#fff7ed' : '#ecfdf5',
                          border: `1px solid ${w.type === 'home' ? '#fed7aa' : '#6ee7b7'}`,
                          borderRadius: '10px',
                          padding: '0.65rem 0.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f172a' }}>
                            ✅ {w.type === 'home' ? '🏠 En Casa:' : '🏋️ Gimnasio:'} {w.routineName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                            ⏱️ {w.durationMin} min · 🔥 ~{w.caloriesBurned} kcal {w.notes ? `· ${w.notes}` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!window.confirm('¿Quitar este entrenamiento de esta fecha?')) return;
                            const res = await fetch(`/api/gym/workouts/${w.id}`, { method: 'DELETE' });
                            if (res.ok) {
                              const d = await res.json();
                              setWorkouts(d.workouts || []);
                            }
                          }}
                          style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '0.3rem 0.55rem', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          🗑️ Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botones rápidos para Validar Gimnasio o Casa en la fecha seleccionada */}
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
                    🏋️ Validar sesión de Gimnasio en el día {selectedCalendarDate}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {activeGymDays.map(d => {
                      const doneOnSelected = selectedDayInfo.gymList.some(w => w.routineId === d.id || w.routineName?.includes(`Día ${d.dayNumber}`));
                      return (
                        <button
                          key={d.id}
                          type="button"
                          disabled={savingGym}
                          onClick={() => handleQuickValidateGymDay(d, selectedCalendarDate)}
                          style={{
                            background: doneOnSelected ? '#ecfdf5' : '#f8fafc',
                            border: doneOnSelected ? '2px solid #10b981' : '1px solid #cbd5e1',
                            color: doneOnSelected ? '#047857' : '#0f172a',
                            borderRadius: '10px',
                            padding: '0.5rem',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          {doneOnSelected ? '✅ ' : '+ Validar '} {d.shortTab}
                        </button>
                      );
                    })}
                  </div>

                  {activeUser === 'Ismael' && (
                    <>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
                        🏠 Validar rutina de Casa en el día {selectedCalendarDate}:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {HOME_ROUTINES.map(hr => {
                          const doneOnSelected = selectedDayInfo.homeList.some(w => w.routineId === hr.id || w.routineName === hr.title);
                          return (
                            <button
                              key={hr.id}
                              type="button"
                              disabled={savingHome}
                              onClick={() => handleCompleteHomeWorkout(hr, selectedCalendarDate)}
                              style={{
                                background: doneOnSelected ? '#ecfdf5' : '#f8fafc',
                                border: doneOnSelected ? '2px solid #10b981' : '1px solid #cbd5e1',
                                color: doneOnSelected ? '#047857' : '#0f172a',
                                borderRadius: '10px',
                                padding: '0.55rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <span>{doneOnSelected ? '✅ Validada: ' : '+ Validar: '} {hr.title}</span>
                              {doneOnSelected && <span style={{ fontSize: '0.68rem', color: '#059669' }}>HECHO</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })()}

        {/* ====================================================================
            PESTAÑA 3: 🍎 COMIDA Y PESO (CUÉNTASELO A ADÁN + BÁSCULA)
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

            {/* BLOQUE 2: CUÉNTALE QUÉ HAS COMIDO A ADÁN */}
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.08rem', color: '#0f172a' }}>
                    🍎 Cuéntale a Adán qué has comido hoy ({activeUser})
                  </h2>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    Escríbelo normal y Adán calculará las calorías y te dirá cómo vas hoy.
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
                    {analyzingMeal ? 'Analizando...' : '🧑‍🏫 Contárselo a Adán'}
                  </button>
                </div>
              </form>

              {/* Lista de comidas registradas con el consejo de Adán */}
              {meals.filter(m => m.user === activeUser).length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', margin: '0.5rem 0' }}>
                  Aún no le has contado a Adán qué has comido hoy. ¡Apunta tu desayuno o comida arriba y te dice cómo vas!
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
                        <strong>🧑‍🏫 Adán ({m.score}):</strong> {m.coachFeedback}
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
                🎯 ¿Cuál es el objetivo principal de {activeUser} con Adán?
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
                🏢 Máquinas de Casita Gym (Vía Lusitana 1)
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
                    <div key={m.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{m.icon} {m.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.15rem' }}>🎯 {m.muscles}</div>
                        <div style={{ fontSize: '0.74rem', color: '#334155', marginTop: '0.35rem' }}>
                          <strong>⚙️ Ajuste:</strong> {m.setup}<br />
                          <strong>🎓 Cómo hacerla:</strong> {m.technique}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVisualModalItem({ name: m.id, machine: m.name })}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #93c5fd',
                          color: '#1d4ed8',
                          borderRadius: '10px',
                          padding: '0.45rem 0.7rem',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        📸 Ver imágenes explicativas (Inicio → Final)
                      </button>
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
                  Aquí irán apareciendo todos tus entrenos completados con Adán, {activeUser}.
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
                          📅 {w.date} · ⏱️ {w.durationMin} min · 🔥 ~{w.caloriesBurned} kcal
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

      {/* MODAL VISUAL DE MÁQUINA Y ANIMACIÓN DEL EJERCICIO */}
      {visualModalItem && (
        <ExerciseVisualModal
          exerciseKeyOrName={visualModalItem.name}
          machineName={visualModalItem.machine}
          onClose={() => setVisualModalItem(null)}
        />
      )}

      {/* MODAL PARA GENERAR Y COMPARTIR IMAGEN DE CASITA GYM EN REDES */}
      <GymSocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        workoutData={shareWorkoutData}
        userName={activeUser}
      />

      {/* MODAL DE SELECCIÓN: ¿ENTRENAR SOLO O EN PAREJA? */}
      {showWorkoutTypeModal && (
        <div className="modal-overlay" onClick={() => setShowWorkoutTypeModal(false)} style={{ zIndex: 120 }}>
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              width: '92%',
              padding: '1.4rem',
              borderRadius: '22px',
              background: '#0f172a',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '0.2rem' }}>🏋️</div>
            <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', fontWeight: 900 }}>
              ¿Cómo vas a entrenar hoy?
            </h3>
            <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.84rem', color: '#94a3b8' }}>
              Elige si entrenas por tu cuenta o si entrenáis juntos Ismael y Sandra compartiendo máquinas y turnos de descanso.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowWorkoutTypeModal(false);
                  proceedStartWorkoutSolo();
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>👤</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>Entrenar solo ({activeUser})</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Tu rutina personal paso a paso con tus series y descansos individuales.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowWorkoutTypeModal(false);
                  handleStartCoopWorkout();
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '2px solid #ec4899',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(139, 92, 246, 0.22) 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.35)'
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>👫</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#f472b6' }}>
                    Entrenar juntos (Ismael & Sandra) ⚡
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                    Modo juego interactivo: mismas máquinas, turnos alternos (uno entrena y otro descansa).
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowWorkoutTypeModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR ADAPTADA AL PERFIL (4 pestañas para Ismael con En Casa, 3 para Sandra solo Gym) */}
      <nav
        style={{
          ...S.bottomNav,
          gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)`
        }}
        aria-label="Menú principal Casita Gym"
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
