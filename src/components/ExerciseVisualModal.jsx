import React, { useState, useEffect } from 'react';

const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Catálogo visual con fotos reales verificadas (Posición Inicial 0.jpg + Posición Final 1.jpg) para los 25 ejercicios
export const EXERCISE_VISUAL_CATALOG = {
  'prensa': {
    id: 'prensa',
    title: 'Prensa de Piernas Sentado (Leg Press)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Cuádriceps (muslos), Glúteos e Isquiotibiales',
    imgStart: `${IMG_BASE}/Leg_Press/0.jpg`,
    imgEnd: `${IMG_BASE}/Leg_Press/1.jpg`,
    startCaption: '1️⃣ Inicio: Rodillas dobladas a 90°, pies apoyados en la plataforma y espalda bien pegada.',
    endCaption: '2️⃣ Empuje: Empuja con los TALONES hasta estirar casi del todo (sin bloquear rodillas).',
    howToSpot: 'Busca un asiento reclinado frente a una plataforma grande metálica rugosa donde se apoyan los pies, conectada a una torre de placas o discos.',
    setup: 'Ajusta el asiento para que al apoyar los pies tus rodillas formen 90 grados sin que se levante el glúteo del respaldo.',
    steps: [
      'Apoya los dos pies en la plataforma a la anchura de tus hombros (más arriba si quieres enfocar más el glúteo).',
      'Empuja la plataforma con los TALONES extendiendo las piernas sin dar golpe seco en las rodillas.',
      'Dobla las rodillas despacio en 2 segundos controlando el peso al volver.'
    ],
    adanTip: 'Nunca bloquees las rodillas del todo arriba; déjalas siempre un pelín flexionadas para proteger la articulación.'
  },
  'jalon-pecho': {
    id: 'jalon-pecho',
    title: 'Jalón al Pecho en Polea Alta (Lat Pulldown)',
    zone: 'Zona de Espalda / Torres de Poleas',
    muscles: 'Espalda ancha en V (Dorsales), Hombros posteriores y Bíceps',
    imgStart: `${IMG_BASE}/Wide-Grip_Lat_Pulldown/0.jpg`,
    imgEnd: `${IMG_BASE}/Wide-Grip_Lat_Pulldown/1.jpg`,
    startCaption: '1️⃣ Inicio: Sentado con muslos encajados bajo los rodillos y brazos estirados arriba.',
    endCaption: '2️⃣ Tirón: Saca pecho y baja la barra por delante hasta la clavícula llevando codos abajo.',
    howToSpot: 'Máquina alta con una barra larga horizontal colgada de un cable arriba y un asiento con dos rodillos acolchados para los muslos.',
    setup: 'Pon el pincho en tu peso, agarra la barra algo más ancho que tus hombros y encaja las piernas bajo los rodillos.',
    steps: [
      'Saca pecho e inclina la espalda solo un poquito hacia atrás.',
      'Tira de la barra hacia abajo llevando los codos hacia tus costillas hasta tocar la parte alta del pecho.',
      'Sube los brazos despacio controlando el cable hasta estirar bien los dorsales.'
    ],
    adanTip: 'Baja siempre la barra por delante hacia el pecho, ¡nunca por detrás de la nuca!'
  },
  'press-pecho': {
    id: 'press-pecho',
    title: 'Press de Pecho Sentado en Máquina (Chest Press)',
    zone: 'Zona de Pecho y Torso',
    muscles: 'Pectoral, Parte frontal del Hombro y Tríceps',
    imgStart: `${IMG_BASE}/Leverage_Chest_Press/0.jpg`,
    imgEnd: `${IMG_BASE}/Leverage_Chest_Press/1.jpg`,
    startCaption: '1️⃣ Inicio: Espalda y hombros pegados al respaldo, agarres a la altura de la mitad del pecho.',
    endCaption: '2️⃣ Empuje: Extiende los brazos hacia delante apretando el pecho y vuelve despacio.',
    howToSpot: 'Sillón vertical con respaldo alto y dos brazos con agarres a los lados de tu pecho que se empujan hacia delante.',
    setup: 'Regula la altura del asiento para que los agarres queden a la altura media del pecho (no en el cuello).',
    steps: [
      'Pega bien la espalda y los hombros contra el respaldo.',
      'Empuja los agarres hacia delante soltando el aire hasta estirar los brazos.',
      'Vuelve despacio en 2 segundos sintiendo cómo se estira el pecho sin que las placas choquen.'
    ],
    adanTip: 'Al empujar, mantén los hombros pegados atrás contra el respaldo para que trabaje el pectoral al 100%.'
  },
  'extension-cuadriceps': {
    id: 'extension-cuadriceps',
    title: 'Extensión de Cuádriceps Sentado (Leg Extension)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Cuádriceps (parte frontal del muslo y firmeza de rodilla)',
    imgStart: `${IMG_BASE}/Leg_Extensions/0.jpg`,
    imgEnd: `${IMG_BASE}/Leg_Extensions/1.jpg`,
    startCaption: '1️⃣ Inicio: Sentado con el rodillo acolchado apoyado justo encima de los tobillos.',
    endCaption: '2️⃣ Extensión: Estira las piernas hasta arriba, aguanta 1 segundo apretando muslo y baja.',
    howToSpot: 'Silla con respaldo y un rodillo acolchado abajo que queda apoyado delante de tus espinillas/tobillos.',
    setup: 'Ajusta el respaldo para que la parte trasera de tu rodilla quede apoyada en el borde del asiento.',
    steps: [
      'Sujétate a los agarres laterales del asiento para no levantar la cadera.',
      'Estira las dos piernas hacia arriba hasta que queden horizontales y aguanta 1 segundo apretando el muslo.',
      'Baja despacio en 2 segundos sin soltar el peso de golpe.'
    ],
    adanTip: 'Esa pausa de 1 segundo arriba del todo es la clave para definir y endurecer el cuádriceps.'
  },
  'curl-femoral': {
    id: 'curl-femoral',
    title: 'Curl Femoral Sentado en Máquina (Seated Leg Curl)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Isquiotibiales (parte trasera del muslo) y Glúteo',
    imgStart: `${IMG_BASE}/Seated_Leg_Curl/0.jpg`,
    imgEnd: `${IMG_BASE}/Seated_Leg_Curl/1.jpg`,
    startCaption: '1️⃣ Inicio: Piernas estiradas con el talón/tendón de Aquiles apoyado sobre el rodillo inferior.',
    endCaption: '2️⃣ Flexión: Dobla las rodillas tirando del rodillo hacia abajo/atrás todo lo que puedas.',
    howToSpot: 'Silla con rodillo donde apoyas la parte trasera de los tobillos para doblar las piernas hacia abajo/atrás.',
    setup: 'Coloca el rodillo justo en la parte baja del gemelo / talón de Aquiles y ajusta el tope sobre los muslos.',
    steps: [
      'Dobla las rodillas tirando del rodillo con los talones hacia atrás/abajo todo lo que puedas.',
      'Aprieta 1 segundo la parte trasera del muslo.',
      'Estira las piernas despacio en 2 segundos controlando el regreso.'
    ],
    adanTip: 'Mantén las puntas de los pies mirando hacia tus espinillas para activar el doble el femoral.'
  },
  'abductores': {
    id: 'abductores',
    title: 'Máquina de Abductores Sentado (Abrir Piernas · Glúteo)',
    zone: 'Zona de Pierna y Glúteo',
    muscles: 'Glúteo medio, Glúteo mayor y Cadera',
    imgStart: `${IMG_BASE}/Thigh_Abductor/0.jpg`,
    imgEnd: `${IMG_BASE}/Thigh_Abductor/1.jpg`,
    startCaption: '1️⃣ Inicio: Sentado con la parte externa de las rodillas apoyada en las almohadillas cerradas.',
    endCaption: '2️⃣ Apertura: Abre las piernas empujando con las rodillas hacia fuera y aguanta 1 segundo.',
    howToSpot: 'Silla con dos almohadillas laterales giratorias donde apoyas la parte externa de las rodillas/muslos.',
    setup: 'Junta las almohadillas con la palanca lateral antes de empezar para tener buen recorrido al abrir.',
    steps: [
      'Siéntate con la espalda apoyada.',
      'Abre las piernas empujando con la parte externa de las rodillas y aguanta 1 segundo abierto.',
      'Cierra despacio sin que reboten las placas.'
    ],
    adanTip: 'Haz una pausa de 1 segundo con las piernas abiertas en cada repetición.'
  },
  'remo-polea': {
    id: 'remo-polea',
    title: 'Remo Sentado en Polea Baja (Remo Gironda)',
    zone: 'Zona de Espalda / Poleas',
    muscles: 'Espalda media (postura), Dorsales y Bíceps',
    imgStart: `${IMG_BASE}/Seated_Cable_Rows/0.jpg`,
    imgEnd: `${IMG_BASE}/Seated_Cable_Rows/1.jpg`,
    startCaption: '1️⃣ Inicio: Pies en las plataformas, rodillas semi-flexionadas, espalda recta y brazos estirados.',
    endCaption: '2️⃣ Remo: Tira del agarre hacia el ombligo sacando pecho y juntando los omóplatos atrás.',
    howToSpot: 'Banco largo bajo con dos apoyos metálicos para los pies enfrente y un cable bajo con agarre doble en V.',
    setup: 'Apoya los pies, dobla un poquito las rodillas y pon la espalda totalmente recta.',
    steps: [
      'Con el pecho fuera y hombros bajos, tira del agarre hacia tu abdomen.',
      'Junta las escápulas (omóplatos) atrás durante 1 segundo.',
      'Extiende los brazos hacia delante despacio sin encorvar la zona lumbar.'
    ],
    adanTip: 'No balancees la espalda adelante y atrás; deja el tronco firme y tira con los codos.'
  },
  'contractora': {
    id: 'contractora',
    title: 'Contractora Pectoral / Mariposa (Pec Deck)',
    zone: 'Zona de Pecho',
    muscles: 'Pectoral mayor (firmeza y línea central del pecho)',
    imgStart: `${IMG_BASE}/Butterfly/0.jpg`,
    imgEnd: `${IMG_BASE}/Butterfly/1.jpg`,
    startCaption: '1️⃣ Inicio: Brazos abiertos a los lados apoyados en los cojines o agarres a altura del pecho.',
    endCaption: '2️⃣ Cierre: Junta los dos brazos delante del pecho como un abrazo y aprieta 1 segundo.',
    howToSpot: 'Asiento vertical con dos brazos largos articulados a los lados que se cierran hacia delante.',
    setup: 'Ajusta el asiento para que tus codos queden ligeramente por debajo de la línea de los hombros.',
    steps: [
      'Apoya bien la espalda en el respaldo.',
      'Junta los dos brazos delante de tu pecho y aguanta 1 segundo apretando el pectoral.',
      'Abre despacio hasta notar un estiramiento cómodo en el pecho.'
    ],
    adanTip: 'Concéntrate en juntar los codos delante del pecho, no solo las manos.'
  },
  'press-hombro': {
    id: 'press-hombro',
    title: 'Press de Hombros Sentado en Máquina (Shoulder Press)',
    zone: 'Zona de Hombros y Brazos',
    muscles: 'Hombros redondos (Deltoides) y Tríceps',
    imgStart: `${IMG_BASE}/Machine_Shoulder_Military_Press/0.jpg`,
    imgEnd: `${IMG_BASE}/Machine_Shoulder_Military_Press/1.jpg`,
    startCaption: '1️⃣ Inicio: Espalda pegada al respaldo y agarres a la altura de las orejas/hombros.',
    endCaption: '2️⃣ Empuje: Empuja hacia el techo hasta estirar casi del todo los brazos sobre la cabeza.',
    howToSpot: 'Silla con respaldo vertical y dos agarres que parten desde la altura de los hombros y suben al techo.',
    setup: 'Regula el asiento para que en la posición inicial los agarres queden a la altura de tu barbilla u orejas.',
    steps: [
      'Sujeta los agarres con la espalda bien pegada al respaldo.',
      'Empuja hacia arriba hasta estirar los brazos sobre la cabeza.',
      'Baja despacio en 2 segundos hasta la altura de las orejas.'
    ],
    adanTip: 'Mantén el abdomen apretado para no arquear la espalda baja al empujar.'
  },
  'triceps-polea': {
    id: 'triceps-polea',
    title: 'Extensión de Tríceps en Polea Alta (Con Cuerda o Barra)',
    zone: 'Estación Multipoleas',
    muscles: 'Tríceps completo (da el 60% del tamaño del brazo)',
    imgStart: `${IMG_BASE}/Triceps_Pushdown_-_Rope_Attachment/0.jpg`,
    imgEnd: `${IMG_BASE}/Triceps_Pushdown_-_Rope_Attachment/1.jpg`,
    startCaption: '1️⃣ Inicio: De pie frente a la polea alta, codos pegados a las costillas a 90 grados.',
    endCaption: '2️⃣ Extensión: Empuja la cuerda hacia abajo estirando el brazo a tope sin despegar los codos.',
    howToSpot: 'Torre de cables donde enganchas la cuerda doble negra o una barra corta en la polea de arriba.',
    setup: 'Ponte de pie frente a la polea alta, da medio paso atrás e inclina el torso solo un pelín hacia delante.',
    steps: [
      'Clava los codos pegados a tus costillas (solo se mueven los antebrazos).',
      'Empuja la cuerda hacia tus muslos hasta estirar los brazos por completo, abriendo un poco las manos al final.',
      'Sube despacio controlando el peso hasta los 90 grados.'
    ],
    adanTip: 'Abrir la cuerda abajo del todo y apretar 1 segundo hace que el tríceps se hinche al máximo.'
  },
  'biceps-polea-mancuerna': {
    id: 'biceps-polea-mancuerna',
    title: 'Curl de Bíceps (Con Mancuernas o en Polea Baja)',
    zone: 'Zona de Mancuernas / Polea Baja',
    muscles: 'Bíceps braquial (pico y volumen frontal del brazo)',
    imgStart: `${IMG_BASE}/Dumbbell_Bicep_Curl/0.jpg`,
    imgEnd: `${IMG_BASE}/Dumbbell_Bicep_Curl/1.jpg`,
    startCaption: '1️⃣ Inicio: De pie erguido con brazos estirados abajo y codos pegados al costado.',
    endCaption: '2️⃣ Subida: Dobla los codos subiendo el peso hacia los hombros y aprieta fuerte el bíceps 1s.',
    howToSpot: 'Coge dos mancuernas del rack frente al espejo o usa la polea situada abajo del todo con barra corta.',
    setup: 'De pie con el pecho alto, hombros atrás y los codos pegados a los costados.',
    steps: [
      'Con las palmas mirando hacia arriba, dobla los codos subiendo el peso hacia los hombros.',
      'Aprieta fuerte el bíceps 1 segundo arriba del todo.',
      'Baja despacio en 2 segundos estirando el brazo completo antes de la siguiente repetición.'
    ],
    adanTip: 'No columpies la espalda para subir el peso: deja los codos fijos a los lados del cuerpo.'
  },
  'biceps-martillo': {
    id: 'biceps-martillo',
    title: 'Curl de Bíceps Martillo con Mancuernas (Brazo Ancho)',
    zone: 'Zona de Mancuernas (Frente al espejo)',
    muscles: 'Bíceps, Braquial (ensancha el brazo de frente) y Antebrazo',
    imgStart: `${IMG_BASE}/Hammer_Curls/0.jpg`,
    imgEnd: `${IMG_BASE}/Hammer_Curls/1.jpg`,
    startCaption: '1️⃣ Inicio: Mancuernas a los lados con las palmas mirándose entre sí (agarre neutro).',
    endCaption: '2️⃣ Subida: Sube las mancuernas manteniendo el pulgar hacia arriba como si usaras un martillo.',
    howToSpot: 'Coge un par de mancuernas frente al espejo.',
    setup: 'Sujeta las mancuernas con las palmas enfrentadas durante todo el recorrido.',
    steps: [
      'Con los codos pegados al costado, sube las mancuernas hacia los hombros manteniendo las palmas enfrentadas.',
      'Aguanta 1 segundo arriba apretando el brazo y el antebrazo.',
      'Baja despacio en 2 segundos sin balancear el torso.'
    ],
    adanTip: 'El curl martillo da muchísimo grosor al brazo visto de frente y fortalece el antebrazo.'
  },
  'crunch-polea-abdomen': {
    id: 'crunch-polea-abdomen',
    title: 'Crunch Abdominal con Peso en Polea Alta (Six-Pack)',
    zone: 'Estación de Poleas / Máquina de Abdomen',
    muscles: 'Recto abdominal superior y medio (Tableta de chocolate con relieve)',
    imgStart: `${IMG_BASE}/Cable_Crunch/0.jpg`,
    imgEnd: `${IMG_BASE}/Cable_Crunch/1.jpg`,
    startCaption: '1️⃣ Inicio: De rodillas frente a la polea alta sujetando la cuerda a los lados de la cabeza.',
    endCaption: '2️⃣ Crunch: Encoge el abdomen llevando los codos hacia las rodillas y soltando todo el aire.',
    howToSpot: 'Engancha la cuerda doble en una polea alta y ponte de rodillas sobre una esterilla.',
    setup: 'De rodillas, sujeta los extremos de la cuerda junto a la frente/sienes y deja la cadera fija arriba.',
    steps: [
      'Sin sentarte sobre los talones, encoge el tronco llevando las costillas hacia la pelvis.',
      'Suelta TODO el aire abajo del todo y aprieta fuerte los abdominales 1 segundo.',
      'Sube despacio estirando el abdomen sin perder la tensión del cable.'
    ],
    adanTip: 'Para sacar los cuadritos ("tableta"), el abdomen necesita peso: encoge la tripa como una persiana, no bajes con la espalda recta.'
  },
  'elevacion-piernas-abdomen': {
    id: 'elevacion-piernas-abdomen',
    title: 'Elevación de Piernas / Rodillas al Pecho (Abdomen Inferior)',
    zone: 'Silla Romana (Apoyabrazos) o Barra',
    muscles: 'Abdomen inferior (zona baja de la barriga) y Core',
    imgStart: `${IMG_BASE}/Hanging_Leg_Raise/0.jpg`,
    imgEnd: `${IMG_BASE}/Hanging_Leg_Raise/1.jpg`,
    startCaption: '1️⃣ Inicio: Apoyado en la silla romana (o colgado) con el torso firme y piernas abajo.',
    endCaption: '2️⃣ Subida: Sube las rodillas/piernas hacia el pecho levantando un poco la pelvis al final.',
    howToSpot: 'Estructura vertical con dos almohadillas para apoyar los antebrazos y respaldo (Silla Romana).',
    setup: 'Apoya bien los antebrazos, sujeta los agarres y mantén los hombros firmes lejos de las orejas.',
    steps: [
      'Sube las rodillas o piernas hacia el pecho enrollando la pelvis hacia arriba al final.',
      'Aguanta 1 segundo arriba apretando la parte baja de la barriga.',
      'Baja las piernas despacio en 2 segundos evitando el balanceo.'
    ],
    adanTip: 'El truco para atacar el abdomen inferior es enrollar un pelín la cadera hacia arriba al subir las rodillas.'
  },
  'elevacion-piernas-suelo': {
    id: 'elevacion-piernas-suelo',
    title: 'Elevación de Piernas Tumbado en Suelo (Abdomen Inferior)',
    zone: 'En Casa (Salón / Despacho) o Colchoneta',
    muscles: 'Abdomen inferior (parte baja de la tableta)',
    imgStart: `${IMG_BASE}/Flat_Bench_Lying_Leg_Raise/0.jpg`,
    imgEnd: `${IMG_BASE}/Flat_Bench_Lying_Leg_Raise/1.jpg`,
    startCaption: '1️⃣ Inicio: Tumbado boca arriba con las manos debajo del glúteo y piernas estiradas.',
    endCaption: '2️⃣ Subida: Eleva las piernas juntas hasta 90° y bájalas lento sin tocar el suelo.',
    howToSpot: 'Tumbado boca arriba sobre una alfombra en casa o esterilla.',
    setup: 'Mete las manos (palmas hacia abajo) justo debajo del borde de tus glúteos para apoyar bien la espalda baja.',
    steps: [
      'Con las piernas juntas, súbelas hasta quedar verticales (90 grados).',
      'Baja las piernas muy despacio en 2-3 segundos sin que los talones descansen en el suelo.',
      'Vuelve a subir apretando fuerte la parte baja de la tripa.'
    ],
    adanTip: 'Mantén la zona lumbar pegada al suelo en todo momento; si te tira la espalda, dobla un poquito las rodillas.'
  },
  'crunch-suelo': {
    id: 'crunch-suelo',
    title: 'Crunch Abdominal en Suelo (Tableta Superior)',
    zone: 'En Casa o Zona de Colchonetas',
    muscles: 'Recto abdominal superior (los 4 cuadros superiores)',
    imgStart: `${IMG_BASE}/Crunches/0.jpg`,
    imgEnd: `${IMG_BASE}/Crunches/1.jpg`,
    startCaption: '1️⃣ Inicio: Tumbado boca arriba con rodillas dobladas, pies en el suelo y manos en las sienes.',
    endCaption: '2️⃣ Crunch: Despega hombros y omóplatos apretando fuerte las costillas hacia el ombligo.',
    howToSpot: 'Tumbado boca arriba con las rodillas flexionadas en alfombra o colchoneta.',
    setup: 'Manos tocando suavemente las sienes o detrás de las orejas (sin tirar nunca del cuello).',
    steps: [
      'Aplasta la zona lumbar contra el suelo y despega los hombros enrollando el abdomen.',
      'Suelta todo el aire arriba y aguanta 1 segundo apretando la tableta al máximo.',
      'Baja despacio sin relajar del todo la tripa.'
    ],
    adanTip: 'Suelta todo el aire por la boca al subir: sin aire dentro, el abdomen se contrae el doble de fuerte.'
  },
  'bicicleta-abdominal': {
    id: 'bicicleta-abdominal',
    title: 'Bicicleta Abdominal / Oblicuos Alternos (Cintura y V Abdominal)',
    zone: 'En Casa o Zona de Colchonetas',
    muscles: 'Oblicuos (laterales del abdomen), Cintura y Abdomen completo',
    imgStart: `${IMG_BASE}/Air_Bike/0.jpg`,
    imgEnd: `${IMG_BASE}/Air_Bike/1.jpg`,
    startCaption: '1️⃣ Lado 1: Lleva un codo hacia la rodilla contraria mientras estiras la otra pierna.',
    endCaption: '2️⃣ Lado 2: Gira el torso de forma controlada para tocar con el otro codo la otra rodilla.',
    howToSpot: 'Tumbado boca arriba en alfombra o esterilla.',
    setup: 'Manos detrás de la cabeza (sin empujar el cuello) y piernas elevadas.',
    steps: [
      'Gira los hombros llevando el codo derecho hacia la rodilla izquierda mientras estiras la pierna derecha.',
      'Cambia de lado llevando el codo izquierdo hacia la rodilla derecha.',
      'Haz cada giro controlando el movimiento 1 segundo en cada cruce.'
    ],
    adanTip: 'Gira todo el hombro y el costado, no muevas solo los codos.'
  },
  'plancha-abdominal': {
    id: 'plancha-abdominal',
    title: 'Plancha Abdominal Isométrica / RKC (Core de Acero)',
    zone: 'Zona de Colchonetas / En Casa',
    muscles: 'Abdomen profundo (reduce cintura), Recto abdominal, Glúteos y Hombros',
    imgStart: `${IMG_BASE}/Plank/0.jpg`,
    imgEnd: `${IMG_BASE}/Plank/1.jpg`,
    startCaption: '1️⃣ Colocación: Apoya los antebrazos justo debajo de los hombros y las puntas de los pies.',
    endCaption: '2️⃣ Tensión RKC: Cuerpo totalmente recto como una tabla apretando abdomen y glúteos al 100%.',
    howToSpot: 'En esterilla o alfombra apoyando los antebrazos y las puntas de los pies.',
    setup: 'Codos justo debajo de los hombros y cuerpo formando una línea recta de la cabeza a los talones.',
    steps: [
      'Esconde el ombligo hacia dentro y aprieta los glúteos y muslos con fuerza.',
      'En versión RKC (dura): aprieta los puños y haz fuerza con los codos hacia tus pies sin moverlos.',
      'Mantén respiraciones cortas mientras corre el cronómetro.'
    ],
    adanTip: 'No dejes que la cadera se hunda hacia el suelo; mantén la tripa dura como una piedra.'
  },
  'puente-gluteo': {
    id: 'puente-gluteo',
    title: 'Puente de Glúteo y Lumbar en Suelo (Glute Bridge)',
    zone: 'Zona de Colchonetas / En Casa',
    muscles: 'Glúteos, Isquiotibiales y Faja Lumbar-Abdominal',
    imgStart: `${IMG_BASE}/Butt_Lift_Bridge/0.jpg`,
    imgEnd: `${IMG_BASE}/Butt_Lift_Bridge/1.jpg`,
    startCaption: '1️⃣ Inicio: Tumbado boca arriba con las rodillas dobladas y talones cerca del glúteo.',
    endCaption: '2️⃣ Subida: Empuja con los talones elevando la cadera hasta alinear rodillas, cadera y hombros.',
    howToSpot: 'Tumbado boca arriba en esterilla o alfombra.',
    setup: 'Brazos apoyados a los lados del cuerpo con las palmas hacia abajo.',
    steps: [
      'Empuja el suelo con los talones subiendo la cadera hasta formar una línea recta.',
      'Aprieta fuerte el glúteo y el abdomen 1 segundo arriba.',
      'Baja de forma controlada.'
    ],
    adanTip: 'Ideal para activar glúteo y descargar la zona lumbar.'
  },
  'flexiones-cerradas': {
    id: 'flexiones-cerradas',
    title: 'Flexiones Cerradas / Diamante (Foco Tríceps, Brazos y Pecho)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Tríceps (hincha el brazo), Pectoral interno y Hombro frontal',
    imgStart: `${IMG_BASE}/Pushups_Close_and_Wide_Hand_Positions/0.jpg`,
    imgEnd: `${IMG_BASE}/Pushups_Close_and_Wide_Hand_Positions/1.jpg`,
    startCaption: '1️⃣ Inicio: Cuerpo recto en plancha con las manos más juntas (debajo del pecho).',
    endCaption: '2️⃣ Bajada y Empuje: Baja pegando los codos a las costillas y empuja fuerte arriba.',
    howToSpot: 'En el suelo sobre alfombra (puedes apoyar rodillas en las últimas repeticiones si llegas al fallo).',
    setup: 'Coloca las manos a la anchura de los hombros o un poco más cerradas.',
    steps: [
      'Baja el pecho hacia las manos manteniendo los codos pegados a los costados del cuerpo.',
      'Empuja el suelo con fuerza estirando los brazos y apretando el tríceps arriba.',
      'Mantén el abdomen apretado todo el tiempo.'
    ],
    adanTip: 'Al pegar los codos al cuerpo en vez de abrirlos, tus tríceps trabajan el doble y el brazo se congestiona muchísimo.'
  },
  'flexiones-casa': {
    id: 'flexiones-casa',
    title: 'Flexiones de Brazos Clásicas (Push-Ups)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Pecho completo, Hombros, Tríceps y Core',
    imgStart: `${IMG_BASE}/Pushups/0.jpg`,
    imgEnd: `${IMG_BASE}/Pushups/1.jpg`,
    startCaption: '1️⃣ Inicio: Brazos estirados con manos algo más anchas que los hombros y cuerpo recto.',
    endCaption: '2️⃣ Bajada: Dobla los codos bajando el pecho casi hasta el suelo y empuja con fuerza.',
    howToSpot: 'En el suelo sobre alfombra (o con manos en el borde del sofá si necesitas hacerlo más suave).',
    setup: 'Manos un poco más abiertas que los hombros y cuerpo recto de cabeza a talones.',
    steps: [
      'Dobla los codos en ángulo de 45 grados (forma de flecha) bajando el pecho en 2 segundos.',
      'Empuja fuerte contra el suelo soltando el aire hasta estirar los brazos.'
    ],
    adanTip: 'Aprieta glúteo y abdomen para que tu cuerpo suba y baje como un bloque sólido.'
  },
  'sentadillas-casa': {
    id: 'sentadillas-casa',
    title: 'Sentadillas al Aire (Bodyweight Squat)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Cuádriceps, Glúteos y Activación Metabólica',
    imgStart: `${IMG_BASE}/Bodyweight_Squat/0.jpg`,
    imgEnd: `${IMG_BASE}/Bodyweight_Squat/1.jpg`,
    startCaption: '1️⃣ Inicio: De pie con los pies a la anchura de los hombros y brazos al frente.',
    endCaption: '2️⃣ Bajada: Lleva la cadera atrás y abajo hasta 90° con la espalda recta y sube.',
    howToSpot: 'De pie en el salón o despacho con espacio libre.',
    setup: 'Pies a la anchura de los hombros con las puntas ligeramente hacia fuera.',
    steps: [
      'Lleva la cadera hacia atrás y abajo como si te sentaras en una silla manteniendo el pecho alto.',
      'Empuja el suelo con los talones para volver a subir apretando glúteos arriba.'
    ],
    adanTip: 'Lleva los brazos hacia delante al bajar para mantener el equilibrio y la espalda recta.'
  },
  'trx-funcional': {
    id: 'trx-funcional',
    title: 'Remo y Brazos en Suspensión TRX',
    zone: 'Zona Funcional / Cuerdas TRX Amarillas y Negras',
    muscles: 'Espalda, Bíceps, Hombros y Core',
    imgStart: `${IMG_BASE}/Inverted_Row_with_Straps/0.jpg`,
    imgEnd: `${IMG_BASE}/Inverted_Row_with_Straps/1.jpg`,
    startCaption: '1️⃣ Inicio: Sujeta los agarres TRX e inclina el cuerpo recto hacia atrás con brazos estirados.',
    endCaption: '2️⃣ Tirón: Tira con los brazos y la espalda llevando tu pecho/frente hacia las manos.',
    howToSpot: 'Correas amarillas y negras con dos agarres colgadas de la estructura metálica en la zona funcional.',
    setup: 'Agarra las dos manetas mirando hacia el anclaje con el cuerpo recto como una tabla.',
    steps: [
      'Tira con los brazos llevando el pecho hacia tus manos y aprieta espalda y bíceps 1 segundo.',
      'Baja despacio estirando los brazos sin dejar caer la cadera.'
    ],
    adanTip: 'Cuanto más adelantes los pies hacia la pared/estructura, más duro será el ejercicio.'
  },
  'cinta': {
    id: 'cinta',
    title: 'Cinta de Correr con Inclinación (Quema-Grasa)',
    zone: 'Zona Cardio (Con Pantalla)',
    muscles: 'Quema de grasa general, Glúteos, Gemelos y Corazón',
    imgStart: `${IMG_BASE}/Walking_Treadmill/0.jpg`,
    imgEnd: `${IMG_BASE}/Walking_Treadmill/1.jpg`,
    startCaption: '1️⃣ Ajuste: Pon inclinación/nivel 5-8 y velocidad de caminata rápida o trote.',
    endCaption: '2️⃣ Marcha: Camina con paso largo y firme braceando sin colgarte de la consola.',
    howToSpot: 'Las cintas de caminar/correr de la zona de cardio con pantalla de Tiempo, Distancia, Calorías y Nivel.',
    setup: 'Sube la inclinación/nivel entre 5 y 8, y pon una caminata rápida (4.8 - 5.6 km/h) o trote.',
    steps: [
      'Camina con paso largo sin apoyarte con las manos en la pantalla.',
      'Al terminar, hazle una foto a la pantalla resumen con el botón de la app para que Adán guarde tus Km y Calorías.'
    ],
    adanTip: 'Caminar rápido en pendiente quema muchísima grasa abdominal cuidando tus rodillas.'
  },
  'eliptica': {
    id: 'eliptica',
    title: 'Bicicleta Elíptica / Cardio en Pantalla',
    zone: 'Zona Cardio (Con Pantalla)',
    muscles: 'Piernas, Brazos, Corazón y Gran Quema Calórica sin impacto',
    imgStart: `${IMG_BASE}/Elliptical_Trainer/0.jpg`,
    imgEnd: `${IMG_BASE}/Elliptical_Trainer/1.jpg`,
    startCaption: '1️⃣ Inicio: Pies en los pedales y manos en los bastones móviles (Nivel 5 a 7).',
    endCaption: '2️⃣ Ritmo: Pedalea de forma fluida empujando y tirando también con los brazos.',
    howToSpot: 'Máquina de cardio con dos pedales grandes suspendidos y dos bastones verticales que se mueven con los brazos.',
    setup: 'Empieza a pedalear y selecciona Nivel 5, 6 o 7 en la consola.',
    steps: [
      'Empuja y tira también con los brazos en los bastones móviles para quemar un 30% más.',
      'Al acabar los 20-21 min, sube la foto de la pantalla (Tiempo, Km, Calorías, Nivel y Pulso) en la ficha.'
    ],
    adanTip: 'Intenta mantener un ritmo constante y superar en +0.2 Km tu marca anterior.'
  }
};

