import React, { useState, useEffect } from 'react';

const LOCATIONS = [
  { id: 'carabanchel', name: 'Carabanchel', sub: 'Madrid Sur · Casa', lat: 40.3833, lon: -3.7333, icon: '🏠' },
  { id: 'alcobendas', name: 'Alcobendas', sub: 'Madrid Norte · Curro', lat: 40.5333, lon: -3.6333, icon: '💼' },
  { id: 'ventas', name: 'Ventas', sub: 'Madrid Este', lat: 40.4310, lon: -3.6600, icon: '🏟️' },
  { id: 'madrid_centro', name: 'Madrid Centro', sub: 'Gran Vía / Sol', lat: 40.4168, lon: -3.7038, icon: '🏙️' }
];

// WMO Weather interpretation codes (WMO code -> { label, icon, isRain })
function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return { label: 'Cielo despejado', icon: '☀️', isRain: false };
    case 1:
      return { label: 'Mayormente despejado', icon: '🌤️', isRain: false };
    case 2:
      return { label: 'Parcialmente nublado', icon: '⛅', isRain: false };
    case 3:
      return { label: 'Nublado', icon: '☁️', isRain: false };
    case 45:
    case 48:
      return { label: 'Niebla', icon: '🌫️', isRain: false };
    case 51:
      return { label: 'Llovizna ligera', icon: '🌦️', isRain: true };
    case 53:
      return { label: 'Llovizna moderada', icon: '🌦️', isRain: true };
    case 55:
      return { label: 'Llovizna densa', icon: '🌧️', isRain: true };
    case 61:
      return { label: 'Lluvia débil', icon: '🌧️', isRain: true };
    case 63:
      return { label: 'Lluvia moderada', icon: '🌧️', isRain: true };
    case 65:
      return { label: 'Lluvia fuerte', icon: '⛈️', isRain: true };
    case 71:
    case 73:
    case 75:
      return { label: 'Nieve', icon: '❄️', isRain: false };
    case 80:
      return { label: 'Chubascos suaves', icon: '🌦️', isRain: true };
    case 81:
      return { label: 'Chubascos moderados', icon: '🌧️', isRain: true };
    case 82:
      return { label: 'Chubascos violentos', icon: '⛈️', isRain: true };
    case 95:
      return { label: 'Tormenta eléctrica', icon: '⚡', isRain: true };
    case 96:
    case 99:
      return { label: 'Tormenta con granizo', icon: '⛈️', isRain: true };
    default:
      return { label: 'Nublado con claros', icon: '⛅', isRain: false };
  }
}

