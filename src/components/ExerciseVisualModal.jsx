import React, { useState } from 'react';

// Catálogo visual completo de máquinas del Gimnasio Marbella y ejercicios en casa
// Incluye descripción visual para reconocer la máquina en sala, ajuste, músculos y animación del movimiento
export const EXERCISE_VISUAL_CATALOG = {
  'prensa': {
    id: 'prensa',
    title: 'Prensa de Piernas Sentado (Leg Press)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Cuádriceps (muslos), Glúteos e Isquiotibiales',
    howToSpot: 'Busca un asiento reclinado frente a una plataforma grande metálica rugosa donde se apoyan los pies, conectada a una torre de placas de peso con pincho.',
    setup: 'Ajusta la distancia del asiento para que al apoyar los pies tus rodillas doblen a unos 90 grados sin que se te levante el culo del respaldo.',
    steps: [
      'Apoya los dos pies en la plataforma a la anchura de tus hombros (más arriba si quieres enfocar más el glúteo).',
      'Empuja la plataforma con los TALONES extendiendo las piernas (sin llegar a bloquear las rodillas del todo).',
      'Dobla las rodillas despacio en 2 segundos controlando el peso al volver.'
    ],
    adanTip: 'Nunca des un golpe seco con las rodillas al estirarlas; déjalas siempre un pelín flexionadas arriba.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Leg_press_machine.jpg/640px-Leg_press_machine.jpg',
    animType: 'prensa'
  },
  'jalon-pecho': {
    id: 'jalon-pecho',
    title: 'Jalón al Pecho en Polea Alta (Lat Pulldown)',
    zone: 'Zona de Espalda / Torres de Poleas',
    muscles: 'Espalda ancha (Dorsales), Hombros posteriores y Bíceps',
    howToSpot: 'Es una máquina alta con una barra larga horizontal colgada de un cable arriba y un asiento con dos rodillos acolchados para encajar los muslos.',
    setup: 'Pon el pincho en tu peso, agarra la barra un poco más ancho que tus hombros y siéntate encajando las piernas bajo los rodillos.',
    steps: [
      'Saca pecho e inclina la espalda solo un poquito hacia atrás.',
      'Tira de la barra hacia abajo llevando los codos hacia tus costillas hasta que la barra toque la parte alta del pecho (clavícula).',
      'Sube los brazos despacio controlando el cable hasta estirar bien la espalda.'
    ],
    adanTip: 'Baja siempre la barra por delante hacia el pecho, ¡nunca por detrás de la nuca para no hacerte daño en el cuello!',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wide-grip_lat_pull-down_2.png/640px-Wide-grip_lat_pull-down_2.png',
    animType: 'jalon'
  },
  'press-pecho': {
    id: 'press-pecho',
    title: 'Press de Pecho Sentado en Máquina (Chest Press)',
    zone: 'Zona de Pecho y Torso',
    muscles: 'Pectoral, Parte frontal del Hombro y Tríceps',
    howToSpot: 'Sillón vertical con respaldo alto y dos brazos con agarres a los lados de tu pecho que se empujan hacia delante.',
    setup: 'Regula la altura del asiento para que los agarres te queden justo a la altura de la mitad del pecho (no a la altura del cuello).',
    steps: [
      'Pega bien la espalda y los hombros contra el respaldo.',
      'Empuja los agarres hacia delante soltando el aire hasta estirar los brazos.',
      'Vuelve despacio en 2 segundos sintiendo cómo se estira el pecho sin que las placas choquen.'
    ],
    adanTip: 'Al empujar, imagina que quieres empujar tu propia espalda contra el respaldo en vez de adelantar los hombros.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Chest_press_machine.jpg/640px-Chest_press_machine.jpg',
    animType: 'press-pecho'
  },
  'extension-cuadriceps': {
    id: 'extension-cuadriceps',
    title: 'Extensión de Cuádriceps Sentado (Leg Extension)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Cuádriceps (parte frontal del muslo y firmeza de rodilla)',
    howToSpot: 'Silla con respaldo y un rodillo acolchado abajo que queda apoyado delante de tus espinillas/tobillos.',
    setup: 'Ajusta el respaldo para que la corva de tu rodilla quede pegada al borde del asiento y el rodillo justo encima de los tobillos.',
    steps: [
      'Sujétate a los agarres laterales del asiento para no levantar la cadera.',
      'Estira las dos piernas hacia arriba hasta que queden horizontales y aguanta 1 segundo apretando el muslo.',
      'Baja despacio en 2 segundos sin soltar el peso de golpe.'
    ],
    adanTip: 'Esa pausa de 1 segundo arriba del todo es el secreto para tonificar las piernas con menos peso y cero riesgo.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Leg_extension_machine_2.png/640px-Leg_extension_machine_2.png',
    animType: 'cuadriceps'
  },
  'curl-femoral': {
    id: 'curl-femoral',
    title: 'Curl Femoral Sentado o Tumbado (Leg Curl)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Isquiotibiales (parte trasera del muslo) y Glúteo',
    howToSpot: 'Silla con rodillo donde apoyas la parte trasera de los tobillos (tendón de Aquiles) para doblar las piernas hacia abajo/atrás, o camilla para hacerlo tumbado boca abajo.',
    setup: 'Coloca el rodillo justo en la parte baja del gemelo / talón de Aquiles.',
    steps: [
      'Dobla las rodillas tirando del rodillo con los talones hacia atrás/abajo todo lo que puedas.',
      'Aprieta 1 segundo la parte trasera del muslo.',
      'Estira las piernas despacio controlando el regreso.'
    ],
    adanTip: 'Mantén los dedos de los pies mirando hacia tus espinillas (no de puntillas) para notar mucho mejor el femoral.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Seated_leg_curl_2.png/640px-Seated_leg_curl_2.png',
    animType: 'femoral'
  },
  'abductores': {
    id: 'abductores',
    title: 'Máquina de Abductores (Abrir Piernas · Glúteo)',
    zone: 'Zona de Pierna y Glúteo',
    muscles: 'Glúteo medio, Glúteo mayor y Cadera',
    howToSpot: 'Silla con dos almohadillas laterales giratorias donde apoyas la parte externa de las rodillas/muslos para abrir las piernas.',
    setup: 'Junta las almohadillas con la palanca lateral antes de empezar para tener buen recorrido al abrir.',
    steps: [
      'Siéntate con la espalda apoyada (o ligeramente inclinada hacia delante si quieres notar aún más el glúteo).',
      'Abre las piernas empujando con la parte externa de las rodillas y aguanta 1 segundo abierto.',
      'Cierra despacio sin que reboten las placas.'
    ],
    adanTip: 'Haz una pequeña pausa de 1 segundo con las piernas abiertas en cada repetición; quema muchísimo glúteo.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hip_abduction_machine_2.png/640px-Hip_abduction_machine_2.png',
    animType: 'abductores'
  },
  'remo-polea': {
    id: 'remo-polea',
    title: 'Remo Sentado en Polea Baja (Remo Gironda)',
    zone: 'Zona de Espalda / Poleas',
    muscles: 'Espalda media (corrección de postura), Dorsales y Bíceps',
    howToSpot: 'Banco largo bajo con dos apoyos metálicos para los pies enfrente y un cable bajo con un agarre doble en forma de V.',
    setup: 'Apoya los pies en las plataformas, dobla un poquito las rodillas y siéntate con la espalda totalmente recta.',
    steps: [
      'Con el pecho fuera y hombros bajos, tira del agarre hacia tu ombligo.',
      'Junta los omóplatos (escápulas) atrás durante 1 segundo.',
      'Extiende los brazos hacia delante despacio sin encorvar la zona lumbar.'
    ],
    adanTip: 'No te columpies hacia delante y hacia atrás con la espalda; deja el tronco firme y tira con los codos.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Cable_seated_row_2.png/640px-Cable_seated_row_2.png',
    animType: 'remo'
  },
  'contractora': {
    id: 'contractora',
    title: 'Contractora Pectoral / Mariposa (Pec Deck)',
    zone: 'Zona de Pecho',
    muscles: 'Pectoral mayor (firmeza y línea central del pecho)',
    howToSpot: 'Asiento vertical con dos brazos largos articulados a los lados que se cierran hacia delante como un abrazo.',
    setup: 'Ajusta el asiento para que al abrir los brazos tus manos y codos queden un poquito por debajo de la línea de los hombros.',
    steps: [
      'Apoya bien la espalda en el respaldo.',
      'Junta los dos brazos delante de tu pecho como si dieras un abrazo amplio.',
      'Abre despacio hasta notar un estiramiento cómodo en el pecho.'
    ],
    adanTip: 'Mantén los codos ligeramente doblados y concéntrate en juntar los codos, no solo las manos.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Butterfly_machine_2.png/640px-Butterfly_machine_2.png',
    animType: 'contractora'
  },
  'press-hombro': {
    id: 'press-hombro',
    title: 'Press de Hombros Sentado en Máquina (Shoulder Press)',
    zone: 'Zona de Hombros y Brazos',
    muscles: 'Hombros (Deltoides) y Tríceps',
    howToSpot: 'Silla con respaldo vertical y dos agarres que parten desde la altura de las orejas/hombros y se empujan hacia el techo.',
    setup: 'Regula el asiento para que en la posición más baja los agarres estén a la altura de tu barbilla o las orejas.',
    steps: [
      'Sujeta los agarres con la espalda bien pegada al respaldo.',
      'Empuja hacia arriba hasta estirar casi del todo los brazos sobre la cabeza.',
      'Baja despacio hasta la altura de las orejas.'
    ],
    adanTip: 'Empieza con poco peso en esta máquina; el hombro se cansa rápido y es mejor hacer las 12 repeticiones limpias.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lever_shoulder_press_2.png/640px-Lever_shoulder_press_2.png',
    animType: 'press-hombro'
  },
  'polea-triceps-biceps': {
    id: 'polea-triceps-biceps',
    title: 'Extensión de Tríceps / Curl de Bíceps en Polea',
    zone: 'Estación Multipoleas y Zona de Mancuernas',
    muscles: 'Tríceps (parte trasera del brazo) y Bíceps',
    howToSpot: 'Torre de cables regulable donde puedes enganchar una cuerda o barra corta arriba (para tríceps) o abajo (para bíceps).',
    setup: 'Ponte de pie frente a la polea con las rodillas ligeramente destensadas y el abdomen firme.',
    steps: [
      'Para Tríceps (polea arriba): Pega los codos a tus costillas y empuja la cuerda/barra hacia tus muslos estirando el brazo.',
      'Para Bíceps (polea abajo o mancuernas): Con los codos pegados al cuerpo, dobla los brazos subiendo el peso hacia el pecho.',
      'Controla siempre la vuelta en 2 segundos.'
    ],
    adanTip: 'La clave es que tus codos se queden "clavados" a los costados: solo se mueven los antebrazos.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cable_triceps_pushdown_2.png/640px-Cable_triceps_pushdown_2.png',
    animType: 'polea-brazos'
  },
  'cinta': {
    id: 'cinta',
    title: 'Cinta de Correr con Inclinación (Treadmill)',
    zone: 'Zona Cardio (Frente a espejos / pantallas)',
    muscles: 'Quema de grasa general, Glúteos, Gemelos y Resistencia',
    howToSpot: 'Las cintas de caminar/correr de la zona de cardio. Tienen botones de Inclinación (Incline / %) a la izquierda y Velocidad (Speed / km/h) a la derecha.',
    setup: 'Sube la inclinación entre el 6% y el 8%, y pon una velocidad de caminata rápida (entre 4.6 y 5.4 km/h).',
    steps: [
      'Camina con paso firme y largo sin agarrarte con las manos a la pantalla (deja que los brazos braceen).',
      'Mantén el pecho erguido y respira de forma constante.'
    ],
    adanTip: 'Caminar en cuesta quema casi las mismas calorías que trotar suave, pero cuidando al 100% tus rodillas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Treadmill.jpg/640px-Treadmill.jpg',
    animType: 'cardio-cinta'
  },
  'eliptica': {
    id: 'eliptica',
    title: 'Bicicleta Elíptica / Spinning (Cardio Cero Impacto)',
    zone: 'Zona Cardio',
    muscles: 'Piernas, Brazos, Corazón y Quema Calórica sin impacto',
    howToSpot: 'Máquina de cardio con dos pedales grandes suspendidos y dos bastones largos verticales que se mueven a la vez con las manos.',
    setup: 'Súbete apoyando primero un pie y luego el otro, empieza a pedalear y selecciona un nivel de resistencia medio (nivel 4 a 7).',
    steps: [
      'Empuja y tira también con los brazos en los bastones móviles para quemar un 30% más de calorías.',
      'Apoya toda la planta del pie para que no se te duerman los dedos.'
    ],
    adanTip: 'Si quieres quemar más grasa en menos tiempo, alterna 2 minutos a ritmo normal con 1 minuto rápido.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Elliptical_trainer.jpg/640px-Elliptical_trainer.jpg',
    animType: 'cardio-eliptica'
  },
  'colchoneta-abdomen': {
    id: 'colchoneta-abdomen',
    title: 'Plancha Abdominal y Puente de Glúteo (Zona Suelo)',
    zone: 'Zona de Colchonetas y Estiramientos / En Casa',
    muscles: 'Abdomen profundo (Core), Cintura, Glúteos y Zona Lumbar',
    howToSpot: 'Coge una esterilla/colchoneta en la zona funcional del gimnasio (o en la alfombra de casa).',
    setup: 'Coloca la esterilla en el suelo para apoyar cómodamente los antebrazos o la espalda.',
    steps: [
      'En Plancha: Apoya los antebrazos y las puntas de los pies, manteniendo el cuerpo recto como una tabla y apretando fuerte tripa y glúteo.',
      'En Puente de Glúteo: Túmbate boca arriba con las rodillas dobladas, empuja el suelo con los talones y sube la cadera apretando el glúteo 1 segundo arriba.'
    ],
    adanTip: 'En la plancha no aguantes la respiración: da respiraciones cortas mientras aprietas el abdomen como si te fueran a hacer cosquillas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'plancha'
  },
  'trx-funcional': {
    id: 'trx-funcional',
    title: 'Circuito en TRX (Sentadilla + Remo en Suspensión)',
    zone: 'Zona Funcional / Cuerdas TRX Amarillas y Negras',
    muscles: 'Cuerpo completo: Piernas, Espalda, Brazos y Abdomen',
    howToSpot: 'Correas amarillas y negras con dos agarres colgadas de la estructura metálica en la zona funcional.',
    setup: 'Agarra las dos manetas mirando hacia el punto de anclaje con los brazos estirados.',
    steps: [
      'Sentadilla TRX: Baja el culo hacia los talones sujetándote a las correas para mantener la espalda recta y sube.',
      'Remo TRX: Da medio paso adelante, deja el cuerpo recto inclinado hacia atrás y tira con los brazos llevando el pecho hacia tus manos.'
    ],
    adanTip: 'En el TRX tú decides la intensidad: cuanto más adelantes los pies hacia el anclaje, más pesa; cuanto más atrás, más suave.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Suspension_training.jpg/640px-Suspension_training.jpg',
    animType: 'remo'
  },
  'flexiones-casa': {
    id: 'flexiones-casa',
    title: 'Flexiones de Brazos (En Suelo o Apoyado en Sofá/Mesa)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Pecho, Hombros, Tríceps y Abdomen',
    howToSpot: 'Sin material: usa una alfombra en el suelo o apoya las manos en el borde del sofá/escritorio para hacerlas más accesibles.',
    setup: 'Manos un poco más abiertas que la anchura de tus hombros y cuerpo totalmente recto de cabeza a talones.',
    steps: [
      'Dobla los codos bajando el pecho de forma controlada en 2 segundos.',
      'Empuja fuerte contra el suelo/sofá soltando el aire hasta estirar los brazos.'
    ],
    adanTip: 'No abras los codos del todo en forma de T; llévalos un poco hacia atrás (en forma de flecha) para cuidar tus hombros.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Pushups.jpg/640px-Pushups.jpg',
    animType: 'press-pecho'
  },
  'sentadillas-casa': {
    id: 'sentadillas-casa',
    title: 'Sentadillas y Zancadas al Aire',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Piernas completas, Glúteos y Quema Calórica',
    howToSpot: 'Sin material: ponte de pie con espacio libre delante.',
    setup: 'Pies a la anchura de los hombros con las puntas ligeramente hacia fuera.',
    steps: [
      'Echa la cadera hacia atrás y abajo como si fueras a sentarte en una silla invisible.',
      'Empuja el suelo con los talones para volver a subir apretando el glúteo.'
    ],
    adanTip: 'Al bajar, extiende los brazos hacia delante para mantener el equilibrio y la espalda bien erguida.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/512px-Squats.svg.png',
    animType: 'prensa'
  }
};

