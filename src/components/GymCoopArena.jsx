import React, { useState, useEffect, useRef } from 'react';

export default function GymCoopArena({
  activeUser = 'Ismael',
  coopSession,
  onRefreshSession,
  onOpenShareModal,
  onExitCoop
}) {
  const [localWeight, setLocalWeight] = useState(null);
  const [localReps, setLocalReps] = useState(null);
  const [submittingTurn, setSubmittingTurn] = useState(false);
  const [activeCheerToast, setActiveCheerToast] = useState(null);
  const [restSeconds, setRestSeconds] = useState(0);
  const restTimerRef = useRef(null);
  const lastCheerIdRef = useRef(null);

  const partner = activeUser === 'Ismael' ? 'Sandra' : 'Ismael';

  // Sonido suave / háptico al pasar de turno o recibir ánimo
  const triggerHaptic = (pattern = [80]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (_) {}
    }
  };

  // Cronómetro de descanso activo
  useEffect(() => {
    if (!coopSession || coopSession.status !== 'active') return;

    const isMyTurn = coopSession.activeTurnUser === activeUser;
    if (!isMyTurn) {
      // Estoy descansando: contar segundos
      setRestSeconds(0);
      restTimerRef.current = setInterval(() => {
        setRestSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      setRestSeconds(0);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [coopSession?.status, coopSession?.activeTurnUser, activeUser]);

  // Detector de nuevos ánimos recibidos
  useEffect(() => {
    if (!coopSession || !Array.isArray(coopSession.cheers) || coopSession.cheers.length === 0) return;
    const lastCheer = coopSession.cheers[coopSession.cheers.length - 1];
    if (lastCheer && lastCheer.to === activeUser && lastCheer.id !== lastCheerIdRef.current) {
      lastCheerIdRef.current = lastCheer.id;
      setActiveCheerToast(lastCheer);
      triggerHaptic([60, 40, 60]);
      const timer = setTimeout(() => {
        setActiveCheerToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [coopSession?.cheers, activeUser]);

  if (!coopSession) return null;

  const currentEx = coopSession.exercises?.[coopSession.currentExerciseIndex] || null;
  const isMyTurn = coopSession.activeTurnUser === activeUser;
  const myConfig = currentEx?.userConfigs?.[activeUser] || { weightKg: 20, reps: 12 };
  const partnerConfig = currentEx?.userConfigs?.[partner] || { weightKg: 15, reps: 12 };

  // Inicializar pesos locales al cambiar de ejercicio
  const effectiveWeight = localWeight !== null ? localWeight : (myConfig.weightKg || 0);
  const effectiveReps = localReps !== null ? localReps : (myConfig.reps || 10);

  // 1. LOBBY DE ESPERA / CONFIRMACIÓN
  if (coopSession.status === 'waiting') {
    const isReady = !!coopSession.ready?.[activeUser];
    const isPartnerReady = !!coopSession.ready?.[partner];

    const handleConfirmJoin = async () => {
      try {
        const res = await fetch('/api/gym/coop/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: activeUser })
        });
        if (res.ok) {
          triggerHaptic([100, 50, 100]);
          if (onRefreshSession) onRefreshSession();
        }
      } catch (err) {
        console.error('Error confirmando:', err);
      }
    };

    const handleCancelLobby = async () => {
      if (window.confirm('¿Quieres cancelar la sesión en pareja y salir?')) {
        try {
          await fetch('/api/gym/coop/leave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: activeUser })
          });
          if (onExitCoop) onExitCoop();
        } catch (_) {}
      }
    };

    return (
      <div style={{
        margin: '1rem 0',
        padding: '1.4rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        border: '1.5px solid rgba(236, 72, 153, 0.4)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>👫</div>
        <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', fontWeight: 900 }}>
          Lobby de Entrenamiento en Pareja
        </h2>
        <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.86rem', color: '#cbd5e1' }}>
          {coopSession.routineName}
        </p>

        {/* Estado de preparación de cada uno */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.3rem'
        }}>
          {/* Card Ismael */}
          <div style={{
            padding: '0.85rem',
            borderRadius: '14px',
            background: coopSession.ready?.Ismael ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: coopSession.ready?.Ismael ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '1.6rem' }}>🏋️‍♂️</div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '0.2rem' }}>Ismael</div>
            <div style={{ fontSize: '0.75rem', color: coopSession.ready?.Ismael ? '#34d399' : '#94a3b8', fontWeight: 700, marginTop: '0.2rem' }}>
              {coopSession.ready?.Ismael ? '✅ Listo para entrenar' : '⏳ Esperando confirmación'}
            </div>
          </div>

          {/* Card Sandra */}
          <div style={{
            padding: '0.85rem',
            borderRadius: '14px',
            background: coopSession.ready?.Sandra ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.04)',
            border: coopSession.ready?.Sandra ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '1.6rem' }}>🧘‍♀️</div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '0.2rem' }}>Sandra</div>
            <div style={{ fontSize: '0.75rem', color: coopSession.ready?.Sandra ? '#f472b6' : '#94a3b8', fontWeight: 700, marginTop: '0.2rem' }}>
              {coopSession.ready?.Sandra ? '✅ Lista para entrenar' : '⏳ Esperando confirmación'}
            </div>
          </div>
        </div>

        {/* Acciones del Lobby */}
        {!isReady ? (
          <button
            type="button"
            onClick={handleConfirmJoin}
            style={{
              width: '100%',
              padding: '0.95rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
              marginBottom: '0.6rem'
            }}
          >
            ✅ ¡Aceptar y Empezar Juntos!
          </button>
        ) : !isPartnerReady ? (
          <div style={{
            padding: '0.8rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            marginBottom: '0.8rem',
            fontSize: '0.84rem',
            color: '#facc15'
          }}>
            ⏳ Esperando a que <strong>{partner}</strong> abra la app en su dispositivo y pulse <strong>"Aceptar"</strong>...
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleCancelLobby}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: '0.4rem'
          }}
        >
          Cancelar sesión en pareja
        </button>
      </div>
    );
  }

  // 2. SESIÓN COMPLETADA (VICTORIA CO-OP)
  if (coopSession.status === 'completed') {
    const handleShare = () => {
      if (onOpenShareModal) {
        onOpenShareModal({
          isDuo: true,
          routineName: coopSession.routineName,
          durationMin: coopSession.durationMin || 50,
          caloriesBurned: coopSession.caloriesBurned || 420,
          completedCount: coopSession.exercises?.length || 7,
          totalCount: coopSession.exercises?.length || 7,
          feeling: '🔥 100% Sincronización',
          exercises: (coopSession.exercises || []).map((e) => ({
            name: e.name,
            machine: e.machine,
            weightKg: e.userConfigs?.[activeUser]?.weightKg || 20,
            reps: e.userConfigs?.[activeUser]?.reps || 12,
            completed: true
          }))
        });
      }
    };

    const handleFinishAndExit = async () => {
      try {
        await fetch('/api/gym/coop/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: activeUser })
        });
        if (onExitCoop) onExitCoop();
      } catch (_) {}
    };

    return (
      <div style={{
        margin: '1.2rem 0',
        padding: '1.6rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #091224 0%, #0d1e38 100%)',
        border: '2px solid #10b981',
        boxShadow: '0 16px 40px rgba(16, 185, 129, 0.25)',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <div style={{ fontSize: '3.4rem', marginBottom: '0.3rem' }}>🏆</div>
        <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.35rem', fontWeight: 900 }}>
          ¡ENTRENAMIENTO EN PAREJA COMPLETADO!
        </h2>
        <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.88rem', color: '#34d399', fontWeight: 700 }}>
          ¡Gran trabajo en equipo, Ismael y Sandra!
        </p>

        {/* Grid de logros compartidos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.6rem',
          marginBottom: '1.3rem'
        }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>TIEMPO JUNTOS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>{coopSession.durationMin || 50} MIN</div>
          </div>
          <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>QUEMA COMBINADA</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fb923c' }}>~{(coopSession.caloriesBurned || 420) * 2} KCAL</div>
          </div>
          <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>MÁQUINAS SUPERADAS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>{coopSession.exercises?.length || 7} ESTACIONES</div>
          </div>
          <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>SINCRONIZACIÓN</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f472b6' }}>100% EQUIPO</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleShare}
            style={{
              padding: '0.9rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.96rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(220, 39, 67, 0.4)'
            }}
          >
            📸 Generar Historia Dúo · Casita Gym
          </button>

          <button
            type="button"
            onClick={handleFinishAndExit}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            🏁 Finalizar y Salir
          </button>
        </div>
      </div>
    );
  }

  // 3. SESIÓN EN CURSO: DINÁMICA DE TURNOS ALTERNOS ("UNO ENTRENA, EL OTRO DESCANSA")
  const handleFinishMySet = async () => {
    if (submittingTurn || !currentEx) return;
    setSubmittingTurn(true);
    triggerHaptic([100, 50, 100]);

    try {
      const res = await fetch('/api/gym/coop/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: activeUser,
          exerciseIndex: coopSession.currentExerciseIndex,
          setNumber: coopSession.currentSetNumber,
          weightKg: effectiveWeight,
          reps: effectiveReps
        })
      });
      if (res.ok) {
        setLocalWeight(null);
        setLocalReps(null);
        if (onRefreshSession) onRefreshSession();
      }
    } catch (err) {
      console.error('Error terminando serie:', err);
    } finally {
      setSubmittingTurn(false);
    }
  };

  const handleSendCheer = async (type, text) => {
    triggerHaptic([50]);
    try {
      await fetch('/api/gym/coop/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: activeUser,
          cheerType: type,
          text
        })
      });
      if (onRefreshSession) onRefreshSession();
    } catch (_) {}
  };

  const totalExercises = coopSession.exercises?.length || 1;
  const currentIdx = (coopSession.currentExerciseIndex || 0) + 1;
  const targetSets = currentEx?.sets || 3;
  const currentSetNum = coopSession.currentSetNumber || 1;

  return (
    <div style={{ margin: '1rem 0', position: 'relative' }}>
      {/* Toast flotante de ánimos en tiempo real */}
      {activeCheerToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 150,
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          color: '#ffffff',
          padding: '0.75rem 1.4rem',
          borderRadius: '999px',
          fontWeight: 800,
          fontSize: '0.9rem',
          boxShadow: '0 10px 30px rgba(236, 72, 153, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'pulse 1s infinite alternate'
        }}>
          <span>{activeCheerToast.from === 'Sandra' ? '🧘‍♀️' : '🏋️‍♂️'}</span>
          <span>{activeCheerToast.text}</span>
        </div>
      )}

      {/* Cabecera Co-Op */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 0.9rem',
        borderRadius: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '0.8rem',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>👫</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.84rem' }}>MODO CO-OP · CASITA GYM</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Estación {currentIdx} de {totalExercises}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Deseas salir del modo en pareja?')) {
              fetch('/api/gym/coop/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: activeUser })
              }).then(() => onExitCoop && onExitCoop());
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Salir
        </button>
      </div>

      {/* Tarjeta Principal Dinámica según de quién sea el turno */}
      {isMyTurn ? (
        /* VISTA: MI TURNO DE ENTRENAR */
        <div style={{
          padding: '1.3rem',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid #10b981',
          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.3)',
          color: '#ffffff'
        }}>
          {/* Badge Mi Turno */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            background: '#10b981',
            color: '#022c22',
            fontSize: '0.74rem',
            fontWeight: 900,
            marginBottom: '0.8rem'
          }}>
            <span>⚡</span>
            <span>¡TU TURNO! · SERIE {currentSetNum} DE {targetSets}</span>
          </div>

          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.25rem', fontWeight: 900 }}>
            {currentEx?.name}
          </h3>
          <div style={{ fontSize: '0.84rem', color: '#6ee7b7', fontWeight: 700, marginBottom: '0.9rem' }}>
            🏢 {currentEx?.machine}
          </div>

          {/* Ajuste de Kilos y Repeticiones */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem',
            marginBottom: '1rem'
          }}>
            {/* Control de Kilos */}
            <div style={{
              padding: '0.75rem',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.35)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>TUS KILOS (KG)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', margin: '0.2rem 0' }}>
                {effectiveWeight} kg
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setLocalWeight(Math.max(0, effectiveWeight - 2.5))}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setLocalWeight(effectiveWeight + 2.5)}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Control de Reps */}
            <div style={{
              padding: '0.75rem',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.35)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800 }}>TUS REPS</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fb923c', margin: '0.2rem 0' }}>
                {effectiveReps}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setLocalReps(Math.max(1, (parseInt(effectiveReps) || 10) - 1))}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setLocalReps((parseInt(effectiveReps) || 10) + 1)}
                  style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Consejo de Adán */}
          {currentEx?.tip && (
            <div style={{
              fontSize: '0.78rem',
              color: '#cbd5e1',
              fontStyle: 'italic',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.6rem 0.8rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              borderLeft: '3px solid #10b981'
            }}>
              💡 {currentEx.tip}
            </div>
          )}

          {/* Botón Principal para completar serie y pasar turno */}
          <button
            type="button"
            disabled={submittingTurn}
            onClick={handleFinishMySet}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✅</span>
            <span>{submittingTurn ? 'Sincronizando...' : `¡Serie Completada! Pasar turno a ${partner} →`}</span>
          </button>

          <div style={{ marginTop: '0.6rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            {partner} está descansando y pendiente de tu serie
          </div>
        </div>
      ) : (
        /* VISTA: TURNO DE DESCANSO (EL COMPAÑERO ESTÁ ENTRENANDO) */
        <div style={{
          padding: '1.3rem',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          {/* Badge Descanso */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: 800,
            marginBottom: '0.8rem'
          }}>
            <span>🧘‍♂️</span>
            <span>DESCANSO ACTIVO · SERIE {currentSetNum} DE {targetSets}</span>
          </div>

          <div style={{ fontSize: '2.5rem', margin: '0.2rem 0' }}>
            {partner === 'Sandra' ? '🧘‍♀️' : '🏋️‍♂️'}
          </div>

          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', fontWeight: 900 }}>
            {partner} está haciendo su serie...
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Respira profundo y recupera. En su móvil tiene la ficha activa.
          </p>

          {/* Cronómetro de descanso */}
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.4rem',
            borderRadius: '16px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.2rem'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>TIEMPO DE DESCANSO</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
              {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Próximo peso del usuario en descanso */}
          <div style={{
            padding: '0.75rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            marginBottom: '1.2rem',
            fontSize: '0.8rem',
            color: '#cbd5e1'
          }}>
            En cuanto {partner} termine, te tocará: <strong style={{ color: '#38bdf8' }}>{myConfig.weightKg} kg × {myConfig.reps} reps</strong>
          </div>

          {/* Panel de ánimos interactivos */}
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800, marginBottom: '0.55rem' }}>
            MÁNDALE ÁNIMOS A {partner.toUpperCase()}:
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.45rem'
          }}>
            {[
              { type: 'fistbump', icon: '👊', text: `¡Choca esos 5, ${partner}!` },
              { type: 'fire', icon: '🔥', text: `¡A tope ${partner}, tú puedes!` },
              { type: 'strong', icon: '💪', text: `¡Fuerza pura ${partner}!` },
              { type: 'water', icon: '💧', text: `¡Bebe un sorbo de agua!` }
            ].map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => handleSendCheer(c.type, c.text)}
                style={{
                  padding: '0.65rem 0.3rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>{c.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