export default function WeatherApp() {
  const [selectedLocId, setSelectedLocId] = useState(() => {
    return localStorage.getItem('casita_weather_loc') || 'carabanchel';
  });

  const [weatherData, setWeatherData] = useState(() => {
    try {
      const cached = localStorage.getItem(`casita_weather_cache_${selectedLocId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (_) {
      return null;
    }
  });

  const [loading, setLoading] = useState(!weatherData);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const activeLoc = LOCATIONS.find(l => l.id === selectedLocId) || LOCATIONS[0];

  const fetchWeather = async (loc = activeLoc) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,precipitation_probability,precipitation,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
        `&timezone=Europe%2FMadrid`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al conectar con el servicio meteorológico');
      const data = await res.json();

      setWeatherData(data);
      const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(timeStr);

      try {
        localStorage.setItem(`casita_weather_cache_${loc.id}`, JSON.stringify(data));
        localStorage.setItem('casita_weather_loc', loc.id);
        // Guardar badge para el launcher
        const todayRainProb = data.daily?.precipitation_probability_max?.[0] || 0;
        localStorage.setItem('casita_weather_today_rain_prob', todayRainProb);
      } catch (_) {}
    } catch (err) {
      console.error('[Weather fetch error]', err);
      setError('No se pudo actualizar el tiempo en directo. Mostrando última previsión guardada.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(activeLoc);
  }, [selectedLocId]);

  // Cálculos para la alerta de lluvia de hoy
  const todayRainProb = weatherData?.daily?.precipitation_probability_max?.[0] || 0;
  const todayRainSum = weatherData?.daily?.precipitation_sum?.[0] || 0;
  const currentCode = weatherData?.current?.weather_code ?? 0;
  const currentWeather = getWeatherInfo(currentCode);

  // Analizar tramos horarios con lluvia en las próximas 24 horas
  const rainHours = [];
  if (weatherData?.hourly?.time) {
    const nowHour = new Date().getHours();
    for (let i = 0; i < 24; i++) {
      const prob = weatherData.hourly.precipitation_probability?.[i] || 0;
      const mm = weatherData.hourly.precipitation?.[i] || 0;
      const timeStr = weatherData.hourly.time[i] || '';
      const hour = parseInt(timeStr.split('T')[1]?.split(':')[0] || '0', 10);
      if (i >= nowHour && (prob >= 40 || mm > 0.2)) {
        rainHours.push({ hour, prob, mm });
      }
    }
  }

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '0.5rem 1rem 3rem 1rem',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Selector de Ubicaciones en Pastillas */}
      <div style={{
        display: 'flex',
        gap: '0.45rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '0.9rem',
        scrollbarWidth: 'none'
      }}>
        {LOCATIONS.map(loc => {
          const isSel = loc.id === selectedLocId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedLocId(loc.id)}
              style={{
                flexShrink: 0,
                padding: '0.55rem 0.95rem',
                borderRadius: '999px',
                border: isSel ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                background: isSel
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(14, 165, 233, 0.25) 100%)'
                  : 'rgba(255,255,255,0.04)',
                color: isSel ? '#ffffff' : '#94a3b8',
                fontWeight: isSel ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isSel ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{loc.icon}</span>
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>

      {/* BANNER DESTACADO DE ALERTA DE LLUVIA (REQUISITO CLAVE) */}
      {todayRainProb >= 40 || todayRainSum >= 0.5 ? (
        <div style={{
          padding: '1.1rem 1.25rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(30, 58, 138, 0.5) 100%)',
          border: '1.5px solid #38bdf8',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.35)',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🌧️</span>
              <div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  color: '#38bdf8',
                  textTransform: 'uppercase'
                }}>
                  Previsión Oficial AEMET / ECMWF
                </span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                  Hoy se esperan lluvias en {activeLoc.name}
                </h3>
              </div>
            </div>

            <div style={{
              background: '#0284c7',
              color: '#ffffff',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontWeight: 900,
              fontSize: '0.95rem'
            }}>
              {todayRainProb}%
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: '#e0f2fe', lineHeight: 1.45 }}>
            Probabilidad de precipitación del <strong>{todayRainProb}%</strong> con acumulación estimada de <strong>{todayRainSum} mm</strong>. Recuerda coger <strong>paraguas</strong> o ropa impermeable al salir de casa.
          </p>

          {rainHours.length > 0 && (
            <div style={{
              marginTop: '0.3rem',
              padding: '0.55rem 0.8rem',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              fontSize: '0.78rem',
              color: '#bae6fd',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>⏱️</span>
              <span>
                Horas con mayor lluvia: <strong>{rainHours.map(r => `${r.hour}:00 (${r.prob}%)`).slice(0, 4).join(', ')}</strong>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: '0.85rem 1.1rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>☀️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#34d399' }}>
              Día seco en {activeLoc.name} ({todayRainProb}% prob. de lluvia)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              No se esperan precipitaciones hoy. Ideal para ir en moto o salir a entrenar.
            </div>
          </div>
        </div>
      )}

      {/* TARJETA HERO: TIEMPO ACTUAL */}
      {weatherData?.current && (
        <div style={{
          padding: '1.5rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
          marginBottom: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                {activeLoc.sub}
              </div>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.6rem', fontWeight: 900 }}>
                {activeLoc.name}
              </h2>
              <div style={{ fontSize: '0.86rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{currentWeather.icon}</span>
                <span>{currentWeather.label}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '3.4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-1.5px', color: '#ffffff' }}>
                {Math.round(weatherData.current.temperature_2m)}°
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Sensación {Math.round(weatherData.current.apparent_temperature)}°
              </div>
            </div>
          </div>

          {/* Métricas secundarias (Humedad, Viento, Máx/Mín) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            marginTop: '1.2rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>MÁX / MÍN</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.15rem' }}>
                {Math.round(weatherData.daily?.temperature_2m_max?.[0] || 0)}° / {Math.round(weatherData.daily?.temperature_2m_min?.[0] || 0)}°
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>VIENTO</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.15rem' }}>
                {Math.round(weatherData.current.wind_speed_10m)} km/h
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>HUMEDAD</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.15rem' }}>
                {weatherData.current.relative_humidity_2m}%
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>LLUVIA HOY</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: todayRainSum > 0 ? '#38bdf8' : '#ffffff', marginTop: '0.15rem' }}>
                {todayRainSum} mm
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVISIÓN POR HORAS (Próximas 24 horas con indicador de lluvia) */}
      {weatherData?.hourly?.time && (
        <div style={{
          padding: '1.1rem',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⏱️</span>
            <span>PRÓXIMAS HORAS (TEMPERATURA Y LLUVIA)</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.85rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none'
          }}>
            {weatherData.hourly.time.slice(0, 24).map((t, idx) => {
              const hourNum = parseInt(t.split('T')[1]?.split(':')[0] || '0', 10);
              const temp = Math.round(weatherData.hourly.temperature_2m[idx]);
              const prob = weatherData.hourly.precipitation_probability[idx] || 0;
              const code = weatherData.hourly.weather_code[idx];
              const wInfo = getWeatherInfo(code);
              const isCurrentHour = new Date().getHours() === hourNum;

              return (
                <div
                  key={t}
                  style={{
                    flexShrink: 0,
                    width: '62px',
                    padding: '0.6rem 0.3rem',
                    borderRadius: '14px',
                    background: isCurrentHour ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isCurrentHour ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: isCurrentHour ? '#38bdf8' : '#94a3b8', fontWeight: 700 }}>
                    {isCurrentHour ? 'Ahora' : `${hourNum}:00`}
                  </span>
                  <span style={{ fontSize: '1.35rem', margin: '0.1rem 0' }}>{wInfo.icon}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>{temp}°</span>

                  {/* Probabilidad de lluvia en azul si > 0 */}
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: prob >= 40 ? '#38bdf8' : prob > 15 ? '#7dd3fc' : '#64748b'
                  }}>
                    {prob > 0 ? `${prob}%` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PREVISIÓN OFICIAL A 7 DÍAS */}
      {weatherData?.daily?.time && (
        <div style={{
          padding: '1.25rem',
          borderRadius: '22px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📅</span>
            <span>PREVISIÓN A 7 DÍAS · {activeLoc.name.toUpperCase()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {weatherData.daily.time.map((dStr, idx) => {
              const d = new Date(dStr + 'T12:00:00');
              const dayName = idx === 0 ? 'Hoy' : idx === 1 ? 'Mañana' : d.toLocaleDateString('es-ES', { weekday: 'short' });
              const dateFormatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
              const code = weatherData.daily.weather_code[idx];
              const wInfo = getWeatherInfo(code);
              const maxT = Math.round(weatherData.daily.temperature_2m_max[idx]);
              const minT = Math.round(weatherData.daily.temperature_2m_min[idx]);
              const rainProb = weatherData.daily.precipitation_probability_max[idx] || 0;
              const rainSum = weatherData.daily.precipitation_sum[idx] || 0;

              return (
                <div
                  key={dStr}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '14px',
                    background: idx === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: idx === 0 ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  {/* Nombre y fecha */}
                  <div style={{ width: '85px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', textTransform: 'capitalize' }}>
                      {dayName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {dateFormatted}
                    </div>
                  </div>

                  {/* Icono y condición */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, paddingLeft: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{wInfo.icon}</span>
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                      {wInfo.label}
                    </span>
                  </div>

                  {/* Probabilidad y mm de lluvia */}
                  <div style={{ width: '80px', textAlign: 'center' }}>
                    {rainProb > 0 ? (
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        background: rainProb >= 50 ? 'rgba(2, 132, 199, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                        color: rainProb >= 50 ? '#38bdf8' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.74rem'
                      }}>
                        🌧️ {rainProb}% {rainSum > 0 ? `(${rainSum}mm)` : ''}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>-</span>
                    )}
                  </div>

                  {/* Temperatura Máx / Mín con barrita */}
                  <div style={{ width: '85px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{minT}°</span>
                    <div style={{ width: '34px', height: '4px', borderRadius: '2px', background: 'linear-gradient(90deg, #38bdf8, #f59e0b)' }} />
                    <span style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 800 }}>{maxT}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pie de página con fuente y botón de actualizar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 0.2rem',
        fontSize: '0.74rem',
        color: '#64748b'
      }}>
        <span>📡 Modelos oficiales: AEMET / ECMWF (Open-Meteo)</span>
        <button
          type="button"
          onClick={() => fetchWeather(activeLoc)}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '0.2rem 0.5rem'
          }}
        >
          {loading ? 'Actualizando...' : `🔄 Actualizar ${lastUpdated ? `(${lastUpdated})` : ''}`}
        </button>
      </div>
    </div>
  );
}