// Función precisa para encontrar el ejercicio exacto sin confundir unos con otros
export function resolveExerciseVisual(exNameOrId = '', machineName = '') {
  if (EXERCISE_VISUAL_CATALOG[exNameOrId]) return EXERCISE_VISUAL_CATALOG[exNameOrId];
  const s = `${exNameOrId} ${machineName}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (s.includes('martillo')) return EXERCISE_VISUAL_CATALOG['biceps-martillo'];
  if (s.includes('biceps') && !s.includes('trx')) return EXERCISE_VISUAL_CATALOG['biceps-polea-mancuerna'];
  if (s.includes('triceps') && !s.includes('flexion')) return EXERCISE_VISUAL_CATALOG['triceps-polea'];
  if (s.includes('flexiones cerradas') || s.includes('diamante') || (s.includes('flexion') && s.includes('triceps'))) return EXERCISE_VISUAL_CATALOG['flexiones-cerradas'];
  if (s.includes('flexion')) return EXERCISE_VISUAL_CATALOG['flexiones-casa'];

  if (s.includes('bicicleta abdominal') || s.includes('oblicuo')) return EXERCISE_VISUAL_CATALOG['bicicleta-abdominal'];
  if ((s.includes('elevacion de piernas') || s.includes('abdomen inferior')) && (s.includes('tumbado') || s.includes('casa') || s.includes('suelo'))) {
    return EXERCISE_VISUAL_CATALOG['elevacion-piernas-suelo'];
  }
  if (s.includes('elevacion de piernas') || s.includes('rodillas al pecho') || s.includes('silla romana') || s.includes('triserie tableta')) {
    return EXERCISE_VISUAL_CATALOG['elevacion-piernas-abdomen'];
  }
  if (s.includes('crunch') && (s.includes('polea') || s.includes('peso') || s.includes('maquina'))) {
    return EXERCISE_VISUAL_CATALOG['crunch-polea-abdomen'];
  }
  if (s.includes('puente')) return EXERCISE_VISUAL_CATALOG['puente-gluteo'];
  if (s.includes('crunch')) return EXERCISE_VISUAL_CATALOG['crunch-suelo'];
  if (s.includes('plancha')) return EXERCISE_VISUAL_CATALOG['plancha-abdominal'];

  if (s.includes('prensa')) return EXERCISE_VISUAL_CATALOG['prensa'];
  if (s.includes('jalon') || s.includes('polea alta')) return EXERCISE_VISUAL_CATALOG['jalon-pecho'];
  if (s.includes('press de pecho') || s.includes('maquina de pecho')) return EXERCISE_VISUAL_CATALOG['press-pecho'];
  if (s.includes('cuadriceps')) return EXERCISE_VISUAL_CATALOG['extension-cuadriceps'];
  if (s.includes('femoral')) return EXERCISE_VISUAL_CATALOG['curl-femoral'];
  if (s.includes('abductor') || s.includes('aductor')) return EXERCISE_VISUAL_CATALOG['abductores'];
  if (s.includes('remo') && !s.includes('trx')) return EXERCISE_VISUAL_CATALOG['remo-polea'];
  if (s.includes('contractora') || s.includes('mariposa') || s.includes('pec deck')) return EXERCISE_VISUAL_CATALOG['contractora'];
  if (s.includes('hombro')) return EXERCISE_VISUAL_CATALOG['press-hombro'];
  if (s.includes('trx')) return EXERCISE_VISUAL_CATALOG['trx-funcional'];
  if (s.includes('eliptica') || s.includes('bici') || s.includes('spinning') || s.includes('cardio quema-grasa') || s.includes('remate cardio')) return EXERCISE_VISUAL_CATALOG['eliptica'];
  if (s.includes('cinta') || s.includes('caminata') || s.includes('cardio')) return EXERCISE_VISUAL_CATALOG['cinta'];
  if (s.includes('sentadilla') || s.includes('zancada')) return EXERCISE_VISUAL_CATALOG['sentadillas-casa'];

  return EXERCISE_VISUAL_CATALOG['prensa'];
}

export default function ExerciseVisualModal({ exerciseKeyOrName, machineName, onClose }) {
  const [activeFrame, setActiveFrame] = useState(0); // 0 = Inicio, 1 = Final
  const [autoPlay, setAutoPlay] = useState(true);

  if (!exerciseKeyOrName) return null;
  const info = resolveExerciseVisual(exerciseKeyOrName, machineName);

  // Alternar suavemente entre la foto 1 (Inicio) y la foto 2 (Final) para ver el movimiento exacto
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveFrame((prev) => (prev === 0 ? 1 : 0));
    }, 1250);
    return () => clearInterval(timer);
  }, [autoPlay, info.id]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '540px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '1.1rem',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.3)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Cabecera del modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.7rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', background: '#ecfdf5', padding: '0.18rem 0.55rem', borderRadius: '999px' }}>
              📍 {info.zone}
            </span>
            <h3 style={{ margin: '0.35rem 0 0.1rem 0', fontSize: '1.06rem', fontWeight: 900, color: '#0f172a' }}>
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

        {/* 1. LÁMINA EXPLICATIVA DEL EJERCICIO: PASO 1 (INICIO) Y PASO 2 (FINAL) LADO A LADO */}
        <div style={{
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '16px',
          padding: '0.7rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.73rem', fontWeight: 900, color: '#0f172a' }}>
              📸 Guía Visual del Ejercicio (Posición 1 → Posición 2)
            </span>
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              style={{
                background: autoPlay ? '#059669' : '#e2e8f0',
                color: autoPlay ? '#ffffff' : '#334155',
                border: 'none',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {autoPlay ? '🔄 Animación Activa' : '⏸️ Fijo'}
            </button>
          </div>

          {/* Las 2 fotos reales lado a lado explicando Inicio y Final */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div
              onClick={() => { setAutoPlay(false); setActiveFrame(0); }}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: activeFrame === 0 ? '3px solid #2563eb' : '1px solid #e2e8f0',
                padding: '0.4rem',
                cursor: 'pointer',
                transition: 'border 0.2s'
              }}
            >
              <div style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                marginBottom: '0.35rem',
                textAlign: 'center'
              }}>
                1️⃣ POSICIÓN INICIAL
              </div>
              <img
                src={info.imgStart}
                alt={`${info.title} - Inicio`}
                style={{
                  width: '100%',
                  height: '165px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, marginTop: '0.35rem', lineHeight: 1.3 }}>
                {info.startCaption}
              </div>
            </div>

            <div
              onClick={() => { setAutoPlay(false); setActiveFrame(1); }}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: activeFrame === 1 ? '3px solid #059669' : '1px solid #e2e8f0',
                padding: '0.4rem',
                cursor: 'pointer',
                transition: 'border 0.2s'
              }}
            >
              <div style={{
                background: '#ecfdf5',
                color: '#047857',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.2rem 0.45rem',
                borderRadius: '6px',
                marginBottom: '0.35rem',
                textAlign: 'center'
              }}>
                2️⃣ EJECUCIÓN / FINAL
              </div>
              <img
                src={info.imgEnd}
                alt={`${info.title} - Final`}
                style={{
                  width: '100%',
                  height: '165px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, marginTop: '0.35rem', lineHeight: 1.3 }}>
                {info.endCaption}
              </div>
            </div>
          </div>

          {/* Vista grande en movimiento alternando Paso 1 y Paso 2 */}
          <div style={{
            marginTop: '0.6rem',
            background: '#0f172a',
            borderRadius: '12px',
            padding: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              color: activeFrame === 0 ? '#93c5fd' : '#6ee7b7',
              marginBottom: '0.35rem'
            }}>
              {activeFrame === 0 ? info.startCaption : info.endCaption}
            </div>
            <img
              src={activeFrame === 0 ? info.imgStart : info.imgEnd}
              alt={info.title}
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'contain',
                borderRadius: '8px',
                background: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* 2. Cómo reconocer la máquina o posición */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '0.65rem 0.8rem'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.2rem' }}>
            👀 ¿Dónde se hace este ejercicio?
          </div>
          <div style={{ fontSize: '0.79rem', color: '#1e3a8a', lineHeight: 1.4 }}>
            {info.howToSpot}
          </div>
        </div>

        {/* 3. Ajuste y Paso a Paso explicado por Adán */}
        <div style={{
          marginTop: '0.65rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '0.7rem 0.8rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
            ⚙️ Colocación inicial:
          </div>
          <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '0.55rem', lineHeight: 1.38 }}>
            {info.setup}
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            📋 Cómo hacerlo paso a paso:
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.28rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.38 }}>
            {info.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        </div>

        {/* 4. El truco de Adán */}
        <div style={{
          marginTop: '0.65rem',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '0.65rem 0.8rem',
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
            marginTop: '0.8rem',
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
