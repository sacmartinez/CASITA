import React, { useState } from 'react';

// Catálogo completo de ejercicios del Gimnasio Marbella y En Casa
// Cada ejercicio tiene su propio Vídeo Corto real de YouTube (Shorts) + animación específica + guía de Adán
export const EXERCISE_VISUAL_CATALOG = {
  'prensa': {
    id: 'prensa',
    title: 'Prensa de Piernas Sentado (Leg Press)',
    zone: 'Zona de Máquinas de Pierna',
    muscles: 'Cuádriceps (muslos), Glúteos e Isquiotibiales',
    youtubeId: 'CZrG20G5B1g',
    youtubeQuery: 'prensa de piernas gym tecnica shorts',
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
    muscles: 'Espalda ancha en V (Dorsales), Hombros posteriores y Bíceps',
    youtubeId: '-MS6Z88wv5I',
    youtubeQuery: 'jalon al pecho polea alta tecnica shorts',
    howToSpot: 'Máquina alta con una barra larga horizontal colgada de un cable arriba y un asiento con dos rodillos acolchados para encajar los muslos.',
    setup: 'Pon el pincho en tu peso, agarra la barra un poco más ancho que tus hombros y siéntate encajando las piernas bajo los rodillos.',
    steps: [
      'Saca pecho e inclina la espalda solo un poquito hacia atrás.',
      'Tira de la barra hacia abajo llevando los codos hacia tus costillas hasta que la barra toque la parte alta del pecho (clavícula).',
      'Sube los brazos despacio controlando el cable hasta estirar bien la espalda.'
    ],
    adanTip: 'Baja siempre la barra por delante hacia el pecho, ¡nunca por detrás de la nuca!',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wide-grip_lat_pull-down_2.png/640px-Wide-grip_lat_pull-down_2.png',
    animType: 'jalon'
  },
  'press-pecho': {
    id: 'press-pecho',
    title: 'Press de Pecho Sentado en Máquina (Chest Press)',
    zone: 'Zona de Pecho y Torso',
    muscles: 'Pectoral, Parte frontal del Hombro y Tríceps',
    youtubeId: '88kSaeQG21Y',
    youtubeQuery: 'press de pecho en maquina gym shorts',
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
    youtubeId: 'SguKyjZ6y9Q',
    youtubeQuery: 'extension de cuadriceps en maquina shorts',
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
    youtubeId: 'XG2XVE_VcTM',
    youtubeQuery: 'curl femoral sentado maquina shorts',
    howToSpot: 'Silla con rodillo donde apoyas la parte trasera de los tobillos (tendón de Aquiles) para doblar las piernas hacia abajo/atrás.',
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
    youtubeId: '_8YaQjZyevI',
    youtubeQuery: 'maquina de abductores gluteo shorts',
    howToSpot: 'Silla con dos almohadillas laterales giratorias donde apoyas la parte externa de las rodillas/muslos para abrir las piernas.',
    setup: 'Junta las almohadillas con la palanca lateral antes de empezar para tener buen recorrido al abrir.',
    steps: [
      'Siéntate con la espalda apoyada (o ligeramente inclinada hacia delante para notar aún más el glúteo).',
      'Abre las piernas empujando con la parte externa de las rodillas y aguanta 1 segundo abierto.',
      'Cierra despacio sin que reboten las placas.'
    ],
    adanTip: 'Haz una pequeña pausa de 1 segundo con las piernas abiertas en cada repetición.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Hip_abduction_machine_2.png/640px-Hip_abduction_machine_2.png',
    animType: 'abductores'
  },
  'remo-polea': {
    id: 'remo-polea',
    title: 'Remo Sentado en Polea Baja (Remo Gironda)',
    zone: 'Zona de Espalda / Poleas',
    muscles: 'Espalda media (corrección de postura), Dorsales y Bíceps',
    youtubeId: 'IoYs1QwBN_Q',
    youtubeQuery: 'remo sentado en polea baja gironda shorts',
    howToSpot: 'Banco largo bajo con dos apoyos metálicos para los pies enfrente y un cable bajo con un agarre doble en forma de V.',
    setup: 'Apoya los pies en las plataformas, dobla un poquito las rodillas y siéntate con la espalda totalmente recta.',
    steps: [
      'Con el pecho fuera y hombros bajos, tira del agarre hacia tu ombligo.',
      'Junta los omóplatos (escápulas) atrás durante 1 segundo.',
      'Extiende los brazos hacia delante despacio sin encorvar la zona lumbar.'
    ],
    adanTip: 'No te columpies con la espalda; deja el tronco firme y tira con los codos.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Cable_seated_row_2.png/640px-Cable_seated_row_2.png',
    animType: 'remo'
  },
  'contractora': {
    id: 'contractora',
    title: 'Contractora Pectoral / Mariposa (Pec Deck)',
    zone: 'Zona de Pecho',
    muscles: 'Pectoral mayor (firmeza y línea central del pecho)',
    youtubeId: 'Y4jzm2c3szA',
    youtubeQuery: 'contractora de pecho pec deck shorts',
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
    muscles: 'Hombros redondos (Deltoides) y Tríceps',
    youtubeId: '0oXFHxf1sRc',
    youtubeQuery: 'press de hombros en maquina shorts',
    howToSpot: 'Silla con respaldo vertical y dos agarres que parten desde la altura de las orejas/hombros y se empujan hacia el techo.',
    setup: 'Regula el asiento para que en la posición más baja los agarres estén a la altura de tu barbilla o las orejas.',
    steps: [
      'Sujeta los agarres con la espalda bien pegada al respaldo.',
      'Empuja hacia arriba hasta estirar casi del todo los brazos sobre la cabeza.',
      'Baja despacio hasta la altura de las orejas.'
    ],
    adanTip: 'No arquees la zona lumbar al empujar; mantén el abdomen firme contra el respaldo.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lever_shoulder_press_2.png/640px-Lever_shoulder_press_2.png',
    animType: 'press-hombro'
  },
  'triceps-polea': {
    id: 'triceps-polea',
    title: 'Extensión de Tríceps en Polea Alta (Con Cuerda o Barra)',
    zone: 'Estación Multipoleas',
    muscles: 'Tríceps completo (da el 60% del volumen del brazo)',
    youtubeId: 'vqq2NowgTrk',
    youtubeQuery: 'extension de triceps en polea alta con cuerda shorts',
    howToSpot: 'Torre de cables donde enganchas la cuerda doble negra o una barra corta en la polea de arriba.',
    setup: 'Ponte de pie frente a la polea alta, da medio paso atrás e inclina el torso solo un pelín hacia delante.',
    steps: [
      'Clava los codos pegados a tus costillas (los codos NO se mueven hacia delante ni hacia atrás).',
      'Empuja la cuerda hacia abajo hasta estirar los brazos del todo, abriendo las manos al final.',
      'Sube despacio controlando el peso hasta los 90 grados.'
    ],
    adanTip: 'Abrir ligeramente la cuerda abajo del todo y apretar 1 segundo hace que el tríceps crezca el doble.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cable_triceps_pushdown_2.png/640px-Cable_triceps_pushdown_2.png',
    animType: 'triceps-polea'
  },
  'biceps-polea-mancuerna': {
    id: 'biceps-polea-mancuerna',
    title: 'Curl de Bíceps (En Polea Baja o con Mancuernas)',
    zone: 'Zona de Mancuernas / Polea Baja',
    muscles: 'Bíceps braquial (pico y volumen frontal del brazo)',
    youtubeId: 'oI7LxnEFmZU',
    youtubeQuery: 'curl de biceps mancuernas polea tecnica shorts',
    howToSpot: 'Usa la polea situada abajo del todo con barra corta o coge un par de mancuernas frente al espejo.',
    setup: 'De pie con el pecho alto, hombros atrás y los codos pegados a los costados.',
    steps: [
      'Con las palmas mirando hacia arriba, dobla los codos subiendo el peso hacia los hombros.',
      'Aprieta fuerte el bíceps 1 segundo arriba del todo.',
      'Baja despacio en 2 segundos estirando el brazo completo antes de la siguiente repetición.'
    ],
    adanTip: 'Prohibido columpiar la espalda para subir el peso: si tienes que impulsarte, baja 2 kilos y hazlo estricto.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dumbbell_biceps_curl_2.png/640px-Dumbbell_biceps_curl_2.png',
    animType: 'biceps-curl'
  },
  'biceps-martillo': {
    id: 'biceps-martillo',
    title: 'Curl de Bíceps Martillo con Mancuernas (Brazo Ancho)',
    zone: 'Zona de Mancuernas (Frente al espejo)',
    muscles: 'Bíceps, Braquial (ensancha el brazo de frente) y Antebrazo',
    youtubeId: '07D2fR_0iro',
    youtubeQuery: 'curl martillo con mancuernas biceps shorts',
    howToSpot: 'Coge dos mancuernas del rack de pesas libres.',
    setup: 'Sujeta las mancuernas con agarre neutro (las palmas de las manos mirándose entre sí durante todo el ejercicio, como si sujetaras un martillo).',
    steps: [
      'Con los codos pegados al costado, sube las mancuernas hacia los hombros manteniendo las palmas enfrentadas.',
      'Aguanta 1 segundo arriba apretando el brazo y el antebrazo.',
      'Baja de forma controlada sin balancear el torso.'
    ],
    adanTip: 'El curl martillo empuja el bíceps desde abajo y hace que el brazo se vea mucho más grueso incluso con camiseta.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dumbbell_biceps_curl_2.png/640px-Dumbbell_biceps_curl_2.png',
    animType: 'biceps-curl'
  },
  'crunch-polea-abdomen': {
    id: 'crunch-polea-abdomen',
    title: 'Crunch Abdominal con Peso en Polea Alta / Máquina (Six-Pack)',
    zone: 'Estación de Poleas / Máquina de Abdomen',
    muscles: 'Recto abdominal superior y medio (Tableta de chocolate con relieve)',
    youtubeId: 'xYIVO1nCm3E',
    youtubeQuery: 'crunch abdominal en polea alta cuerda shorts',
    howToSpot: 'Engancha la cuerda doble en una polea alta y ponte de rodillas en una esterilla, o usa la máquina sentada de abdominales.',
    setup: 'De rodillas frente a la polea, sujeta los extremos de la cuerda a los lados de la cabeza/sienes.',
    steps: [
      'Dejando la cadera fija arriba, encoge el tronco llevando las costillas hacia el ombligo y los codos hacia las rodillas.',
      'Suelta TODO el aire abajo del todo y aprieta fuerte la tableta 1 segundo.',
      'Sube despacio vértebra a vértebra estirando el abdomen.'
    ],
    adanTip: 'Para que los cuadritos del abdomen tengan relieve hay que entrenarlos con peso igual que el pecho o el bíceps.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'crunch-polea'
  },
  'elevacion-piernas-abdomen': {
    id: 'elevacion-piernas-abdomen',
    title: 'Elevación de Piernas / Rodillas en Silla Romana (Abdomen Inferior)',
    zone: 'Silla Romana (Estructura vertical con apoyabrazos)',
    muscles: 'Abdomen inferior (zona baja de la barriga) y Core',
    youtubeId: 'XFF-hN_0-Yo',
    youtubeQuery: 'elevacion de piernas silla romana abdomen shorts',
    howToSpot: 'Busca la estructura vertical donde apoyas los antebrazos en dos almohadillas y la espalda en un respaldo alto.',
    setup: 'Apoya los antebrazos, sujeta los agarres y empuja los hombros hacia abajo para no hundir el cuello.',
    steps: [
      'Sube las rodillas hacia el pecho enrollando un poco la pelvis hacia arriba al final.',
      'Aguanta 1 segundo arriba apretando la parte baja de la tripa.',
      'Baja las piernas despacio en 2 segundos sin balancearte.'
    ],
    adanTip: 'El secreto para atacar el abdomen inferior es levantar un pelín el culo del respaldo al llegar arriba con las rodillas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'elevacion-piernas'
  },
  'elevacion-piernas-suelo': {
    id: 'elevacion-piernas-suelo',
    title: 'Elevación de Piernas Tumbado en Suelo (Abdomen Inferior)',
    zone: 'En Casa (Salón / Despacho) o Colchoneta',
    muscles: 'Abdomen inferior (parte baja de la tableta)',
    youtubeId: 'Be3jdafVWAk',
    youtubeQuery: 'elevacion de piernas tumbado abdominales shorts',
    howToSpot: 'Tumbado boca arriba sobre una alfombra o esterilla.',
    setup: 'Mete las manos (palmas hacia abajo) justo debajo del borde de tus glúteos para proteger la zona lumbar.',
    steps: [
      'Con las piernas juntas (rectas o ligeramente flexionadas), súbelas hasta formar 90 grados con el suelo.',
      'Baja las piernas muy despacio en 2-3 segundos sin que los talones lleguen a tocar el suelo.',
      'Vuelve a subir apretando la parte baja del abdomen.'
    ],
    adanTip: 'Asegúrate de que tu espalda baja esté siempre pegada al suelo; si se arquea, dobla un poquito las rodillas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'elevacion-piernas-suelo'
  },
  'crunch-suelo': {
    id: 'crunch-suelo',
    title: 'Crunch Abdominal en Suelo (Tableta Superior)',
    zone: 'En Casa o Zona de Colchonetas',
    muscles: 'Recto abdominal superior (los 4 cuadros superiores)',
    youtubeId: 'dNuGXV0nXGA',
    youtubeQuery: 'crunch abdominal en suelo tecnica shorts',
    howToSpot: 'Tumbado boca arriba con las rodillas flexionadas y las plantas de los pies apoyadas en el suelo.',
    setup: 'Manos tocando suavemente las sienes o cruzadas sobre el pecho (nunca tires del cuello con las manos).',
    steps: [
      'Aplasta la zona lumbar contra el suelo y despega solo los hombros y omóplatos enrollando las costillas hacia la pelvis.',
      'Suelta todo el aire arriba y aguanta 1 segundo apretando fuerte el abdomen.',
      'Baja despacio sin relajar del todo la tripa.'
    ],
    adanTip: 'No hace falta sentarse hasta las rodillas: el abdomen trabaja en los primeros 30 grados de recorrido.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'crunch-suelo'
  },
  'bicicleta-abdominal': {
    id: 'bicicleta-abdominal',
    title: 'Bicicleta Abdominal / Oblicuos Alternos (Cintura y V Abdominal)',
    zone: 'En Casa o Zona de Colchonetas',
    muscles: 'Oblicuos (laterales del abdomen), Cintura y Abdomen completo',
    youtubeId: '2oAwnfi3Paw',
    youtubeQuery: 'abdominales bicicleta oblicuos shorts',
    howToSpot: 'Tumbado boca arriba en alfombra o esterilla.',
    setup: 'Manos detrás de las orejas (sin tirar del cuello) y piernas levantadas en el aire.',
    steps: [
      'Gira el torso llevando el codo derecho hacia la rodilla izquierda mientras estiras la pierna derecha.',
      'Cambia de lado de forma controlada llevando el codo izquierdo hacia la rodilla derecha.',
      'Haz el giro desde los hombros/costillas, no moviendo solo los codos.'
    ],
    adanTip: 'Hazlo despacio apretando 1 segundo en cada cruce; lento quema el triple que rápido.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'crunch-suelo'
  },
  'plancha-abdominal': {
    id: 'plancha-abdominal',
    title: 'Plancha Abdominal Isométrica / RKC (Core de Acero)',
    zone: 'Zona de Colchonetas / En Casa',
    muscles: 'Abdomen profundo (reduce cintura), Recto abdominal, Glúteos y Hombros',
    youtubeId: '-JjgnqsTwIg',
    youtubeQuery: 'plancha abdominal correcta core shorts',
    howToSpot: 'En esterilla o alfombra apoyando los antebrazos y las puntas de los pies.',
    setup: 'Codos justo debajo de los hombros y cuerpo formando una línea recta de la cabeza a los talones.',
    steps: [
      'Esconde un poquito el ombligo hacia dentro y aprieta los glúteos al máximo.',
      'En versión RKC (dura): tira imaginariamente de los codos hacia las puntas de tus pies sin moverlos para multiplicar la tensión.',
      'Respira de forma corta y constante hasta que suene el cronómetro.'
    ],
    adanTip: 'No dejes que la cadera se hunda hacia el suelo; es preferible tener el culo un pelín más alto y el abdomen ardiendo.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'plancha'
  },
  'puente-gluteo': {
    id: 'puente-gluteo',
    title: 'Puente de Glúteo y Lumbar en Suelo (Glute Bridge)',
    zone: 'Zona de Colchonetas / En Casa',
    muscles: 'Glúteos, Isquiotibiales y Faja Lumbar-Abdominal',
    youtubeId: 'BLy7Km090os',
    youtubeQuery: 'puente de gluteo en suelo glute bridge shorts',
    howToSpot: 'Tumbado boca arriba con las rodillas dobladas y los talones cerca del glúteo.',
    setup: 'Brazos apoyados a los lados del cuerpo con las palmas hacia abajo.',
    steps: [
      'Empuja el suelo con los TALONES subiendo la cadera hasta que rodillas, cadera y hombros formen una línea recta.',
      'Aprieta fuerte el glúteo 1 segundo arriba.',
      'Baja de forma controlada.'
    ],
    adanTip: 'Activa glúteo y protege la espalda baja tras estar sentado en el trabajo.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Plank_exercise.jpg/640px-Plank_exercise.jpg',
    animType: 'crunch-suelo'
  },
  'flexiones-cerradas': {
    id: 'flexiones-cerradas',
    title: 'Flexiones Cerradas / Diamante (Foco Tríceps, Brazos y Pecho)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Tríceps (hincha el brazo), Pectoral interno y Hombro frontal',
    youtubeId: 'bZJW_GR9jUk',
    youtubeQuery: 'flexiones cerradas diamante triceps pecho shorts',
    howToSpot: 'En el suelo sobre alfombra (o apoyando rodillas al final de la serie para sacar todas las repeticiones).',
    setup: 'Coloca las manos a la anchura de los hombros (o un pelín más juntas) y pega los codos a las costillas al bajar.',
    steps: [
      'Baja el pecho hacia las manos manteniendo los codos pegados a los costados del cuerpo.',
      'Empuja el suelo con fuerza estirando los brazos y apretando el tríceps arriba.',
      'Si llegas al fallo, apoya las rodillas y termina las repeticiones.'
    ],
    adanTip: 'Al llevar los codos pegados al cuerpo en vez de abiertos, el tríceps se lleva una congestión brutal.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Pushups.jpg/640px-Pushups.jpg',
    animType: 'flexiones'
  },
  'flexiones-casa': {
    id: 'flexiones-casa',
    title: 'Flexiones de Brazos Clásicas (Pecho, Hombros y Tríceps)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Pecho completo, Hombros, Tríceps y Core',
    youtubeId: 'S44aVCTshH8',
    youtubeQuery: 'como hacer flexiones de pecho correctamente shorts',
    howToSpot: 'En el suelo sobre alfombra o apoyando las manos en el borde del sofá/mesa si quieres suavizar.',
    setup: 'Manos un poco más abiertas que los hombros y cuerpo recto como una tabla apretando abdomen.',
    steps: [
      'Dobla los codos en ángulo de 45 grados (forma de flecha, no en T) bajando el pecho en 2 segundos.',
      'Empuja fuerte contra el suelo soltando el aire hasta estirar los brazos.'
    ],
    adanTip: 'Mantén el abdomen duro para que el cuerpo suba y baje en bloque.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Pushups.jpg/640px-Pushups.jpg',
    animType: 'flexiones'
  },
  'sentadillas-casa': {
    id: 'sentadillas-casa',
    title: 'Sentadillas al Aire (Activación y Quema Calórica)',
    zone: 'En Casa · Salón o Despacho',
    muscles: 'Cuádriceps, Glúteos y Activación Metabólica',
    youtubeId: 'cqoNTr02fRk',
    youtubeQuery: 'como hacer sentadillas correctamente en casa shorts',
    howToSpot: 'De pie en el salón o despacho con espacio libre.',
    setup: 'Pies a la anchura de los hombros con las puntas ligeramente hacia fuera.',
    steps: [
      'Lleva la cadera hacia atrás y abajo como si te sentaras en una silla manteniendo el pecho alto.',
      'Empuja el suelo con los talones para subir apretando glúteos arriba.'
    ],
    adanTip: 'Al bajar, lleva los brazos hacia delante para mantener la espalda erguida.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/512px-Squats.svg.png',
    animType: 'sentadillas'
  },
  'trx-funcional': {
    id: 'trx-funcional',
    title: 'Entrenamiento en Suspensión TRX (Remo, Bíceps y Sentadilla)',
    zone: 'Zona Funcional / Cuerdas TRX Amarillas y Negras',
    muscles: 'Espalda, Bíceps, Pecho, Piernas y Core',
    youtubeId: 'mnSujAMU8Ig',
    youtubeQuery: 'ejercicios en trx remo y biceps shorts',
    howToSpot: 'Correas amarillas y negras con dos agarres colgadas de la estructura metálica en la zona funcional.',
    setup: 'Agarra las dos manetas mirando hacia el anclaje con el cuerpo recto e inclinado hacia atrás.',
    steps: [
      'Para Remo/Bíceps TRX: Tira con los brazos llevando las manos hacia el pecho/frente y vuelve despacio.',
      'Cuanto más adelantes los pies hacia la pared/estructura, más intenso será el ejercicio.'
    ],
    adanTip: 'En el TRX tú regulas la dureza al instante simplemente dando medio paso adelante o atrás.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Suspension_training.jpg/640px-Suspension_training.jpg',
    animType: 'remo'
  },
  'cinta': {
    id: 'cinta',
    title: 'Cinta de Correr con Inclinación (Quema-Grasa)',
    zone: 'Zona Cardio (Con Pantalla)',
    muscles: 'Quema de grasa general, Glúteos, Gemelos y Corazón',
    youtubeId: 'pk5jeVdyTdc',
    youtubeQuery: 'caminar en cinta con inclinacion quemar grasa shorts',
    howToSpot: 'Las cintas de caminar/correr de la zona de cardio con pantalla de Tiempo, Distancia, Calorías y Nivel.',
    setup: 'Sube la inclinación/nivel entre 5 y 8, y pon una caminata rápida (4.8 - 5.6 km/h) o trote.',
    steps: [
      'Camina con paso largo sin colgarte de la pantalla con las manos (bracea natural).',
      'Al terminar, hazle una foto a la pantalla resumen con el botón de la app para que Adán guarde tus Km y Calorías.'
    ],
    adanTip: 'Caminar rápido con pendiente quema muchísima grasa abdominal sin castigar las rodillas.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Treadmill.jpg/640px-Treadmill.jpg',
    animType: 'cardio-cinta'
  },
  'eliptica': {
    id: 'eliptica',
    title: 'Bicicleta Elíptica / Cardio en Pantalla',
    zone: 'Zona Cardio (Con Pantalla)',
    muscles: 'Piernas, Brazos, Corazón y Gran Quema Calórica sin impacto',
    youtubeId: 'reVFt4TEMAY',
    youtubeQuery: 'como usar bicicleta eliptica correctamente shorts',
    howToSpot: 'Máquina de cardio con dos pedales grandes suspendidos y dos bastones verticales que se mueven con los brazos.',
    setup: 'Empieza a pedalear y sube la resistencia a Nivel 5, 6 o 7.',
    steps: [
      'Empuja y tira también con los brazos en los bastones móviles para quemar un 30% más.',
      'Al acabar los 20-21 min, sube la foto de la pantalla (Tiempo, Km, Calorías, Nivel y Pulso) en la ficha.'
    ],
    adanTip: 'Intenta mantener las RPM por encima de 40-45 y superar en +0.2 Km tu marca anterior.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Elliptical_trainer.jpg/640px-Elliptical_trainer.jpg',
    animType: 'cardio-eliptica'
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

// Reproductor visual animado específico para cada tipo de movimiento
function AnimatedExerciseDiagram({ animType }) {
  const isHomeOrFloor = ['crunch-suelo', 'elevacion-piernas-suelo', 'plancha', 'flexiones', 'sentadillas'].includes(animType);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '14px',
      padding: '0.75rem',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes gymPushLeg { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(34px); } }
        @keyframes gymPullDown { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(32px); } }
        @keyframes gymPushForward { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(30px); } }
        @keyframes gymKickUp { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-42deg); } }
        @keyframes gymCurlBack { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(40deg); } }
        @keyframes gymCurlUp { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-65deg); } }
        @keyframes gymTricepsDown { 0%, 100% { transform: rotate(-45deg); } 50% { transform: rotate(25deg); } }
        @keyframes gymOpenLegs { 0%, 100% { transform: scaleX(0.75); } 50% { transform: scaleX(1.22); } }
        @keyframes gymRowPull { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(-28px); } }
        @keyframes gymPressUp { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        @keyframes gymPulseCore { 0%, 100% { opacity: 0.55; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes gymStackMove { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes gymPushupBody { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(12deg); } }
        @keyframes gymSquatDown { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(22px); } }
        @keyframes gymCrunchUp { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(28deg); } }
        @keyframes gymLegRaiseFloor { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-55deg); } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#10b981', color: '#052e16', padding: '0.12rem 0.5rem', borderRadius: '999px' }}>
          📐 ESQUEMA DE TÉCNICA (SIN CONEXIÓN)
        </span>
        <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>
          🟢 Músculo principal
        </span>
      </div>

      <svg viewBox="0 0 320 145" style={{ width: '100%', height: '135px', display: 'block' }}>
        <line x1="15" y1="132" x2="305" y2="132" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

        {!isHomeOrFloor && (
          <g>
            <rect x="255" y="25" width="30" height="105" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <g style={{ animation: 'gymStackMove 2.4s ease-in-out infinite' }}>
              <rect x="259" y="50" width="22" height="8" rx="2" fill="#10b981" />
              <rect x="259" y="61" width="22" height="8" rx="2" fill="#10b981" />
              <rect x="259" y="72" width="22" height="8" rx="2" fill="#059669" />
              <line x1="270" y1="25" x2="270" y2="50" stroke="#94a3b8" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* PRENSA */}
        {animType === 'prensa' && (
          <g>
            <line x1="45" y1="60" x2="85" y2="115" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <line x1="85" y1="115" x2="115" y2="110" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <circle cx="58" cy="48" r="10" fill="#e2e8f0" />
            <line x1="63" y1="60" x2="92" y2="108" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            <g style={{ animation: 'gymPushLeg 2.4s ease-in-out infinite' }}>
              <line x1="92" y1="108" x2="132" y2="78" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
              <line x1="132" y1="78" x2="178" y2="90" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              <line x1="182" y1="58" x2="174" y2="118" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
              <text x="190" y="52" fill="#fbbf24" fontSize="10" fontWeight="bold">Empuja con talones →</text>
            </g>
          </g>
        )}

        {/* JALÓN */}
        {animType === 'jalon' && (
          <g>
            <line x1="125" y1="16" x2="255" y2="16" stroke="#64748b" strokeWidth="5" />
            <rect x="95" y="100" width="45" height="8" rx="3" fill="#64748b" />
            <circle cx="115" cy="52" r="10" fill="#e2e8f0" />
            <line x1="115" y1="64" x2="115" y2="100" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <g style={{ animation: 'gymPullDown 2.4s ease-in-out infinite' }}>
              <line x1="125" y1="16" x2="125" y2="40" stroke="#94a3b8" strokeWidth="2" />
              <line x1="85" y1="40" x2="165" y2="40" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <line x1="92" y1="40" x2="112" y2="72" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <line x1="158" y1="40" x2="120" y2="72" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
              <text x="172" y="44" fill="#fbbf24" fontSize="10" fontWeight="bold">↓ Baja al pecho</text>
            </g>
          </g>
        )}

        {/* PRESS PECHO */}
        {animType === 'press-pecho' && (
          <g>
            <line x1="75" y1="36" x2="75" y2="128" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
            <circle cx="92" cy="50" r="10" fill="#e2e8f0" />
            <line x1="90" y1="62" x2="90" y2="105" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <circle cx="98" cy="74" r="9" fill="#10b981" />
            <g style={{ animation: 'gymPushForward 2.4s ease-in-out infinite' }}>
              <line x1="95" y1="72" x2="148" y2="72" stroke="#10b981" strokeWidth="9" strokeLinecap="round" />
              <line x1="150" y1="28" x2="150" y2="90" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <text x="160" y="68" fill="#fbbf24" fontSize="10" fontWeight="bold">Empuja al frente →</text>
            </g>
          </g>
        )}

        {/* CUÁDRICEPS */}
        {animType === 'cuadriceps' && (
          <g>
            <line x1="75" y1="40" x2="75" y2="128" stroke="#64748b" strokeWidth="7" />
            <line x1="75" y1="92" x2="130" y2="92" stroke="#64748b" strokeWidth="7" />
            <circle cx="92" cy="46" r="10" fill="#e2e8f0" />
            <line x1="90" y1="58" x2="90" y2="90" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            <line x1="90" y1="90" x2="132" y2="90" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <g style={{ transformOrigin: '132px 90px', animation: 'gymKickUp 2.4s ease-in-out infinite' }}>
              <line x1="132" y1="90" x2="142" y2="126" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              <circle cx="146" cy="122" r="7" fill="#f59e0b" />
            </g>
            <text x="155" y="74" fill="#fbbf24" fontSize="10" fontWeight="bold">↑ Estira y aprieta 1s</text>
          </g>
        )}

        {/* FEMORAL */}
        {animType === 'femoral' && (
          <g>
            <line x1="75" y1="40" x2="75" y2="128" stroke="#64748b" strokeWidth="7" />
            <line x1="75" y1="90" x2="130" y2="90" stroke="#64748b" strokeWidth="7" />
            <circle cx="92" cy="46" r="10" fill="#e2e8f0" />
            <line x1="90" y1="58" x2="90" y2="88" stroke="#38bdf8" strokeWidth="10" strokeLinecap="round" />
            <line x1="90" y1="90" x2="132" y2="90" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <g style={{ transformOrigin: '132px 90px', animation: 'gymCurlBack 2.4s ease-in-out infinite' }}>
              <line x1="132" y1="90" x2="178" y2="94" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
              <circle cx="174" cy="100" r="7" fill="#f59e0b" />
            </g>
            <text x="148" y="68" fill="#fbbf24" fontSize="10" fontWeight="bold">↙ Dobla hacia abajo</text>
          </g>
        )}

        {/* ABDUCTORES */}
        {animType === 'abductores' && (
          <g>
            <rect x="95" y="36" width="70" height="24" rx="6" fill="#64748b" />
            <circle cx="130" cy="48" r="10" fill="#e2e8f0" />
            <g style={{ transformOrigin: '130px 60px', animation: 'gymOpenLegs 2.4s ease-in-out infinite' }}>
              <line x1="118" y1="60" x2="88" y2="115" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <line x1="142" y1="60" x2="172" y2="115" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <rect x="72" y="90" width="10" height="22" rx="4" fill="#f59e0b" />
              <rect x="178" y="90" width="10" height="22" rx="4" fill="#f59e0b" />
            </g>
            <text x="130" y="126" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">← Abre y aguanta 1s →</text>
          </g>
        )}

        {/* REMO */}
        {animType === 'remo' && (
          <g>
            <rect x="65" y="106" width="120" height="8" rx="3" fill="#64748b" />
            <circle cx="95" cy="48" r="10" fill="#e2e8f0" />
            <line x1="95" y1="60" x2="95" y2="104" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <line x1="95" y1="104" x2="165" y2="100" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <g style={{ animation: 'gymRowPull 2.4s ease-in-out infinite' }}>
              <line x1="125" y1="80" x2="225" y2="80" stroke="#94a3b8" strokeWidth="3" />
              <line x1="95" y1="70" x2="132" y2="80" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
              <circle cx="132" cy="80" r="6" fill="#f59e0b" />
            </g>
            <text x="140" y="62" fill="#fbbf24" fontSize="10" fontWeight="bold">← Tira hacia el ombligo</text>
          </g>
        )}

        {/* CONTRACTORA */}
        {animType === 'contractora' && (
          <g>
            <circle cx="130" cy="46" r="11" fill="#e2e8f0" />
            <rect x="112" y="60" width="36" height="42" rx="8" fill="#10b981" />
            <g style={{ transformOrigin: '130px 72px', animation: 'gymOpenLegs 2.4s ease-in-out infinite' }}>
              <line x1="112" y1="72" x2="72" y2="84" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />
              <line x1="148" y1="72" x2="188" y2="84" stroke="#38bdf8" strokeWidth="9" strokeLinecap="round" />
              <circle cx="72" cy="84" r="7" fill="#f59e0b" />
              <circle cx="188" cy="84" r="7" fill="#f59e0b" />
            </g>
            <text x="130" y="124" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">→ Junta los brazos delante ←</text>
          </g>
        )}

        {/* PRESS HOMBRO */}
        {animType === 'press-hombro' && (
          <g>
            <line x1="95" y1="50" x2="95" y2="128" stroke="#64748b" strokeWidth="7" />
            <circle cx="115" cy="64" r="10" fill="#e2e8f0" />
            <line x1="115" y1="76" x2="115" y2="118" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <circle cx="115" cy="78" r="8" fill="#10b981" />
            <g style={{ animation: 'gymPressUp 2.4s ease-in-out infinite' }}>
              <line x1="115" y1="78" x2="115" y2="44" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
              <circle cx="115" cy="40" r="6" fill="#f59e0b" />
              <text x="132" y="48" fill="#fbbf24" fontSize="10" fontWeight="bold">↑ Empuja hacia el techo</text>
            </g>
          </g>
        )}

        {/* BÍCEPS CURL (SUBE EL ANTEBRAZO HACIA EL HOMBRO) */}
        {animType === 'biceps-curl' && (
          <g>
            <circle cx="105" cy="42" r="10" fill="#e2e8f0" />
            <line x1="105" y1="54" x2="105" y2="98" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <line x1="105" y1="98" x2="105" y2="130" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            {/* Bíceps verde iluminado y codo fijo */}
            <line x1="105" y1="58" x2="110" y2="84" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
            <g style={{ transformOrigin: '110px 84px', animation: 'gymCurlUp 2.1s ease-in-out infinite' }}>
              <line x1="110" y1="84" x2="142" y2="96" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
              <circle cx="145" cy="96" r="7" fill="#f59e0b" />
            </g>
            <text x="148" y="65" fill="#fbbf24" fontSize="10" fontWeight="bold">↖ Sube apretando bíceps</text>
          </g>
        )}

        {/* TRÍCEPS POLEA ALTA (EMPUJA LA CUERDA HACIA ABAJO) */}
        {animType === 'triceps-polea' && (
          <g>
            <line x1="150" y1="18" x2="255" y2="18" stroke="#64748b" strokeWidth="4" />
            <line x1="150" y1="18" x2="142" y2="68" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="105" cy="42" r="10" fill="#e2e8f0" />
            <line x1="105" y1="54" x2="105" y2="98" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
            <line x1="105" y1="98" x2="105" y2="130" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            {/* Tríceps iluminado */}
            <line x1="105" y1="58" x2="112" y2="82" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
            <g style={{ transformOrigin: '112px 82px', animation: 'gymTricepsDown 2.1s ease-in-out infinite' }}>
              <line x1="112" y1="82" x2="142" y2="82" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
              <circle cx="144" cy="82" r="6" fill="#f59e0b" />
            </g>
            <text x="155" y="102" fill="#fbbf24" fontSize="10" fontWeight="bold">↓ Estira brazo abajo</text>
          </g>
        )}

        {/* CRUNCH ABDOMINAL EN POLEA ALTA (DE RODILLAS ENCOGIENDO EL ABDOMEN) */}
        {animType === 'crunch-polea' && (
          <g>
            <line x1="155" y1="18" x2="255" y2="18" stroke="#64748b" strokeWidth="4" />
            {/* Piernas de rodillas en el suelo */}
            <line x1="85" y1="128" x2="115" y2="128" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
            <line x1="115" y1="128" x2="115" y2="98" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <g style={{ transformOrigin: '115px 98px', animation: 'gymCrunchUp 2.2s ease-in-out infinite' }}>
              <line x1="115" y1="98" x2="122" y2="58" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <circle cx="126" cy="46" r="9" fill="#e2e8f0" />
              <line x1="155" y1="18" x2="134" y2="48" stroke="#f59e0b" strokeWidth="3" />
            </g>
            <text x="145" y="78" fill="#fbbf24" fontSize="10" fontWeight="bold">↘ Encoge costillas a pelvis</text>
          </g>
        )}

        {/* ELEVACIÓN DE PIERNAS EN SILLA ROMANA */}
        {animType === 'elevacion-piernas' && (
          <g>
            <line x1="82" y1="25" x2="82" y2="130" stroke="#64748b" strokeWidth="8" />
            <line x1="82" y1="68" x2="112" y2="68" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="98" cy="40" r="9" fill="#e2e8f0" />
            <line x1="96" y1="50" x2="96" y2="86" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <g style={{ transformOrigin: '96px 86px', animation: 'gymKickUp 2.2s ease-in-out infinite' }}>
              <line x1="96" y1="86" x2="115" y2="122" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            </g>
            <text x="130" y="88" fill="#fbbf24" fontSize="10" fontWeight="bold">↑ Sube rodillas al pecho</text>
          </g>
        )}

        {/* ELEVACIÓN DE PIERNAS TUMBADO EN SUELO */}
        {animType === 'elevacion-piernas-suelo' && (
          <g>
            <circle cx="65" cy="118" r="9" fill="#e2e8f0" />
            <line x1="76" y1="122" x2="140" y2="122" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <g style={{ transformOrigin: '140px 122px', animation: 'gymLegRaiseFloor 2.4s ease-in-out infinite' }}>
              <line x1="140" y1="122" x2="215" y2="118" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            </g>
            <text x="160" y="65" fill="#fbbf24" fontSize="10" fontWeight="bold">↖ Sube piernas a 90° y baja lento</text>
          </g>
        )}

        {/* CRUNCH / BICICLETA / PUENTE EN SUELO */}
        {animType === 'crunch-suelo' && (
          <g>
            <line x1="145" y1="122" x2="175" y2="95" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <line x1="175" y1="95" x2="205" y2="126" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <g style={{ transformOrigin: '145px 122px', animation: 'gymCrunchUp 2.1s ease-in-out infinite' }}>
              <line x1="85" y1="118" x2="145" y2="122" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <circle cx="74" cy="112" r="9" fill="#e2e8f0" />
            </g>
            <text x="145" y="62" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">↗ Aprieta fuerte el abdomen 1s arriba</text>
          </g>
        )}

        {/* FLEXIONES EN SUELO */}
        {animType === 'flexiones' && (
          <g>
            <g style={{ transformOrigin: '205px 125px', animation: 'gymPushupBody 2s ease-in-out infinite' }}>
              <circle cx="82" cy="78" r="9" fill="#e2e8f0" />
              <line x1="92" y1="84" x2="205" y2="125" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
              <line x1="102" y1="88" x2="102" y2="128" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
            </g>
            <text x="150" y="55" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">↕ Cuerpo recto · Baja pecho y empuja</text>
          </g>
        )}

        {/* SENTADILLAS EN CASA */}
        {animType === 'sentadillas' && (
          <g>
            <g style={{ animation: 'gymSquatDown 2.2s ease-in-out infinite' }}>
              <circle cx="145" cy="40" r="10" fill="#e2e8f0" />
              <line x1="145" y1="52" x2="138" y2="90" stroke="#38bdf8" strokeWidth="11" strokeLinecap="round" />
              <line x1="145" y1="62" x2="182" y2="62" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
              <line x1="138" y1="90" x2="160" y2="104" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
            </g>
            <line x1="155" y1="100" x2="155" y2="130" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
            <text x="215" y="85" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">↕ Cadera atrás y arriba</text>
          </g>
        )}

        {/* PLANCHA O CARDIO */}
        {(animType === 'cardio-cinta' || animType === 'cardio-eliptica' || animType === 'plancha') && (
          <g>
            {animType === 'plancha' ? (
              <>
                <circle cx="75" cy="84" r="10" fill="#e2e8f0" />
                <line x1="85" y1="90" x2="195" y2="114" stroke="#10b981" strokeWidth="12" strokeLinecap="round" style={{ animation: 'gymPulseCore 2s ease-in-out infinite' }} />
                <line x1="88" y1="92" x2="88" y2="128" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                <line x1="195" y1="114" x2="205" y2="128" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
                <text x="145" y="65" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">Abdomen y glúteo firmes en línea recta</text>
              </>
            ) : (
              <>
                <line x1="55" y1="128" x2="210" y2="106" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
                <line x1="195" y1="108" x2="205" y2="44" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                <circle cx="135" cy="44" r="10" fill="#e2e8f0" />
                <line x1="135" y1="56" x2="132" y2="90" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
                <g style={{ transformOrigin: '132px 90px', animation: 'gymKickUp 1.4s ease-in-out infinite' }}>
                  <line x1="132" y1="90" x2="118" y2="118" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                </g>
                <g style={{ transformOrigin: '132px 90px', animation: 'gymCurlBack 1.4s ease-in-out infinite' }}>
                  <line x1="132" y1="90" x2="152" y2="114" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                </g>
                <text x="125" y="28" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">🔥 Ritmo constante · Nivel 6+</text>
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
  const youtubeEmbedUrl = info.youtubeId
    ? `https://www.youtube.com/embed/${info.youtubeId}?rel=0&modestbranding=1&playsinline=1`
    : null;
  const youtubeDirectShortUrl = info.youtubeId
    ? `https://www.youtube.com/shorts/${info.youtubeId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent((info.youtubeQuery || exerciseKeyOrName) + ' shorts')}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(info.youtubeQuery || `${exerciseKeyOrName} tecnica shorts`)}`;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.65rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', background: '#ecfdf5', padding: '0.18rem 0.55rem', borderRadius: '999px' }}>
              📍 {info.zone}
            </span>
            <h3 style={{ margin: '0.35rem 0 0.1rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
              {info.title}
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700 }}>
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

        {/* 1. VÍDEO CORTO REAL DE YOUTUBE INTEGRADO DIRECTAMENTE EN LA FICHA */}
        <div style={{
          background: '#0f172a',
          borderRadius: '16px',
          padding: '0.65rem',
          marginBottom: '0.75rem',
          border: '2px solid #dc2626'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              🎬 VÍDEO CORTO REAL (YOUTUBE SHORTS)
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <a
                href={youtubeDirectShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '0.22rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}
              >
                ▶️ Abrir en App YouTube
              </a>
              <a
                href={youtubeSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#334155',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  padding: '0.22rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                🔍 Más Shorts
              </a>
            </div>
          </div>

          {youtubeEmbedUrl && (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '310px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000000'
            }}>
              <iframe
                src={youtubeEmbedUrl}
                title={`Vídeo corto de ${info.title}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* 2. Esquema animado de apoyo (por si algún día no hay cobertura en la sala del gimnasio) */}
        <AnimatedExerciseDiagram animType={info.animType} />

        {/* 3. Foto real / ilustración anatómica de la máquina */}
        {!imgError && info.photoUrl && (
          <div style={{
            marginTop: '0.7rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '0.55rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              📸 Imagen de referencia de la máquina
            </div>
            <img
              src={info.photoUrl}
              alt={info.title}
              onError={() => setImgError(true)}
              style={{
                maxHeight: '165px',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '10px',
                background: '#ffffff'
              }}
            />
          </div>
        )}

        {/* 4. Cómo reconocer la máquina al entrar al Gimnasio Marbella */}
        <div style={{
          marginTop: '0.7rem',
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

        {/* 5. Ajuste y Paso a Paso explicado por Adán */}
        <div style={{
          marginTop: '0.65rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '0.7rem 0.8rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
            ⚙️ Posición inicial / Ajuste:
          </div>
          <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '0.55rem', lineHeight: 1.38 }}>
            {info.setup}
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            📋 Paso a paso de la técnica:
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.28rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.38 }}>
            {info.steps.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ol>
        </div>

        {/* 6. El truco de Adán */}
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
          ✓ ¡Visto, vamos a darle caña!
        </button>
      </div>
    </div>
  );
}