// Función para encontrar la guía visual de cualquier ejercicio por su nombre o ID
export function resolveExerciseVisual(exNameOrId = '', machineName = '') {
  if (EXERCISE_VISUAL_CATALOG[exNameOrId]) return EXERCISE_VISUAL_CATALOG[exNameOrId];
  const s = `${exNameOrId} ${machineName}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (s.includes('prensa')) return EXERCISE_VISUAL_CATALOG['prensa'];
  if (s.includes('jalon') || s.includes('polea alta')) return EXERCISE_VISUAL_CATALOG['jalon-pecho'];
  if (s.includes('press de pecho') || s.includes('maquina de pecho')) return EXERCISE_VISUAL_CATALOG['press-pecho'];
  if (s.includes('cuadriceps')) return EXERCISE_VISUAL_CATALOG['extension-cuadriceps'];
  if (s.includes('femoral')) return EXERCISE_VISUAL_CATALOG['curl-femoral'];
  if (s.includes('abductor') || s.includes('aductor')) return EXERCISE_VISUAL_CATALOG['abductores'];
  if (s.includes('remo') && !s.includes('trx')) return EXERCISE_VISUAL_CATALOG['remo-polea'];
  if (s.includes('contractora') || s.includes('mariposa') || s.includes('pec deck')) return EXERCISE_VISUAL_CATALOG['contractora'];
  if (s.includes('hombro')) return EXERCISE_VISUAL_CATALOG['press-hombro'];
  if (s.includes('triceps') || s.includes('biceps') || s.includes('poleas')) return EXERCISE_VISUAL_CATALOG['polea-triceps-biceps'];
  if (s.includes('trx')) return EXERCISE_VISUAL_CATALOG['trx-funcional'];
  if (s.includes('eliptica') || s.includes('bici') || s.includes('spinning') || s.includes('clase')) return EXERCISE_VISUAL_CATALOG['eliptica'];
  if (s.includes('cinta') || s.includes('caminata')) return EXERCISE_VISUAL_CATALOG['cinta'];
  if (s.includes('flexion')) return EXERCISE_VISUAL_CATALOG['flexiones-casa'];
  if (s.includes('sentadilla') || s.includes('zancada')) return EXERCISE_VISUAL_CATALOG['sentadillas-casa'];
  if (s.includes('plancha') || s.includes('puente') || s.includes('abdominal') || s.includes('colchoneta')) return EXERCISE_VISUAL_CATALOG['colchoneta-abdomen'];
  return EXERCISE_VISUAL_CATALOG['prensa'];
}

// Reproductor visual animado del movimiento (funciona 100% siempre, incluso sin cobertura en el gimnasio)
function AnimatedExerciseDiagram({ animType }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '14px',
      padding: '0.85rem',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes gymPushLeg {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(34px); }
        }
        @keyframes gymPullDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(32px); }
        }
        @keyframes gymPushForward {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(30px); }
        }
        @keyframes gymKickUp {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-42deg); }
        }
        @keyframes gymCurlBack {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(40deg); }
        }
        @keyframes gymOpenLegs {
          0%, 100% { transform: scaleX(0.75); }
          50% { transform: scaleX(1.22); }
        }
        @keyframes gymRowPull {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-28px); }
        }
        @keyframes gymPressUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes gymPulseCore {
          0%, 100% { opacity: 0.45; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes gymStackMove {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#10b981', color: '#052e16', padding: '0.15rem 0.55rem', borderRadius: '999px' }}>
          🎥 DEMO EN MOVIMIENTO (EN BUCLE)
        </span>
        <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>
          🟢 Zona muscular activa
        </span>
      </div>

      <svg viewBox="0 0 320 155" style={{ width: '100%', height: '150px', display: 'block' }}>
        {/* Suelo de la sala */}
        <line x1="15" y1="140" x2="305" y2="140" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

        {/* Torre de placas de peso común en máquinas */}
        <g>
          <rect x="255" y="30" width="32" height="110" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
          <g style={{ animation: 'gymStackMove 2.4s ease-in-out infinite' }}>
            <rect x="259" y="55" width="24" height="8" rx="2" fill="#10b981" />
            <rect x="259" y="66" width="24" height="8" rx="2" fill="#10b981" />
            <rect x="259" y="77" width="24" height="8" rx="2" fill="#059669" />
            <line x1="271" y1="30" x2="271" y2="55" stroke="#94a3b8" strokeWidth="2" />
          </g>
          <text x="271" y="24" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="bold">PLACAS</text>
        </g>

        {/* PRENSA DE PIERNAS */}
        {animType === 'prensa' && (
          <g>
            {/* Respaldo inclinado */}
            <line x1="45" y1="65" x2="85" y2="120" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <line x1="85" y1="120" x2="115" y2="115" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            {/* Torso y cabeza */}
            <circle cx="58" cy="52" r="11" fill="#e2e8f0" />
            <line x1="63" y1="64" x2="92" y2="112" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            {/* Muslo activo (verde) y plataforma que se empuja */}
            <g style={{ animation: 'gymPushLeg 2.4s ease-in-out infinite' }}>
              <line x1="92" y1="112" x2="132" y2="82" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
              <line x1="132" y1="82" x2="178" y2="95" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              {/* Plataforma metálica */}
              <line x1="182" y1="62" x2="174" y2="122" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
              <text x="195" y="55" fill="#fbbf24" fontSize="10" fontWeight="bold">Empuja con talones →</text>
            </g>
          </g>
        )}

        {/* JALÓN AL PECHO */}
        {animType === 'jalon' && (
          <g>
            {/* Estructura superior polea */}
            <line x1="125" y1="18" x2="255" y2="18" stroke="#64748b" strokeWidth="5" />
            {/* Banco y rodillos */}
            <rect x="95" y="105" width="45" height="8" rx="3" fill="#64748b" />
            <circle cx="135" cy="95" r="6" fill="#f59e0b" />
            {/* Cuerpo sentado */}
            <circle cx="115" cy="56" r="10" fill="#e2e8f0" />
            <line x1="115" y1="68" x2="115" y2="105" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Barra y brazos bajando al pecho */}
            <g style={{ animation: 'gymPullDown 2.4s ease-in-out infinite' }}>
              <line x1="125" y1="18" x2="125" y2="42" stroke="#94a3b8" strokeWidth="2" />
              <line x1="85" y1="42" x2="165" y2="42" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <line x1="92" y1="42" x2="112" y2="75" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <line x1="158" y1="42" x2="120" y2="75" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <text x="172" y="46" fill="#fbbf24" fontSize="10" fontWeight="bold">↓ Baja al pecho</text>
            </g>
          </g>
        )}

        {/* PRESS DE PECHO */}
        {animType === 'press-pecho' && (
          <g>
            {/* Respaldo vertical */}
            <line x1="75" y1="40" x2="75" y2="135" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <circle cx="92" cy="54" r="10" fill="#e2e8f0" />
            {/* Torso con pectoral iluminado */}
            <line x1="90" y1="66" x2="90" y2="110" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <circle cx="98" cy="78" r="9" fill="#10b981" />
            {/* Brazos y manetas empujando hacia delante */}
            <g style={{ animation: 'gymPushForward 2.4s ease-in-out infinite' }}>
              <line x1="95" y1="76" x2="148" y2="76" stroke="#10b981" strokeWidth="9" strokeLinecap="round" />
              <line x1="150" y1="30" x2="150" y2="95" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <text x="160" y="72" fill="#fbbf24" fontSize="10" fontWeight="bold">Empuja al frente →</text>
            </g>
          </g>
        )}

        {/* EXTENSIÓN DE CUÁDRICEPS */}
        {animType === 'cuadriceps' && (
          <g>
            {/* Silla */}
            <line x1="75" y1="45" x2="75" y2="135" stroke="#64748b" strokeWidth="7" />
            <line x1="75" y1="98" x2="130" y2="98" stroke="#64748b" strokeWidth="7" />
            <circle cx="92" cy="50" r="10" fill="#e2e8f0" />
            <line x1="90" y1="62" x2="90" y2="95" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            {/* Muslo activo en verde */}
            <line x1="90" y1="95" x2="132" y2="95" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Pierna que sube con el rodillo */}
            <g style={{ transformOrigin: '132px 95px', animation: 'gymKickUp 2.4s ease-in-out infinite' }}>
              <line x1="132" y1="95" x2="142" y2="134" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              <circle cx="146" cy="128" r="7" fill="#f59e0b" />
            </g>
            <text x="155" y="78" fill="#fbbf24" fontSize="10" fontWeight="bold">↑ Estira y aguanta 1s</text>
          </g>
        )}

        {/* CURL FEMORAL */}
        {animType === 'femoral' && (
          <g>
            {/* Silla */}
            <line x1="75" y1="45" x2="75" y2="135" stroke="#64748b" strokeWidth="7" />
            <line x1="75" y1="95" x2="130" y2="95" stroke="#64748b" strokeWidth="7" />
            <circle cx="92" cy="50" r="10" fill="#e2e8f0" />
            <line x1="90" y1="62" x2="90" y2="92" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            {/* Parte trasera del muslo activa */}
            <line x1="90" y1="94" x2="132" y2="94" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Pierna que dobla hacia atrás */}
            <g style={{ transformOrigin: '132px 94px', animation: 'gymCurlBack 2.4s ease-in-out infinite' }}>
              <line x1="132" y1="94" x2="178" y2="98" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              <circle cx="174" cy="105" r="7" fill="#f59e0b" />
            </g>
            <text x="148" y="72" fill="#fbbf24" fontSize="10" fontWeight="bold">↙ Dobla hacia abajo</text>
          </g>
        )}

        {/* MÁQUINA DE ABDUCTORES (VISTA SUPERIOR / FRONTAL ABRIENDO PIERNAS) */}
        {animType === 'abductores' && (
          <g>
            <rect x="95" y="40" width="70" height="25" rx="6" fill="#64748b" />
            <circle cx="130" cy="52" r="11" fill="#e2e8f0" />
            <g style={{ transformOrigin: '130px 65px', animation: 'gymOpenLegs 2.4s ease-in-out infinite' }}>
              {/* Glúteos y piernas abriendo contra las almohadillas */}
              <line x1="118" y1="65" x2="88" y2="122" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <line x1="142" y1="65" x2="172" y2="122" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <rect x="72" y="96" width="10" height="24" rx="4" fill="#f59e0b" />
              <rect x="178" y="96" width="10" height="24" rx="4" fill="#f59e0b" />
            </g>
            <text x="130" y="135" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">← Abre y aguanta 1s →</text>
          </g>
        )}

        {/* REMO EN POLEA / TRX */}
        {animType === 'remo' && (
          <g>
            <rect x="65" y="112" width="120" height="8" rx="3" fill="#64748b" />
            <circle cx="95" cy="52" r="10" fill="#e2e8f0" />
            {/* Espalda recta activa en verde */}
            <line x1="95" y1="64" x2="95" y2="110" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            {/* Piernas apoyadas */}
            <line x1="95" y1="110" x2="165" y2="105" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            {/* Cable y brazos tirando hacia el abdomen */}
            <g style={{ animation: 'gymRowPull 2.4s ease-in-out infinite' }}>
              <line x1="125" y1="84" x2="225" y2="84" stroke="#94a3b8" strokeWidth="3" />
              <line x1="95" y1="74" x2="132" y2="84" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
              <circle cx="132" cy="84" r="6" fill="#f59e0b" />
            </g>
            <text x="140" y="65" fill="#fbbf24" fontSize="10" fontWeight="bold">← Tira hacia el ombligo</text>
          </g>
        )}

        {/* CONTRACTORA PECTORAL */}
        {animType === 'contractora' && (
          <g>
            <circle cx="130" cy="50" r="11" fill="#e2e8f0" />
            <rect x="112" y="64" width="36" height="45" rx="8" fill="#10b981" />
            <g style={{ transformOrigin: '130px 75px', animation: 'gymOpenLegs 2.4s ease-in-out infinite' }}>
              <line x1="112" y1="75" x2="72" y2="88" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />
              <line x1="148" y1="75" x2="188" y2="88" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />
              <circle cx="72" cy="88" r="7" fill="#f59e0b" />
              <circle cx="188" cy="88" r="7" fill="#f59e0b" />
            </g>
            <text x="130" y="132" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">→ Junta los brazos delante ←</text>
          </g>
        )}

        {/* PRESS DE HOMBROS */}
        {animType === 'press-hombro' && (
          <g>
            <line x1="95" y1="55" x2="95" y2="135" stroke="#64748b" strokeWidth="7" />
            <circle cx="115" cy="68" r="10" fill="#e2e8f0" />
            <line x1="115" y1="80" x2="115" y2="122" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            {/* Hombro activo */}
            <circle cx="115" cy="82" r="8" fill="#10b981" />
            <g style={{ animation: 'gymPressUp 2.4s ease-in-out infinite' }}>
              <line x1="115" y1="82" x2="115" y2="48" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
              <circle cx="115" cy="44" r="6" fill="#f59e0b" />
              <text x="132" y="52" fill="#fbbf24" fontSize="10" fontWeight="bold">↑ Empuja hacia arriba</text>
            </g>
          </g>
        )}

        {/* POLEA BRAZOS (TRÍCEPS / BÍCEPS) */}
        {animType === 'polea-brazos' && (
          <g>
            <circle cx="110" cy="46" r="10" fill="#e2e8f0" />
            <line x1="110" y1="58" x2="110" y2="105" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <line x1="110" y1="105" x2="110" y2="138" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            {/* Codo pegado al cuerpo y antebrazo moviendo la polea */}
            <line x1="110" y1="62" x2="115" y2="85" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            <g style={{ transformOrigin: '115px 85px', animation: 'gymCurlBack 2.2s ease-in-out infinite' }}>
              <line x1="115" y1="85" x2="148" y2="75" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="150" cy="75" r="5" fill="#f59e0b" />
            </g>
            <text x="135" y="118" fill="#fbbf24" fontSize="10" fontWeight="bold">Codos fijos pegados al cuerpo</text>
          </g>
        )}

        {/* CINTA / ELÍPTICA / PLANCHA */}
        {(animType === 'cardio-cinta' || animType === 'cardio-eliptica' || animType === 'plancha') && (
          <g>
            {animType === 'plancha' ? (
              <>
                <circle cx="75" cy="88" r="10" fill="#e2e8f0" />
                <line x1="85" y1="94" x2="185" y2="118" stroke="#10b981" strokeWidth="12" strokeLinecap="round" style={{ animation: 'gymPulseCore 2s ease-in-out infinite' }} />
                <line x1="88" y1="96" x2="88" y2="135" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                <line x1="185" y1="118" x2="195" y2="135" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                <text x="135" y="72" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Abdomen y glúteo firmes en línea recta</text>
              </>
            ) : (
              <>
                {/* Plataforma inclinada de cinta/elíptica */}
                <line x1="55" y1="135" x2="210" y2="112" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
                <line x1="195" y1="114" x2="205" y2="48" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                <circle cx="135" cy="48" r="10" fill="#e2e8f0" />
                <line x1="135" y1="60" x2="132" y2="96" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
                <g style={{ transformOrigin: '132px 96px', animation: 'gymKickUp 1.4s ease-in-out infinite' }}>
                  <line x1="132" y1="96" x2="118" y2="124" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                </g>
                <g style={{ transformOrigin: '132px 96px', animation: 'gymCurlBack 1.4s ease-in-out infinite' }}>
                  <line x1="132" y1="96" x2="152" y2="120" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                </g>
                <text x="125" y="30" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">🔥 Ritmo constante · Cuesta 6-8%</text>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

export default function ExerciseVisualModal({ exerciseKeyOrName, machineName, onClose }) {
  const [imgError, setImgError] = useState(false);

  if (!exerciseKeyOrName) return null;
  const info = resolveExerciseVisual(exerciseKeyOrName, machineName);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.85rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.15rem',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Cabecera del modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', background: '#ecfdf5', padding: '0.18rem 0.55rem', borderRadius: '999px' }}>
              📍 {info.zone}
            </span>
            <h3 style={{ margin: '0.35rem 0 0.1rem 0', fontSize: '1.08rem', fontWeight: 900, color: '#0f172a' }}>
              {info.title}
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>
              🎯 Trabaja: {info.muscles}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>

        {/* 1. Animación del movimiento en tiempo real */}
        <AnimatedExerciseDiagram animType={info.animType} />

        {/* 2. Foto real / ilustración anatómica de la máquina */}
        {!imgError && info.photoUrl && (
          <div style={{
            marginTop: '0.75rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.6rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              📸 Imagen de referencia de la máquina / ejercicio
            </div>
            <img
              src={info.photoUrl}
              alt={info.title}
              onError={() => setImgError(true)}
              style={{
                maxHeight: '190px',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '10px',
                background: '#ffffff'
              }}
            />
          </div>
        )}

        {/* 3. Cómo reconocer la máquina al entrar al Gimnasio Marbella */}
        <div style={{
          marginTop: '0.75rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '0.7rem 0.85rem'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.2rem' }}>
            👀 ¿Qué máquina busco en el Gimnasio Marbella?
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1e3a8a', lineHeight: 1.4 }}>
            {info.howToSpot}
          </div>
        </div>

        {/* 4. Ajuste y Paso a Paso explicado por Adán */}
        <div style={{
          marginTop: '0.65rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '0.75rem 0.85rem'
        }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            ⚙️ Antes de empezar (Ajuste del asiento):
          </div>
          <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '0.6rem', lineHeight: 1.38 }}>
            {info.setup}
          </div>

          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
            📋 Cómo hacer cada repetición:
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.38 }}>
            {info.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        </div>

        {/* 5. El truco de Adán */}
        <div style={{
          marginTop: '0.65rem',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '0.65rem 0.85rem',
          fontSize: '0.78rem',
          color: '#065f46',
          lineHeight: 1.38
        }}>
          <strong>🧑‍🏫 Consejo de Adán:</strong> {info.adanTip}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: '0.85rem',
            width: '100%',
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          ✓ ¡Entendido, vamos a por la serie!
        </button>
      </div>
    </div>
  );
}
