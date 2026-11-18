import React, { useState, useEffect } from 'react';

const BASE_LOCATIONS = [
  { id: 'carabanchel', name: 'Carabanchel', sub: 'Madrid Sur · Casa', lat: 40.3833, lon: -3.7333, icon: '🏠' },
  { id: 'alcobendas', name: 'Alcobendas', sub: 'Madrid Norte · Curro', lat: 40.5333, lon: -3.6333, icon: '💼' },
  { id: 'ventas', name: 'Ventas', sub: 'Madrid Este', lat: 40.4310, lon: -3.6600, icon: '🏟️' },
  { id: 'centro', name: 'Madrid Centro', sub: 'Sol / Gran Vía', lat: 40.4168, lon: -3.7038, icon: '🏙️' }
];

// Interpretación de códigos meteorológicos WMO
function getWeatherInfo(code) {
  switch (code) {
    case 0:
      return { label: 'Despejado', icon: '☀️', isRain: false };
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
      return { label: 'Chubascos', icon: '🌦️', isRain: true };
    case 81:
      return { label: 'Chubascos fuertes', icon: '🌧️', isRain: true };
    case 82:
      return { label: 'Chubascos violentos', icon: '⛈️', isRain: true };
    case 95:
      return { label: 'Tormenta eléctrica', icon: '⚡', isRain: true };
    case 96:
    case 99:
      return { label: 'Tormenta con granizo', icon: '⛈️', isRain: true };
    default:
      return { label: 'Nublado', icon: '⛅', isRain: false };
  }
}

