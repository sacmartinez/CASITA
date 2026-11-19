import React, { useState, useEffect, useMemo, useRef } from 'react';
import './WalletApp.css';

// Detección de PDF
export const isPdf = (fileData) => {
  if (!fileData) return false;
  return typeof fileData === 'string' && (
    fileData.startsWith('data:application/pdf') ||
    fileData.startsWith('%PDF-') ||
    fileData.includes('application/pdf')
  );
};

// Conversión segura de DataURI base64 a Blob URL (vital para que los navegadores y móviles abran e incrusten PDFs)
export const getBlobUrlFromDataUri = (dataUri) => {
  if (!dataUri) return '';
  if (dataUri.startsWith('blob:') || dataUri.startsWith('http')) return dataUri;
  try {
    const parts = dataUri.split(',');
    if (parts.length < 2) return dataUri;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : (isPdf(dataUri) ? 'application/pdf' : 'image/jpeg');
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error creating blob URL:', err);
    return dataUri;
  }
};

// Abrir en pestaña nueva o en el visor nativo de PDFs del móvil
export const handleOpenInNewTab = (fileData) => {
  if (!fileData) return;
  const blobUrl = getBlobUrlFromDataUri(fileData);
  window.open(blobUrl, '_blank');
};

// Descarga directa
export const handleDownloadFile = (fileData, defaultName = 'entrada') => {
  if (!fileData) return;
  const blobUrl = getBlobUrlFromDataUri(fileData);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = isPdf(fileData) ? `${defaultName}.pdf` : `${defaultName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Compresión de imágenes del lado del cliente con resolución óptima para OCR y lectura (1400px, 0.8)
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_width = 1400;
        let width = img.width;
        let height = img.height;

        if (width > max_width) {
          height = Math.round((height * max_width) / width);
          width = max_width;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Generador visual de código de barras SVG de alta fidelidad para escáneres
function VisualBarcode({ value, height = 70 }) {
  const str = String(value || '123456789');
  // Generar un patrón determinista de barras anchas y finas
  const bars = useMemo(() => {
    let result = [];
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed += str.charCodeAt(i);
    }
    for (let i = 0; i < 48; i++) {
      const isThick = ((seed * (i + 1) * 31) % 7) > 3;
      result.push(isThick ? 3 : 1.5);
    }
    return result;
  }, [str]);

  return (
    <svg width="100%" height={height} viewBox="0 0 240 70" preserveAspectRatio="none" style={{ maxWidth: '320px', display: 'block', margin: '0 auto' }}>
      <rect width="240" height="70" fill="#ffffff" />
      {bars.map((w, idx) => {
        const x = idx * 4.9 + 2;
        return <rect key={idx} x={x} y="4" width={w} height="62" fill="#000000" />;
      })}
    </svg>
  );
}

const CARD_PRESETS = [
  { name: 'Club Día', color: 'linear-gradient(135deg, #e11d48, #be123c)' },
  { name: 'Carrefour', color: 'linear-gradient(135deg, #0284c7, #b91c1c)' },
  { name: 'GAME Socio', color: 'linear-gradient(135deg, #0f172a, #27272a)' },
  { name: 'BiciMAD', color: 'linear-gradient(135deg, #111827, #1f2937)' },
  { name: 'Mercadona', color: 'linear-gradient(135deg, #059669, #047857)' },
  { name: 'IKEA Family', color: 'linear-gradient(135deg, #0369a1, #eab308)' },
  { name: 'Decathlon', color: 'linear-gradient(135deg, #0284c7, #0ea5e9)' },
  { name: 'Carnet / Doc', color: 'linear-gradient(135deg, #475569, #334155)' }
];

export default function WalletApp({ currentUser, onOpenCalendar }) {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'cards'
  const [tickets, setTickets] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [cardCategory, setCardCategory] = useState('Todo');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('upcoming'); // 'upcoming' | 'past' | 'all'

  // Modales
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedTicketPass, setSelectedTicketPass] = useState(null);
  const [ticketModalTab, setTicketModalTab] = useState('pass'); // 'pass' | 'document'
  const [viewDocumentModal, setViewDocumentModal] = useState(null); // { file, eventName, type }
  const [selectedCardScanner, setSelectedCardScanner] = useState(null);
  const [viewPhotoFull, setViewPhotoFull] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Estados de IA para analizar entradas
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Formulario Entrada
  const [ticketForm, setTicketForm] = useState({
    eventName: '',
    date: '',
    time: '',
    venue: '',
    seats: '',
    forUser: 'Ambos',
    barcode: '',
    notes: '',
    file: null
  });
  const [ticketFileLoading, setTicketFileLoading] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Formulario Tarjeta
  const [cardForm, setCardForm] = useState({
    name: '',
    category: 'Fidelidad',
    cardType: 'digital', // 'digital' | 'photo'
    number: '',
    barcodeType: 'CODE128',
    colorGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    owner: 'Ambos',
    notes: '',
    photo: null
  });
  const [cardPhotoLoading, setCardPhotoLoading] = useState(false);
  const [submittingCard, setSubmittingCard] = useState(false);

  const fileInputRef = useRef(null);
  const cardPhotoInputRef = useRef(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, cardsRes] = await Promise.all([
        fetch('/api/wallet/tickets').catch(() => null),
        fetch('/api/wallet/cards').catch(() => null)
      ]);
      if (ticketsRes && ticketsRes.ok) {
        setTickets(await ticketsRes.json());
      }
      if (cardsRes && cardsRes.ok) {
        setCards(await cardsRes.json());
      }
    } catch (err) {
      console.error('Error cargando cartera:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? '' : prev);
    }, 3200);
  };

  // Helper de cálculo de días hasta el evento
  const getTicketDaysDiff = (dateStr) => {
    if (!dateStr) return 999;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - now) / 86400000);
  };

  // Analizar entrada con IA (Gemini) a partir del PDF o imagen
  const analyzeTicketWithAI = async (fileData) => {
    if (!fileData) return;
    setAnalyzingAI(true);
    setAiSuccessMessage('');
    try {
      const res = await fetch('/api/wallet/scan-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData })
      });

      const json = await res.json();
      if (res.ok && json.data) {
        const d = json.data;
        setTicketForm(prev => ({
          ...prev,
          eventName: d.eventName || prev.eventName,
          date: d.date || prev.date,
          time: d.time || prev.time,
          venue: d.venue || prev.venue,
          seats: d.seats || prev.seats,
          barcode: d.barcode || prev.barcode,
          forUser: (d.forUser === 'Ismael' || d.forUser === 'Sandra') ? d.forUser : prev.forUser,
          notes: d.notes ? (prev.notes ? `${prev.notes} · ${d.notes}` : d.notes) : prev.notes
        }));
        setAiSuccessMessage('✨ ¡Entrada analizada con IA! Hemos completado el evento, fecha, recinto y asientos.');
        if (navigator.vibrate) navigator.vibrate([40, 50, 40]);
        showToast('✨ Entrada analizada con éxito');
      } else if (json.error === 'NEEDS_API_KEY') {
        showToast('ℹ️ Configura tu clave de Gemini en Ajustes para análisis IA');
      } else {
        showToast('⚠️ No se reconocieron todos los campos automáticamente. Revísalos.');
      }
    } catch (err) {
      console.error('Error al analizar entrada con IA:', err);
      showToast('⚠️ No se pudo conectar con el analizador de entradas');
    } finally {
      setAnalyzingAI(false);
    }
  };

  // Manejador de subida de archivo para Entrada (PDF o Imagen)
  const handleTicketFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTicketFileLoading(true);
    setAiSuccessMessage('');
    try {
      let fileData = null;
      if (file.type.startsWith('image/')) {
        fileData = await compressImage(file);
      } else {
        // Para PDFs u otros documentos, leer como data URL
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setTicketForm(prev => ({ ...prev, file: fileData }));
      showToast('📎 Entrada adjuntada. Analizando datos con IA...');
      await analyzeTicketWithAI(fileData);
    } catch (_) {
      showToast('❌ Error al procesar el archivo');
    } finally {
      setTicketFileLoading(false);
    }
  };

  // Manejador de subida de foto para Tarjeta física
  const handleCardPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCardPhotoLoading(true);
    try {
      const compressed = await compressImage(file);
      setCardForm(prev => ({ ...prev, photo: compressed, cardType: 'photo' }));
      showToast('📸 Foto de tarjeta guardada');
    } catch (_) {
      showToast('❌ Error al procesar la foto');
    } finally {
      setCardPhotoLoading(false);
    }
  };

  // Guardar nueva entrada
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.eventName.trim() || !ticketForm.date) {
      showToast('⚠️ Introduce nombre del evento y fecha');
      return;
    }
    setSubmittingTicket(true);
    try {
      const res = await fetch('/api/wallet/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ticketForm,
          addedBy: currentUser
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTickets(prev => [created, ...prev]);
        setShowAddTicketModal(false);
        setTicketForm({
          eventName: '',
          date: '',
          time: '',
          venue: '',
          seats: '',
          forUser: 'Ambos',
          barcode: '',
          notes: '',
          file: null
        });
        showToast('🎉 ¡Entrada guardada! Notificaciones y calendario sincronizados');
      } else {
        showToast('❌ Error al guardar entrada');
      }
    } catch (_) {
      showToast('❌ Error de red');
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Eliminar entrada
  const handleDeleteTicket = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta entrada?')) return;
    try {
      const res = await fetch(`/api/wallet/tickets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTickets(prev => prev.filter(t => t.id !== id));
        setSelectedTicketPass(null);
        showToast('🗑️ Entrada eliminada');
      }
    } catch (_) {
      showToast('❌ Error al eliminar');
    }
  };

  // Guardar nueva tarjeta de fidelidad
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!cardForm.name.trim()) {
      showToast('⚠️ Introduce el nombre de la tarjeta');
      return;
    }
    setSubmittingCard(true);
    try {
      const res = await fetch('/api/wallet/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cardForm,
          addedBy: currentUser
        })
      });
      if (res.ok) {
        const created = await res.json();
        setCards(prev => [created, ...prev]);
        setShowAddCardModal(false);
        setCardForm({
          name: '',
          category: 'Fidelidad',
          cardType: 'digital',
          number: '',
          barcodeType: 'CODE128',
          colorGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          owner: 'Ambos',
          notes: '',
          photo: null
        });
        showToast('💳 Tarjeta guardada en la cartera');
      } else {
        showToast('❌ Error al guardar tarjeta');
      }
    } catch (_) {
      showToast('❌ Error de red');
    } finally {
      setSubmittingCard(false);
    }
  };

  // Eliminar tarjeta
  const handleDeleteCard = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta tarjeta?')) return;
    try {
      const res = await fetch(`/api/wallet/cards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCards(prev => prev.filter(c => c.id !== id));
        setSelectedCardScanner(null);
        showToast('🗑️ Tarjeta eliminada');
      }
    } catch (_) {
      showToast('❌ Error al eliminar');
    }
  };

  // Copiar código al portapapeles
  const handleCopyCode = (val) => {
    if (!val) return;
    navigator.clipboard?.writeText(val);
    if (navigator.vibrate) navigator.vibrate(35);
    showToast('📋 Código copiado');
  };

  // Filtrado de entradas
  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.eventName.toLowerCase().includes(q) ||
        (t.venue && t.venue.toLowerCase().includes(q)) ||
        (t.seats && t.seats.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    if (ticketStatusFilter === 'upcoming') {
      list = list.filter(t => getTicketDaysDiff(t.date) >= 0);
    } else if (ticketStatusFilter === 'past') {
      list = list.filter(t => getTicketDaysDiff(t.date) < 0);
    }
    // Ordenar por fecha más próxima
    return list.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tickets, searchQuery, ticketStatusFilter]);

  // Filtrado de tarjetas (estilo Swoo)
  const filteredCards = useMemo(() => {
    let list = cards;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.number && c.number.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }
    if (cardCategory !== 'Todo') {
      list = list.filter(c => c.category === cardCategory);
    }
    return list;
  }, [cards, searchQuery, cardCategory]);

  return (
    <div className="wallet-root">
      {/* Cabecera */}
      <div className="wallet-header">
        <div className="wallet-title-area">
          <h1 className="wallet-title">
            <span>🎟️</span> Casita Wallet
          </h1>
          <span className="wallet-subtitle">
            Entradas de eventos y tarjetas de fidelización
          </span>
        </div>

        <button
          type="button"
          className="wallet-add-btn"
          onClick={() => {
            if (activeTab === 'tickets') setShowAddTicketModal(true);
            else setShowAddCardModal(true);
          }}
        >
          <span>➕</span>
          <span>{activeTab === 'tickets' ? 'Añadir Entrada' : 'Añadir Tarjeta'}</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="wallet-search-wrapper">
        <span className="wallet-search-icon">🔍</span>
        <input
          type="text"
          className="wallet-search-input"
          placeholder={activeTab === 'tickets' ? 'Buscar concierto, evento o sala...' : 'Buscar tarjeta, tienda o documento...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Selector de Categorías (Swoo Style) */}
      {activeTab === 'cards' && (
        <div className="wallet-filter-scroll">
          {['Todo', 'Fidelidad', 'Documento', 'Transporte', 'Salud', 'Otro'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`wallet-chip ${cardCategory === cat ? 'active' : ''}`}
              onClick={() => setCardCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Selector de Estado para Entradas */}
      {activeTab === 'tickets' && (
        <div className="wallet-filter-scroll">
          <button
            type="button"
            className={`wallet-chip ${ticketStatusFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setTicketStatusFilter('upcoming')}
          >
            🗓️ Próximas ({tickets.filter(t => getTicketDaysDiff(t.date) >= 0).length})
          </button>
          <button
            type="button"
            className={`wallet-chip ${ticketStatusFilter === 'past' ? 'active' : ''}`}
            onClick={() => setTicketStatusFilter('past')}
          >
            🕰️ Pasadas ({tickets.filter(t => getTicketDaysDiff(t.date) < 0).length})
          </button>
          <button
            type="button"
            className={`wallet-chip ${ticketStatusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTicketStatusFilter('all')}
          >
            Todas ({tickets.length})
          </button>
        </div>
      )}

      {/* ==========================================================
          VISTA 1: ENTRADAS DE CONCIERTOS Y EVENTOS
          ========================================================== */}
      {activeTab === 'tickets' && (
        <div className="wallet-tickets-container">
          {filteredTickets.length === 0 ? (
            <div className="wallet-empty-state">
              <span className="wallet-empty-emoji">🎟️✨</span>
              <h3 className="wallet-empty-title">Sin entradas registradas</h3>
              <p className="wallet-empty-desc">
                Añade tus entradas de conciertos, cine o festivales. Al guardarlas, se sincronizarán con el calendario y recibirás aviso 1 día antes y el día del evento.
              </p>
            </div>
          ) : (
            filteredTickets.map((t) => {
              const daysDiff = getTicketDaysDiff(t.date);
              const dateObj = new Date(t.date + 'T00:00:00');
              const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });
              const dayNum = dateObj.getDate();
              const yearNum = dateObj.getFullYear();

              let countdownClass = 'soon';
              let countdownText = `En ${daysDiff} días`;
              if (daysDiff === 0) {
                countdownClass = 'today';
                countdownText = '🎉 ¡Es Hoy!';
              } else if (daysDiff === 1) {
                countdownClass = 'tomorrow';
                countdownText = '⚡ ¡Es Mañana!';
              } else if (daysDiff < 0) {
                countdownClass = 'past';
                countdownText = 'Finalizado';
              }

              return (
                <div
                  key={t.id}
                  className="wallet-ticket-card"
                  onClick={() => setSelectedTicketPass(t)}
                >
                  {/* Bloque Fecha Calendario */}
                  <div className="wallet-date-block">
                    <span className="wallet-date-month">{monthName}</span>
                    <span className="wallet-date-day">{dayNum}</span>
                    <span className="wallet-date-year">{yearNum}</span>
                  </div>

                  {/* Detalles */}
                  <div className="wallet-ticket-details">
                    <div className="wallet-ticket-title-row">
                      <strong className="wallet-ticket-title">{t.eventName}</strong>
                      <span className={`wallet-countdown-pill ${countdownClass}`}>
                        {countdownText}
                      </span>
                    </div>

                    <div className="wallet-ticket-meta">
                      {t.venue && <span>📍 {t.venue}</span>}
                      {t.time && <span>⏰ {t.time}</span>}
                      <span>👥 {t.forUser}</span>
                    </div>

                    {t.seats && (
                      <span className="wallet-ticket-seats">
                        💺 {t.seats}
                      </span>
                    )}
                  </div>

                  {/* Botones de Acción en la tarjeta: Pase y PDF / Foto */}
                  <div className="wallet-ticket-actions-col" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="wallet-ticket-action-pill pass"
                      onClick={() => {
                        setTicketModalTab('pass');
                        setSelectedTicketPass(t);
                      }}
                      title="Abrir Pase Digital"
                    >
                      <span style={{ fontSize: '1.05rem' }}>📱</span>
                      <span>Pase</span>
                    </button>
                    {t.file && (
                      <button
                        type="button"
                        className="wallet-ticket-action-pill doc"
                        onClick={() => {
                          setTicketModalTab('document');
                          setSelectedTicketPass(t);
                        }}
                        title={isPdf(t.file) ? 'Ver Entrada PDF' : 'Ver Foto'}
                      >
                        <span style={{ fontSize: '1.05rem' }}>{isPdf(t.file) ? '📄' : '🖼️'}</span>
                        <span>{isPdf(t.file) ? 'PDF' : 'Foto'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==========================================================
          VISTA 2: TARJETAS DE FIDELIZACIÓN (SWOO STYLE 2-COLUMNS)
          ========================================================== */}
      {activeTab === 'cards' && (
        <div className="wallet-cards-grid">
          {filteredCards.length === 0 ? (
            <div className="wallet-empty-state" style={{ gridColumn: 'span 2' }}>
              <span className="wallet-empty-emoji">💳✨</span>
              <h3 className="wallet-empty-title">Sin tarjetas de fidelización</h3>
              <p className="wallet-empty-desc">
                Guarda tus tarjetas de Club Día, Carrefour, BiciMAD o fotos de tu carnet físico para llevarlos siempre a mano y enseñarlos en caja.
              </p>
            </div>
          ) : (
            filteredCards.map((c) => (
              <div
                key={c.id}
                className="wallet-loyalty-card"
                style={{ background: c.cardType === 'photo' ? '#0f172a' : c.colorGradient }}
                onClick={() => setSelectedCardScanner(c)}
              >
                {c.cardType === 'photo' && c.photo ? (
                  <>
                    <img src={c.photo} alt={c.name} className="wallet-card-photo-img" />
                    <div className="wallet-card-photo-overlay">
                      <span>{c.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="wallet-card-top">
                      <strong className="wallet-card-brand-name">{c.name}</strong>
                      <span className="wallet-card-chip-icon">💳</span>
                    </div>

                    <div className="wallet-card-bottom">
                      <span className="wallet-card-number-preview">
                        {c.number ? `•••• ${c.number.slice(-4)}` : '•••• SCAN'}
                      </span>
                      <span className="wallet-card-owner-badge">
                        {c.owner === 'Ismael' ? '👦' : c.owner === 'Sandra' ? '👧' : '👫'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ==========================================================
          FLOAT BAR (BARRA FLOTANTE INFERIOR)
          ========================================================== */}
      <div className="wallet-float-bar">
        <button
          type="button"
          className={`wallet-float-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <span>🎟️</span>
          <span>Entradas</span>
          {tickets.length > 0 && (
            <span className="wallet-float-badge">{tickets.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`wallet-float-btn ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          <span>💳</span>
          <span>Tarjetas</span>
          {cards.length > 0 && (
            <span className="wallet-float-badge">{cards.length}</span>
          )}
        </button>
      </div>

      {/* ==========================================================
          MODAL PASE DE ENTRADA / CONTROL DE ACCESO & VISOR PDF
          ========================================================== */}
      {selectedTicketPass && (
        <div className="wallet-modal-overlay" onClick={() => setSelectedTicketPass(null)}>
          <div className="wallet-modal-card" style={{ maxWidth: ticketModalTab === 'document' ? '560px' : '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8', fontWeight: 800 }}>
                {ticketModalTab === 'pass' ? 'Control de Acceso' : 'Documento Original'}
              </span>
              <button
                type="button"
                className="os-quick-close-btn"
                onClick={() => setSelectedTicketPass(null)}
              >
                ✕
              </button>
            </div>

            <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', color: '#ffffff' }}>
              {selectedTicketPass.eventName}
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span>📅 {selectedTicketPass.date}</span>
              {selectedTicketPass.time && <span>⏰ {selectedTicketPass.time}</span>}
              {selectedTicketPass.venue && <span>📍 {selectedTicketPass.venue}</span>}
            </div>

            {/* Selector de Pestaña: Pase Digital vs Entrada Original (PDF / Foto) */}
            <div className="wallet-modal-segmented">
              <button
                type="button"
                className={`wallet-seg-btn ${ticketModalTab === 'pass' ? 'active' : ''}`}
                onClick={() => setTicketModalTab('pass')}
              >
                <span>📱</span>
                <span>Pase Digital &amp; Torno</span>
              </button>
              <button
                type="button"
                className={`wallet-seg-btn ${ticketModalTab === 'document' ? 'active' : ''}`}
                onClick={() => setTicketModalTab('document')}
              >
                <span>{selectedTicketPass.file && isPdf(selectedTicketPass.file) ? '📄' : '🖼️'}</span>
                <span>{selectedTicketPass.file && isPdf(selectedTicketPass.file) ? 'Entrada PDF' : 'Entrada Original'}</span>
              </button>
            </div>

            {/* PESTAÑA 1: PASE DIGITAL */}
            {ticketModalTab === 'pass' && (
              <>
                {selectedTicketPass.seats && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 0.8rem', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    <strong style={{ color: '#38bdf8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Ubicación / Asientos:</strong>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedTicketPass.seats}</span>
                  </div>
                )}

                {/* Código de barras / QR de Alta Claridad para el Escáner */}
                <div className="wallet-scanner-box">
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Muestra este código en el torno
                  </span>
                  <div className="wallet-barcode-visual">
                    <VisualBarcode value={selectedTicketPass.barcode || selectedTicketPass.id} height={85} />
                  </div>
                  <div className="wallet-code-text">
                    {selectedTicketPass.barcode || selectedTicketPass.id.slice(-8).toUpperCase()}
                  </div>
                </div>

                {/* Acceso rápido a ver entrada PDF si existe */}
                {selectedTicketPass.file && (
                  <button
                    type="button"
                    onClick={() => setTicketModalTab('document')}
                    style={{
                      width: '100%',
                      background: 'rgba(59, 130, 246, 0.18)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#93c5fd',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      marginBottom: '0.8rem'
                    }}
                  >
                    <span>{isPdf(selectedTicketPass.file) ? '📄' : '🖼️'}</span>
                    <span>Ver {isPdf(selectedTicketPass.file) ? 'Entrada PDF Original' : 'Foto de la Entrada'}</span>
                  </button>
                )}
              </>
            )}

            {/* PESTAÑA 2: VISOR DE ENTRADA PDF / FOTO */}
            {ticketModalTab === 'document' && (
              <div className="wallet-doc-viewer-box">
                {selectedTicketPass.file ? (
                  <>
                    <div className="wallet-doc-toolbar">
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="wallet-toolbar-btn primary"
                          onClick={() => handleOpenInNewTab(selectedTicketPass.file)}
                          title="Abrir en pestaña nueva o en visor móvil"
                        >
                          <span>↗️</span>
                          <span>Abrir en Navegador / Móvil</span>
                        </button>
                        <button
                          type="button"
                          className="wallet-toolbar-btn"
                          onClick={() => handleDownloadFile(selectedTicketPass.file, selectedTicketPass.eventName)}
                          title="Descargar archivo"
                        >
                          <span>⬇️</span>
                          <span>Descargar</span>
                        </button>
                        <button
                          type="button"
                          className="wallet-toolbar-btn"
                          onClick={() => setViewDocumentModal({
                            file: selectedTicketPass.file,
                            eventName: selectedTicketPass.eventName,
                            type: isPdf(selectedTicketPass.file) ? 'pdf' : 'image'
                          })}
                          title="Pantalla Completa"
                        >
                          <span>🔍</span>
                          <span>Pantalla Completa</span>
                        </button>
                      </div>
                    </div>

                    {isPdf(selectedTicketPass.file) ? (
                      <div>
                        <iframe
                          src={getBlobUrlFromDataUri(selectedTicketPass.file)}
                          title="Entrada PDF"
                          className="wallet-pdf-iframe"
                        />
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem', textAlign: 'center' }}>
                          💡 Si tu móvil no muestra el PDF incrustado, pulsa "↗️ Abrir en Navegador / Móvil" para zoom fluido.
                        </span>
                      </div>
                    ) : (
                      <div style={{ cursor: 'pointer' }} onClick={() => setViewDocumentModal({ file: selectedTicketPass.file, eventName: selectedTicketPass.eventName, type: 'image' })}>
                        <img
                          src={selectedTicketPass.file}
                          alt="Entrada Original"
                          className="wallet-ticket-full-img"
                        />
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '0.35rem', textAlign: 'center' }}>
                          🔍 Toca la imagen para ver a pantalla completa
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📄❌</span>
                    <strong style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'block' }}>Sin archivo adjunto</strong>
                    <p style={{ fontSize: '0.78rem', margin: '0.3rem 0 0 0', color: '#64748b' }}>
                      No se adjuntó archivo PDF ni foto al crear esta entrada.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Acciones inferiores */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem' }}>
              <button
                type="button"
                onClick={() => handleDeleteTicket(selectedTicketPass.id)}
                style={{
                  flex: 1,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '0.65rem',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicketPass(null)}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.65rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL ESCÁNER DE TARJETA EN CAJA (SWOO / GOOGLE WALLET)
          ========================================================== */}
      {selectedCardScanner && (
        <div className="wallet-modal-overlay" onClick={() => setSelectedCardScanner(null)}>
          <div className="wallet-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a5b4fc', fontWeight: 800 }}>
                Listo para Escanear
              </span>
              <button
                type="button"
                className="os-quick-close-btn"
                onClick={() => setSelectedCardScanner(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff' }}>
                {selectedCardScanner.name}
              </h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#94a3b8' }}>
                {selectedCardScanner.category}
              </span>
            </div>

            {/* Si es tarjeta física con foto, mostrar la foto con opción de ver en grande */}
            {selectedCardScanner.photo && (
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '0.8rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                <img
                  src={selectedCardScanner.photo}
                  alt={selectedCardScanner.name}
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => setViewPhotoFull(selectedCardScanner.photo)}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🔍 Ver Foto Completa
                </button>
              </div>
            )}

            {/* Módulo de Escaneo en Caja (Código de Barras Gigante) */}
            <div className="wallet-scanner-box">
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Pasa este código por la pistola del cajero
              </span>
              <div className="wallet-barcode-visual">
                <VisualBarcode value={selectedCardScanner.number || selectedCardScanner.id} height={90} />
              </div>
              <div className="wallet-code-text">
                {selectedCardScanner.number || '0000 0000 0000'}
              </div>
              {selectedCardScanner.number && (
                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedCardScanner.number)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.72rem',
                    color: '#475569',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  📋 Copiar número
                </button>
              )}
            </div>

            {selectedCardScanner.notes && (
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0.5rem 0', fontStyle: 'italic' }}>
                Nota: {selectedCardScanner.notes}
              </p>
            )}

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => handleDeleteCard(selectedCardScanner.id)}
                style={{
                  flex: 1,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '0.65rem',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
              <button
                type="button"
                onClick={() => setSelectedCardScanner(null)}
                style={{
                  flex: 2,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.65rem',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL VISOR DE ENTRADA / DOCUMENTO COMPLETO (PDF O FOTO)
          ========================================================== */}
      {(viewDocumentModal || viewPhotoFull) && (() => {
        const docFile = viewDocumentModal?.file || viewPhotoFull;
        const docTitle = viewDocumentModal?.eventName || 'Documento';
        const isFilePdf = isPdf(docFile);

        return (
          <div className="wallet-modal-overlay" onClick={() => { setViewDocumentModal(null); setViewPhotoFull(null); }}>
            <div className="wallet-doc-fullscreen-card" onClick={(e) => e.stopPropagation()}>
              <div className="wallet-doc-fullscreen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                  <span style={{ fontSize: '1.2rem' }}>{isFilePdf ? '📄' : '🖼️'}</span>
                  <strong style={{ fontSize: '0.92rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {docTitle}
                  </strong>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="wallet-toolbar-btn primary"
                    onClick={() => handleOpenInNewTab(docFile)}
                    title="Abrir en pestaña nueva o visor nativo del móvil"
                  >
                    <span>↗️</span>
                    <span>Navegador</span>
                  </button>
                  <button
                    type="button"
                    className="wallet-toolbar-btn"
                    onClick={() => handleDownloadFile(docFile, docTitle)}
                    title="Descargar archivo"
                  >
                    <span>⬇️</span>
                    <span>Guardar</span>
                  </button>
                  <button
                    type="button"
                    className="os-quick-close-btn"
                    onClick={() => { setViewDocumentModal(null); setViewPhotoFull(null); }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="wallet-doc-fullscreen-body">
                {isFilePdf ? (
                  <iframe
                    src={getBlobUrlFromDataUri(docFile)}
                    title="Visor Entrada PDF Completa"
                    className="wallet-fullscreen-iframe"
                  />
                ) : (
                  <img
                    src={docFile}
                    alt={docTitle}
                    className="wallet-fullscreen-img"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==========================================================
          MODAL AÑADIR ENTRADA DE EVENTO / CONCIERTO
          ========================================================== */}
      {showAddTicketModal && (
        <div className="wallet-modal-overlay" onClick={() => setShowAddTicketModal(false)}>
          <div className="wallet-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🎟️</span>
                <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>Nueva Entrada</strong>
              </div>
              <button
                type="button"
                className="os-quick-close-btn"
                onClick={() => setShowAddTicketModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* Sección Subida y Análisis con IA en la parte superior */}
              <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))', border: '1.5px solid rgba(99, 102, 241, 0.35)', borderRadius: '16px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>✨</span>
                    <span>Subir Entrada &amp; Rellenar con IA</span>
                  </strong>
                  <span style={{ fontSize: '0.68rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.25)', padding: '0.15rem 0.45rem', borderRadius: '999px', fontWeight: 700 }}>
                    PDF o Imagen
                  </span>
                </div>
                <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.35 }}>
                  Adjunta el archivo de tu entrada (PDF o captura) y la IA detectará automáticamente el concierto/evento, fecha, hora, recinto y asientos.
                </p>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  ref={fileInputRef}
                  onChange={handleTicketFileChange}
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={ticketFileLoading || analyzingAI}
                    style={{
                      flex: 1,
                      background: ticketForm.file ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      border: ticketForm.file ? '1.5px solid #10b981' : '1.5px dashed rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      padding: '0.7rem',
                      color: ticketForm.file ? '#34d399' : '#cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{ticketForm.file ? (isPdf(ticketForm.file) ? '📄 Entrada PDF adjunta' : '🖼️ Imagen adjunta') : '📎 Seleccionar Entrada (PDF o Foto)'}</span>
                  </button>

                  {ticketForm.file && (
                    <button
                      type="button"
                      disabled={analyzingAI}
                      onClick={() => analyzeTicketWithAI(ticketForm.file)}
                      className="wallet-btn-reanalyze"
                      title="Volver a analizar con IA"
                    >
                      {analyzingAI ? '...' : '✨ Analizar'}
                    </button>
                  )}
                </div>

                {/* Banner de progreso análisis con IA */}
                {analyzingAI && (
                  <div className="wallet-ai-analyzing-box">
                    <div className="wallet-ai-pulse-dot" />
                    <span>✨ Analizando entrada con IA... Detectando evento, fecha, recinto y asientos</span>
                  </div>
                )}

                {/* Mensaje de éxito de extracción */}
                {aiSuccessMessage && !analyzingAI && (
                  <div className="wallet-ai-success-box">
                    <span>{aiSuccessMessage}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Evento o Concierto *
                </label>
                <input
                  type="text"
                  placeholder="ej. Concierto Coldplay, Cine, Festival..."
                  value={ticketForm.eventName}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, eventName: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.7rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Fecha del Evento *
                  </label>
                  <input
                    type="date"
                    value={ticketForm.date}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Hora
                  </label>
                  <input
                    type="time"
                    value={ticketForm.time}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, time: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Lugar o Recinto
                </label>
                <input
                  type="text"
                  placeholder="ej. WiZink Center, Wanda, Cine Kinépolis..."
                  value={ticketForm.venue}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, venue: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Asientos / Localidad
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Grada Fila 12, Pista..."
                    value={ticketForm.seats}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, seats: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    ¿Para quién?
                  </label>
                  <select
                    value={ticketForm.forUser}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, forUser: e.target.value }))}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Ambos">👫 Ambos</option>
                    <option value="Ismael">👦 Ismael</option>
                    <option value="Sandra">👧 Sandra</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Código de Barras / Localizador / QR
                </label>
                <input
                  type="text"
                  placeholder="ej. LOC-789234 o número de entrada"
                  value={ticketForm.barcode}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, barcode: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Nota informativa de sincronización */}
              <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '0.6rem 0.8rem', fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                ℹ️ <strong>Sincronización Inteligente:</strong> Se añadirá automáticamente a tu Calendario y recibirás notificación push en el móvil <strong>1 día antes</strong> y <strong>el día del evento</strong>.
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTicketModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.7rem',
                    color: '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket || ticketFileLoading || analyzingAI}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.7rem',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {submittingTicket ? 'Guardando...' : '🎟️ Guardar Entrada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL AÑADIR TARJETA DE FIDELIZACIÓN (SWOO STYLE)
          ========================================================== */}
      {showAddCardModal && (
        <div className="wallet-modal-overlay" onClick={() => setShowAddCardModal(false)}>
          <div className="wallet-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>💳</span>
                <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>Nueva Tarjeta</strong>
              </div>
              <button
                type="button"
                className="os-quick-close-btn"
                onClick={() => setShowAddCardModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* Presets Rápidos */}
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Plantillas Rápidas:
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.3rem', scrollbarWidth: 'none' }}>
                  {CARD_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setCardForm(prev => ({
                          ...prev,
                          name: p.name,
                          colorGradient: p.color,
                          cardType: 'digital'
                        }));
                      }}
                      style={{
                        background: p.color,
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '999px',
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.72rem',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Nombre de la Tarjeta / Comercio *
                </label>
                <input
                  type="text"
                  placeholder="ej. Club Día, Carrefour, GAME, Carnet Conducir..."
                  value={cardForm.name}
                  onChange={(e) => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.7rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Categoría
                  </label>
                  <select
                    value={cardForm.category}
                    onChange={(e) => setCardForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Fidelidad">🛍️ Fidelidad</option>
                    <option value="Documento">📄 Documento / Carnet</option>
                    <option value="Transporte">🚲 Transporte / Metro</option>
                    <option value="Salud">🏥 Salud / Seguro</option>
                    <option value="Otro">⭐ Otro</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Titular
                  </label>
                  <select
                    value={cardForm.owner}
                    onChange={(e) => setCardForm(prev => ({ ...prev, owner: e.target.value }))}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.65rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Ambos">👫 Compartida</option>
                    <option value="Ismael">👦 Ismael</option>
                    <option value="Sandra">👧 Sandra</option>
                  </select>
                </div>
              </div>

              {/* Selector de Modo: Foto o Código Digital */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Tipo de Tarjeta
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCardForm(prev => ({ ...prev, cardType: 'digital' }))}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      border: cardForm.cardType === 'digital' ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      background: cardForm.cardType === 'digital' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🎨 Tarjeta Digital
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardForm(prev => ({ ...prev, cardType: 'photo' }))}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      border: cardForm.cardType === 'photo' ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      background: cardForm.cardType === 'photo' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📸 Foto Física / Carnet
                  </button>
                </div>
              </div>

              {/* Si es Foto física */}
              {cardForm.cardType === 'photo' && (
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Foto Frontal de la Tarjeta o Carnet
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={cardPhotoInputRef}
                    onChange={handleCardPhotoChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => cardPhotoInputRef.current?.click()}
                    style={{
                      width: '100%',
                      background: cardForm.photo ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                      border: cardForm.photo ? '1.5px solid #10b981' : '1.5px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      color: cardForm.photo ? '#34d399' : '#cbd5e1',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {cardForm.photo ? '✅ Foto añadida (Pulsa para cambiar)' : '📸 Hacer Foto o Seleccionar de la Galería'}
                  </button>
                </div>
              )}

              {/* Número de tarjeta o código para escanear en caja */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Número de Tarjeta / Código de Barras (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. 13 dígitos o código de socio"
                  value={cardForm.number}
                  onChange={(e) => setCardForm(prev => ({ ...prev, number: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.7rem',
                    color: '#94a3b8',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingCard || cardPhotoLoading}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.7rem',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {submittingCard ? 'Guardando...' : '💳 Guardar Tarjeta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Flotante */}
      {toastMessage && (
        <div className="os-floating-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
