import React, { useRef, useEffect, useState } from 'react';

export default function GymSocialShareModal({
  isOpen,
  onClose,
  workoutData,
  userName = 'Ismael'
}) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  useEffect(() => {
    if (!isOpen || !workoutData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Estándar oficial de Instagram Stories vertical 9:16
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // 1. Fondo Oscuro Premium (OLED Dark Gym Aesthetics con degradado de Instagram sutil)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#060a12');
    bgGrad.addColorStop(0.35, '#0b1325');
    bgGrad.addColorStop(0.75, '#080d1a');
    bgGrad.addColorStop(1, '#04060b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Luces y Brillos Ambientales (Glows neón esmeralda, azul e Instagram sunset)
    // Glow superior esmeralda / fitness
    const glow1 = ctx.createRadialGradient(250, 320, 30, 250, 320, 500);
    glow1.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    // Glow Instagram Sunset (fucsia-naranja) en la esquina superior derecha
    const glowIG = ctx.createRadialGradient(width - 150, 250, 30, width - 150, 250, 480);
    glowIG.addColorStop(0, 'rgba(225, 48, 108, 0.20)');
    glowIG.addColorStop(0.6, 'rgba(245, 96, 64, 0.10)');
    glowIG.addColorStop(1, 'transparent');
    ctx.fillStyle = glowIG;
    ctx.fillRect(0, 0, width, height);

    // Glow inferior azul cibernético
    const glow2 = ctx.createRadialGradient(width - 250, height - 350, 30, width - 250, height - 350, 550);
    glow2.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // 3. Borde del Marco Exterior Elegante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 80, width - 96, height - 160);

    // 4. Título Principal de Marca: Solo CASITA GYM
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 84px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('CASITA GYM', width / 2, 205);

    // Línea decorativa verde esmeralda
    const lineGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, '#10b981');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 238);
    ctx.lineTo(width / 2 + 200, 238);
    ctx.stroke();

    // Fecha del entrenamiento
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const dateText = workoutData.dateFormatted || new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    ctx.fillText(dateText.toUpperCase(), width / 2, 290);

    const isDuo = workoutData.isDuo || workoutData.together || userName === 'Dúo' || userName === 'Ismael & Sandra';

    // 6. Tarjeta Destacada de Atleta y Rutina
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(70, 355, width - 140, 160, 24);
    ctx.fill();
    ctx.strokeStyle = isDuo ? 'rgba(236, 72, 153, 0.35)' : 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isDuo ? '#f472b6' : '#38bdf8';
    ctx.font = '900 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(isDuo ? '👫 DUO WORKOUT · ISMAEL & SANDRA' : `🏋️ ATLETA: ${userName.toUpperCase()}`, width / 2, 415);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const routineTitle = (workoutData.routineName || 'Sesión de Entrenamiento').replace('Gimnasio Marbella', 'Casita Gym').slice(0, 48);
    ctx.fillText(routineTitle, width / 2, 465);

    ctx.fillStyle = '#10b981';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(isDuo ? '✨ ENTRENAMIENTO EN PAREJA SUPERADO JUNTOS' : '✨ ENTRENAMIENTO COMPLETADO CON ÉXITO', width / 2, 498);

    // 7. Grid de 4 Métricas Clave (2 columnas x 2 filas)
    const boxW = 450;
    const boxH = 155;
    const boxes = [
      {
        x: 70,
        y: 545,
        icon: '⏱️',
        label: isDuo ? 'TIEMPO EN EQUIPO' : 'TIEMPO ENTRENANDO',
        val: `${workoutData.durationMin || 60} MIN`,
        sub: `${workoutData.startTime || '18:30'} → ${workoutData.endTime || '19:35'}`
      },
      {
        x: 560,
        y: 545,
        icon: '🔥',
        label: isDuo ? 'QUEMA COMBINADA' : 'GASTO CALÓRICO',
        val: isDuo ? `~${(workoutData.caloriesBurned || 420) * 2} KCAL` : `~${workoutData.caloriesBurned || 450} KCAL`,
        sub: isDuo ? 'Gasto total de los dos' : 'Quema metabólica activa'
      },
      {
        x: 70,
        y: 725,
        icon: '💪',
        label: isDuo ? 'MÁQUINAS JUNTOS' : 'MÁQUINAS / SERIES',
        val: `${workoutData.completedCount || 7} / ${workoutData.totalCount || 7}`,
        sub: 'Series alternadas en pareja'
      },
      {
        x: 560,
        y: 725,
        icon: '⚡',
        label: isDuo ? 'SINCRONIZACIÓN' : 'SENSACIÓN FINAL',
        val: isDuo ? '100% EQUIPO' : (workoutData.feeling || 'Muy bien').replace(/[^\w\sñáéíóú]/gi, '').trim().toUpperCase(),
        sub: isDuo ? 'Compañerismo y fuerza' : 'Nivel de energía superado'
      }
    ];

    boxes.forEach(b => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, boxW, boxH, 20);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${b.icon} ${b.label}`, b.x + 24, b.y + 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.val, b.x + 24, b.y + 96);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.sub, b.x + 24, b.y + 132);
    });

    // 8. Lista Detallada de Ejercicios Realizados
    const listTopY = 910;
    const listHeight = 630;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(70, listTopY, width - 140, listHeight, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.font = '800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('📋 RESUMEN DE PROGRESIÓN Y CARGAS:', 105, listTopY + 50);

    const exercises = (workoutData.exercises || []).filter(e => e.completed).slice(0, 8);
    exercises.forEach((ex, i) => {
      const lineY = listTopY + 110 + (i * 62);

      // Fila alterna sutil
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.fillRect(85, lineY - 38, width - 170, 54);
      }

      // Checkmark esmeralda
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓', 110, lineY);

      // Nombre ejercicio
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const cleanName = (ex.name || 'Ejercicio').replace('Gimnasio Marbella', '').trim();
      const nameTxt = cleanName.length > 32 ? cleanName.slice(0, 30) + '…' : cleanName;
      ctx.fillText(nameTxt, 145, lineY);

      // Carga o Reps
      ctx.textAlign = 'right';
      ctx.fillStyle = '#60a5fa';
      ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      let statsTxt = '';
      if (ex.isCardio) {
        statsTxt = `${ex.reps || '15 min'}${ex.distanceKm ? ` · ${ex.distanceKm} km` : ''}`;
      } else {
        statsTxt = `${ex.weightKg || 0} kg × ${ex.reps || 10}`;
      }
      ctx.fillText(statsTxt, width - 110, lineY);
      ctx.textAlign = 'left';
    });

    // 9. Frase Motivacional / Tag de Instagram
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(70, 1565, width - 140, 130, 20);
    ctx.fill();
    ctx.strokeStyle = isDuo ? 'rgba(244, 114, 182, 0.35)' : 'rgba(240, 148, 51, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(isDuo ? '🎯 "Entrenar en pareja multiplica las ganas por dos."' : '🎯 "La constancia no se negocia. Un día más sumando."', width / 2, 1618);

    ctx.fillStyle = isDuo ? '#f472b6' : '#fb7185';
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(isDuo ? '@casitagym · Ismael & Sandra entrenando en equipo' : '@casitagym · Entrenando juntos todos los días', width / 2, 1662);

    // 10. Pie de imagen / Watermark (Safe zone inferior de Instagram)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(isDuo ? '#CasitaGym #DuoWorkout #ParejaFit · CasitaOS' : '#CasitaGym #Constancia #Fitness · CasitaOS', width / 2, 1780);

    // Exportar como URL de imagen para previsualización
    canvas.toBlob((blob) => {
      if (blob) {
        setImageUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');

  }, [isOpen, workoutData, userName]);

  if (!isOpen || !workoutData) return null;

  const getInstagramCaption = () => {
    const isDuo = workoutData.isDuo || workoutData.together || userName === 'Dúo' || userName === 'Ismael & Sandra';
    if (isDuo) {
      return `👫 ¡Entrenamiento en pareja completado en #CasitaGym!\n\n` +
        `⏱️ ${workoutData.durationMin || 60} min juntos (${workoutData.startTime || '18:30'} - ${workoutData.endTime || '19:30'})\n` +
        `🔥 ~${(workoutData.caloriesBurned || 420) * 2} kcal quemadas en equipo\n` +
        `💪 ${workoutData.completedCount || 7}/${workoutData.totalCount || 7} máquinas compartidas superadas\n` +
        `⚡ Ismael & Sandra · ¡La constancia en equipo!\n\n` +
        `#CasitaGym #DuoWorkout #FitnessPareja #Workout @casitagym`;
    }
    return `🔥 ¡Entrenamiento completado en #CasitaGym!\n\n` +
      `⏱️ ${workoutData.durationMin || 60} min (${workoutData.startTime || '18:30'} - ${workoutData.endTime || '19:30'})\n` +
      `🔥 ~${workoutData.caloriesBurned || 450} kcal activas\n` +
      `💪 ${workoutData.completedCount || 7}/${workoutData.totalCount || 7} ejercicios superados\n` +
      `⚡ Sensación: ${workoutData.feeling || 'A tope'}\n\n` +
      `#CasitaGym #Fitness #Constancia #Workout @casitagym`;
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(getInstagramCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    } catch (err) {
      console.warn('Error al copiar texto:', err);
    }
  };

  const handleInstagramShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSharing(true);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setSharing(false);
        return;
      }

      const fileName = `CasitaGym-Story-${userName}-${workoutData.date || 'hoy'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Intento compartir archivo nativo (en Android/iOS abre selector con Instagram / Stories)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Casita Gym - Story de ${userName}`,
            text: getInstagramCaption()
          });
          setSharing(false);
          return;
        } catch (e) {
          console.log('Share canceled or dismissed:', e);
        }
      }

      // Si no soporta compartir archivo directo, descarga automáticamente la historia en 9:16
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      setSharing(false);
    }, 'image/png');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `CasitaGym-Story-${userName}-${workoutData.date || 'hoy'}.png`;
      a.click();
    }, 'image/png');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '95%',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '1.25rem',
          borderRadius: '24px',
          background: 'rgba(8, 12, 22, 0.96)',
          border: '1px solid rgba(225, 48, 108, 0.35)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📸</span>
            <span>Compartir · Casita Gym</span>
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>
            &times;
          </button>
        </div>

        {/* Canvas oculto para renderizar en alta resolución 1080x1920 */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Previsualización en proporción 9:16 */}
        {imageUrl ? (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '3px',
              borderRadius: '16px',
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              boxShadow: '0 8px 30px rgba(220, 39, 67, 0.3)'
            }}>
              <img
                src={imageUrl}
                alt="Story Casita Gym"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '52vh',
                  aspectRatio: '9 / 16',
                  objectFit: 'contain',
                  borderRadius: '13px'
                }}
              />
            </div>
            <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: '#94a3b8' }}>
              Formato vertical 9:16 (1080 × 1920 px) optimizado para Instagram
            </div>
          </div>
        ) : (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
            Generando historia de Instagram...
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Botón principal Instagram */}
          <button
            type="button"
            onClick={handleInstagramShare}
            disabled={sharing || !imageUrl}
            style={{
              padding: '0.9rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(220, 39, 67, 0.45)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>📸</span>
            <span>{sharing ? 'Preparando Historia...' : 'Compartir en Instagram Stories'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Copiar pie de foto */}
            <button
              type="button"
              onClick={handleCopyCaption}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: copiedCaption ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                color: copiedCaption ? '#34d399' : '#e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{copiedCaption ? '✓' : '📋'}</span>
              <span>{copiedCaption ? '¡Copiado!' : 'Copiar Texto IG'}</span>
            </button>

            {/* Descargar PNG 9:16 */}
            <button
              type="button"
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <span>📥</span>
              <span>Guardar Imagen</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '0.2rem'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