export default function WeatherApp() {
  const [locationsList, setLocationsList] = useState(BASE_LOCATIONS);
  const [activeLocId, setActiveLocId] = useState('carabanchel');
  const [weatherByLoc, setWeatherByLoc] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // 1. Detección automática de Ubicación Real por GPS
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lon = Number(pos.coords.longitude.toFixed(4));
          const gpsLoc = {
            id: 'gps',
            name: 'Mi Ubicación',
            sub: 'Ubicación actual por GPS',
            lat,
            lon,
            icon: '📍'
          };
          setLocationsList([gpsLoc, ...BASE_LOCATIONS]);
          setActiveLocId('gps');
        },
        () => {},
        { timeout: 6000, maximumAge: 600000 }
      );
    }
  }, []);

  // 2. Carga en paralelo de todas las ubicaciones de la cuadrícula
  const fetchAllLocationsWeather = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        locationsList.map(async (loc) => {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&hourly=temperature_2m,precipitation_probability,precipitation,weather_code` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
            `&timezone=Europe%2FMadrid`;

          const res = await fetch(url);
          if (!res.ok) return { id: loc.id, data: null };
          const data = await res.json();
          return { id: loc.id, data };
        })
      );

      const map = {};
      results.forEach(r => {
        if (r.data) map[r.id] = r.data;
      });

      setWeatherByLoc(map);
      setLastUpdated(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));

      // Guardar alerta de lluvia de Carabanchel o GPS para el launcher
      const primaryLoc = map['gps'] || map['carabanchel'];
      if (primaryLoc?.daily?.precipitation_probability_max?.[0] !== undefined) {
        localStorage.setItem('casita_weather_today_rain_prob', primaryLoc.daily.precipitation_probability_max[0]);
      }
    } catch (e) {
      console.error('Error cargando tiempo en cuadrícula:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLocationsWeather();
  }, [locationsList.length]);

  const activeWeatherData = weatherByLoc[activeLocId] || weatherByLoc['carabanchel'] || Object.values(weatherByLoc)[0];
  const activeLocation = locationsList.find(l => l.id === activeLocId) || locationsList[0];

  // Comprobar si hay alertas de lluvia en cualquiera de las zonas
  const rainAlerts = locationsList.map(loc => {
    const data = weatherByLoc[loc.id];
    const prob = data?.daily?.precipitation_probability_max?.[0] || 0;
    const sum = data?.daily?.precipitation_sum?.[0] || 0;
    return { ...loc, prob, sum, isRain: prob >= 40 || sum >= 0.5 };
  }).filter(r => r.isRain);

  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '0.4rem 0.5rem 3.5rem 0.5rem',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* BANNER GENERAL DE ALERTA DE LLUVIA */}
      {rainAlerts.length > 0 ? (
        <div style={{
          padding: '1.1rem 1.25rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(30, 58, 138, 0.55) 100%)',
          border: '1.5px solid #38bdf8',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.35)',
          marginBottom: '1.1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🌧️</span>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '1px' }}>
                ALERTA OFICIAL AEMET / ECMWF
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                Hoy se esperan lluvias en tus zonas habituales
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
            {rainAlerts.map(a => (
              <span
                key={a.id}
                style={{
                  background: 'rgba(2, 132, 199, 0.5)',
                  border: '1px solid #38bdf8',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}
              >
                {a.icon} {a.name}: {a.prob}% lluvia {a.sum > 0 ? `(~${a.sum} mm)` : ''}
              </span>
            ))}
          </div>

          <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.8rem', color: '#e0f2fe' }}>
            💡 Coge paraguas o ropa de lluvia antes de salir de casa o desplazarte al trabajo.
          </p>
        </div>
      ) : (
        <div style={{
          padding: '0.85rem 1.1rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          marginBottom: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>☀️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#34d399' }}>
              Día seco sin lluvias en Madrid
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              Sin probabilidad de lluvia en Carabanchel, Alcobendas ni Ventas. Ideal para moto.
            </div>
          </div>
        </div>
      )}

      {/* TÍTULO DE LA CUADRÍCULA */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
        padding: '0 0.2rem'
      }}>
        <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>
          CUADRÍCULA DE ZONAS (PULSA PARA VER 7 DÍAS)
        </div>
        <button
          type="button"
          onClick={fetchAllLocationsWeather}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Cargando...' : `🔄 Actualizar ${lastUpdated ? `(${lastUpdated})` : ''}`}
        </button>
      </div>

      {/* CUADRÍCULA DE UBICACIONES (TODO VISIBLE A LA VEZ, SIN PESTAÑAS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.4rem'
      }}>
        {locationsList.map((loc) => {
          const w = weatherByLoc[loc.id];
          const isSelected = loc.id === activeLocId;
          const currentT = w?.current ? Math.round(w.current.temperature_2m) : '--';
          const maxT = w?.daily?.temperature_2m_max?.[0] !== undefined ? Math.round(w.daily.temperature_2m_max[0]) : '--';
          const minT = w?.daily?.temperature_2m_min?.[0] !== undefined ? Math.round(w.daily.temperature_2m_min[0]) : '--';
          const rainP = w?.daily?.precipitation_probability_max?.[0] || 0;
          const rainMm = w?.daily?.precipitation_sum?.[0] || 0;
          const code = w?.current?.weather_code ?? 0;
          const wInfo = getWeatherInfo(code);
          const hasRainAlert = rainP >= 40 || rainMm >= 0.5;

          return (
            <div
              key={loc.id}
              onClick={() => setActiveLocId(loc.id)}
              style={{
                padding: '1rem',
                borderRadius: '20px',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.28) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)',
                border: isSelected
                  ? '2px solid #38bdf8'
                  : hasRainAlert
                  ? '1.5px solid rgba(56, 189, 248, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected
                  ? '0 8px 25px rgba(2, 132, 199, 0.35)'
                  : '0 4px 16px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Cabecera de la tarjeta */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{loc.icon}</span>
                      <span style={{ fontWeight: 900, fontSize: '0.98rem', color: '#ffffff' }}>
                        {loc.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                      {loc.sub}
                    </div>
                  </div>

                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{wInfo.icon}</span>
                </div>

                {/* Temperatura Actual */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.65rem 0 0.35rem 0' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>
                    {currentT}°
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>
                    {wInfo.label}
                  </span>
                </div>
              </div>

              {/* Pie de la tarjeta: Alerta Lluvia y Máx/Mín */}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Badge de Lluvia */}
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '8px',
                    background: hasRainAlert ? 'rgba(2, 132, 199, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                    color: hasRainAlert ? '#38bdf8' : '#94a3b8'
                  }}>
                    {rainP > 0 ? `🌧️ ${rainP}%` : '☀️ 0%'}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700 }}>
                    {maxT}° / {minT}°
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECCIÓN DETALLADA DE LA UBICACIÓN ACTIVA */}
      {activeWeatherData && (
        <div style={{
          padding: '1.3rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
          marginBottom: '1.4rem'
        }}>
          {/* Cabecera del detalle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase' }}>
                DETALLE SELECCIONADO EN CUADRÍCULA
              </div>
              <h2 style={{ margin: '0.1rem 0 0 0', fontSize: '1.35rem', fontWeight: 900 }}>
                {activeLocation.icon} {activeLocation.name}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                {Math.round(activeWeatherData.current?.temperature_2m || 0)}°C
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Sensación {Math.round(activeWeatherData.current?.apparent_temperature || 0)}°C
              </div>
            </div>
          </div>

          {/* Métricas secundarias */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            padding: '0.75rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>LLUVIA HOY</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.15rem' }}>
                {activeWeatherData.daily?.precipitation_sum?.[0] || 0} mm
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>PROBABILIDAD</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.15rem' }}>
                {activeWeatherData.daily?.precipitation_probability_max?.[0] || 0}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>VIENTO</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.15rem' }}>
                {Math.round(activeWeatherData.current?.wind_speed_10m || 0)} km/h
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>HUMEDAD</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.15rem' }}>
                {activeWeatherData.current?.relative_humidity_2m || 0}%
              </div>
            </div>
          </div>

          {/* Horas de hoy (Carrusel horizontal de las próximas 24 horas) */}
          {activeWeatherData.hourly?.time && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.65rem' }}>
                PRÓXIMAS 24 HORAS EN {activeLocation.name.toUpperCase()}:
              </div>

              <div style={{
                display: 'flex',
                gap: '0.65rem',
                overflowX: 'auto',
                paddingBottom: '0.4rem',
                scrollbarWidth: 'none'
              }}>
                {activeWeatherData.hourly.time.slice(0, 24).map((t, idx) => {
                  const hourNum = parseInt(t.split('T')[1]?.split(':')[0] || '0', 10);
                  const temp = Math.round(activeWeatherData.hourly.temperature_2m[idx]);
                  const prob = activeWeatherData.hourly.precipitation_probability[idx] || 0;
                  const code = activeWeatherData.hourly.weather_code[idx];
                  const wInfo = getWeatherInfo(code);
                  const isCurrentHour = new Date().getHours() === hourNum;

                  return (
                    <div
                      key={t}
                      style={{
                        flexShrink: 0,
                        width: '58px',
                        padding: '0.55rem 0.25rem',
                        borderRadius: '12px',
                        background: isCurrentHour ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        border: isCurrentHour ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', color: isCurrentHour ? '#38bdf8' : '#94a3b8', fontWeight: 700 }}>
                        {isCurrentHour ? 'Ahora' : `${hourNum}:00`}
                      </span>
                      <span style={{ fontSize: '1.25rem' }}>{wInfo.icon}</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800 }}>{temp}°</span>
                      <span style={{
                        fontSize: '0.66rem',
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
        </div>
      )}

      {/* PREVISIÓN OFICIAL A 7 DÍAS */}
      {activeWeatherData?.daily?.time && (
        <div style={{
          padding: '1.25rem',
          borderRadius: '22px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📅</span>
            <span>PREVISIÓN COMPLETA A 7 DÍAS · {activeLocation.name.toUpperCase()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {activeWeatherData.daily.time.map((dStr, idx) => {
              const d = new Date(dStr + 'T12:00:00');
              const dayName = idx === 0 ? 'Hoy' : idx === 1 ? 'Mañana' : d.toLocaleDateString('es-ES', { weekday: 'short' });
              const dateFormatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
              const code = activeWeatherData.daily.weather_code[idx];
              const wInfo = getWeatherInfo(code);
              const maxT = Math.round(activeWeatherData.daily.temperature_2m_max[idx]);
              const minT = Math.round(activeWeatherData.daily.temperature_2m_min[idx]);
              const rainProb = activeWeatherData.daily.precipitation_probability_max[idx] || 0;
              const rainSum = activeWeatherData.daily.precipitation_sum[idx] || 0;

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
                  <div style={{ width: '85px', textAlign: 'center' }}>
                    {rainProb > 0 ? (
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        background: rainProb >= 40 ? 'rgba(2, 132, 199, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                        color: rainProb >= 40 ? '#38bdf8' : '#94a3b8',
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

      {/* Fuente oficial */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: '#64748b' }}>
        📡 Datos oficiales: AEMET / ECMWF vía Open-Meteo
      </div>
    </div>
  );
}
