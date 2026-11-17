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

  useEffect(() => {
    if (!isOpen || !workoutData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. Fondo Oscuro Premium (OLED Gym Aesthetics)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0d1527');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Luces y Brillos Ambientales (Glows neón esmeralda y azul)
    const glow1 = ctx.createRadialGradient(200, 200, 20, 200, 200, 450);
    glow1.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(width - 200, height - 250, 20, width - 200, height - 250, 500);
    glow2.addColorStop(0, 'rgba(59, 130, 246, 0.22)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // 3. Borde del Marco Exterior Elegante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // 4. Cabecera de Marca: CASITA GYM
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ MARBELLA FIT · CASITA HUB ⚡', width / 2, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('CASITA GYM', width / 2, 185);

    // Línea divisoria decorativa
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 160, 215);
    ctx.lineTo(width / 2 + 160, 215);
    ctx.stroke();

    // 5. Atleta y Rutina
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(workoutData.dateFormatted || new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), width / 2, 260);

    // Nombre del Atleta en Grande
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`🏋️ ATLETA: ${userName.toUpperCase()}`, width / 2, 330);

    // Nombre de la rutina
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const routineTitle = (workoutData.routineName || 'Sesión de Entrenamiento').slice(0, 48);
    ctx.fillText(routineTitle, width / 2, 390);

    // 6. Tarjetas de Estadísticas (Grid de 4 cajas)
    const boxW = 460;
    const boxH = 150;
    const boxes = [
      {
        x: 70,
        y: 450,
        icon: '⏱️',
        label: 'DURACIÓN TOTAL',
        val: `${workoutData.durationMin || 60} MIN`,
        sub: `${workoutData.startTime || '18:30'} → ${workoutData.endTime || '19:35'}`
      },
      {
        x: 550,
        y: 450,
        icon: '🔥',
        label: 'CALORÍAS ACTIVAS',
        val: `~${workoutData.caloriesBurned || 450} KCAL`,
        sub: 'Quema metabólica real'
      },
      {
        x: 70,
        y: 630,
        icon: '💪',
        label: 'MÁQUINAS DE HOY',
        val: `${workoutData.completedCount || 7} / ${workoutData.totalCount || 7}`,
        sub: 'Ejercicios completados'
      },
      {
        x: 550,
        y: 630,
        icon: '⚡',
        label: 'SENSACIÓN FINAL',
        val: (workoutData.feeling || 'Muy bien').replace(/[^\w\sñáéíóú]/gi, '').trim().toUpperCase(),
        sub: 'Progreso validado por Adán'
      }
    ];

    boxes.forEach(b => {
      // Fondo de caja con efecto vidrio
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, boxW, boxH, 20);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Textos de la caja
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.font = '800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${b.icon} ${b.label}`, b.x + 25, b.y + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.val, b.x + 25, b.y + 96);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(b.sub, b.x + 25, b.y + 130);
    });

    // 7. Lista Destacada de Ejercicios Realizados
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(70, 815, width - 140, 390, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#34d399';
    ctx.font = '800 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('📋 RESUMEN DE PROGRESIÓN Y CARGAS:', 100, 860);

    const exercises = (workoutData.exercises || []).filter(e => e.completed).slice(0, 6);
    exercises.forEach((ex, i) => {
      const lineY = 910 + (i * 48);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓', 105, lineY);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const nameTxt = (ex.name || 'Ejercicio').slice(0, 32);
      ctx.fillText(nameTxt, 135, lineY);

      // Carga o Reps
      ctx.textAlign = 'right';
      ctx.fillStyle = '#60a5fa';
      ctx.font = '800 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      let statsTxt = '';
      if (ex.isCardio) {
        statsTxt = `${ex.reps || '15 min'}${ex.distanceKm ? ` · ${ex.distanceKm} km` : ''}`;
      } else {
        statsTxt = `${ex.weightKg || 0} kg × ${ex.reps || 10}`;
      }
      ctx.fillText(statsTxt, width - 105, lineY);
      ctx.textAlign = 'left';
    });

    // 8. Pie de imagen / Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Generado con CasitaOS · #CasitaGym #MarbellaFit #Constancia', width / 2, 1270);

    // Exportar como URL de imagen para previsualización
    canvas.toBlob((blob) => {
      if (blob) {
        setImageUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');

  }, [isOpen, workoutData, userName]);

  if (!isOpen || !workoutData) return null;

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSharing(true);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setSharing(false);
        return;
      }

      const fileName = `CasitaGym-${userName}-${workoutData.date || 'hoy'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Casita Gym - Entrenamiento de ${userName}`,
            text: `¡Sesión completada en Casita Gym! 🔥 ~${workoutData.caloriesBurned} kcal en ${workoutData.durationMin || 60} min.`
          });
          setSharing(false);
          return;
        } catch (e) {
          console.log('Share canceled or error:', e);
        }
      }

      // Fallback a descarga si no permite compartir archivo
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
      a.download = `CasitaGym-${userName}-${workoutData.date || 'hoy'}.png`;
      a.click();
    }, 'image/png');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '95%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '1.25rem',
          borderRadius: '20px',
          background: 'rgba(10, 15, 28, 0.96)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📸</span>
            <span>Compartir en Redes · Casita Gym</span>
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
            &times;
          </button>
        </div>

        {/* Canvas oculto para renderizar en alta resolución */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Previsualización de la tarjeta */}
        {imageUrl ? (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img
              src={imageUrl}
              alt="Estadísticas de Casita Gym"
              style={{
                width: '100%',
                maxHeight: '55vh',
                objectFit: 'contain',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
              }}
            />
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            Generando tarjeta gráfica de Casita Gym...
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={sharing || !imageUrl}
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            <span>📲</span>
            <span>{sharing ? 'Abriendo opciones...' : 'Compartir en Historias / WhatsApp'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📥 Descargar Imagen PNG
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
