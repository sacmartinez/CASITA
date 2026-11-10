import React, { useState, useEffect, useRef } from 'react';

const SUPERMARKET_LOGOS = {
  LIDL: "https://e7.pngegg.com/pngimages/106/455/png-clipart-yellow-red-and-blue-lidl-logo-lidl-logo-retail-supermarket-toru%C5%84-lidl-food-text-thumbnail.png",
  MERCADONA: "https://logos-world.net/wp-content/uploads/2022/04/Mercadona-Symbol.png",
  AHORRAMAS: "https://www.laelipa.es/wp-content/uploads/ahorramas.png",
  PRIMAPRIX: "https://yt3.googleusercontent.com/-JDAOR7LpwSwdCPkRxAdla-Iy5sLapNxNaHcemHCaYyG_cWVQiZz9im1nSak-XeabKrVLMl_=s900-c-k-c0x00ffffff-no-rj"
};

const getSupermarketColor = (supermarket) => {
  switch (supermarket) {
    case 'LIDL': return '#2563eb'; // Azul LIDL
    case 'MERCADONA': return '#10b981'; // Verde Mercadona
    case 'AHORRAMAS': return '#ef4444'; // Rojo Ahorramas
    case 'PRIMAPRIX': return '#f43f5e'; // Naranja/Rosa Primaprix
    default: return 'var(--primary)'; // Púrpura primario para otros
  }
};

const getSupermarketBgColor = (supermarket) => {
  switch (supermarket) {
    case 'LIDL': return 'rgba(37, 99, 235, 0.12)';
    case 'MERCADONA': return 'rgba(16, 185, 129, 0.12)';
    case 'AHORRAMAS': return 'rgba(239, 68, 68, 0.12)';
    case 'PRIMAPRIX': return 'rgba(244, 63, 94, 0.12)';
    default: return 'rgba(139, 92, 246, 0.12)'; // Soft purple for custom supermarkets
  }
};

// Función para comprimir imagen en el navegador antes de enviarla a la IA
// Usa URL.createObjectURL para no saturar la memoria RAM en cámaras móviles de alta resolución
const compressImageToBase64 = (file, maxDim = 1100, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(objectUrl);
        resolve(compressedDataUrl);
      } catch (canvasErr) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo comprimir la imagen en el navegador (' + canvasErr.message + ').'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback: si el navegador no pudo decodificar vía ObjectURL, intentar con FileReader si el archivo es < 6MB
      if (file.size <= 6 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen del móvil.'));
        reader.readAsDataURL(file);
      } else {
        reject(new Error('El formato de la foto no es compatible o es demasiado pesada. Haz una captura o usa formato JPG.'));
      }
    };

    img.src = objectUrl;
  });
};

export default function ShoppingList({ currentUser }) {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados de Supermercados
  const [supermarkets, setSupermarkets] = useState(["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"]);
  const [selectedTab, setSelectedTab] = useState("TODOS");
  const [newSupermarket, setNewSupermarket] = useState('');
  const [showAddSupermarketForm, setShowAddSupermarketForm] = useState(false);
  const [itemSupermarket, setItemSupermarket] = useState('');
  const [customSupermarket, setCustomSupermarket] = useState('');

  // Estados para Catálogo de Precios y Escáner de Tickets IA
  const [productPrices, setProductPrices] = useState([]);
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Estados dentro del modal de escáner
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scannedSupermarket, setScannedSupermarket] = useState('LIDL');
  const [scannedCustomSupermarket, setScannedCustomSupermarket] = useState('');
  const [scannedItems, setScannedItems] = useState([]);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // Estados dentro del modal de catálogo
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilterSuper, setCatalogFilterSuper] = useState('TODOS');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSuper, setNewCatSuper] = useState('LIDL');
  const [newCatPrice, setNewCatPrice] = useState('');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editPriceName, setEditPriceName] = useState('');
  const [editPriceSuper, setEditPriceSuper] = useState('');
  const [editPriceVal, setEditPriceVal] = useState('');

  // Estados para la edición por pulsación larga
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editSupermarket, setEditSupermarket] = useState('');
  const [editCustomSupermarket, setEditCustomSupermarket] = useState('');

  const pressTimerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const fileInputRef = useRef(null);

  // Cargar lista al montar el componente
  useEffect(() => {
    fetchShopping();
    fetchSupermarkets();
    fetchPrices();
    fetchGeminiStatus();
  }, []);

  const fetchShopping = async () => {
    try {
      const res = await fetch('/api/shopping');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error al cargar lista de la compra:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const res = await fetch('/api/supermarkets');
      if (res.ok) {
        const data = await res.json();
        setSupermarkets(data);
      }
    } catch (err) {
      console.error('Error al cargar supermercados:', err);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/prices');
      if (res.ok) {
        setProductPrices(await res.json());
      }
    } catch (err) {
      console.error('Error al cargar catálogo de precios:', err);
    }
  };

  const fetchGeminiStatus = async () => {
    try {
      const res = await fetch('/api/gemini/status');
      if (res.ok) {
        const data = await res.json();
        setGeminiConfigured(!!data.configured);
      }
    } catch (err) {
      console.error('Error al comprobar estado de Gemini:', err);
    }
  };

  // Lógica de emparejamiento inteligente para estimar el precio de un artículo
  const estimateItemPrice = (itemText, itemSuper) => {
    if (!itemText || !productPrices || productPrices.length === 0) return null;

    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .trim();

    const toSingular = (w) => {
      if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
      if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
      return w;
    };

    const normQuery = normalize(itemText);
    if (!normQuery) return null;

    // Detectar multiplicador al principio o final (ej: "2 leches", "x3 tomates", "pack 6")
    let qty = 1;
    const qtyMatch = normQuery.match(/^(?:x\s*)?(\d+)\s+/) || normQuery.match(/\s+x\s*(\d+)$/);
    if (qtyMatch) {
      const parsedQty = parseInt(qtyMatch[1], 10);
      if (parsedQty > 0 && parsedQty <= 50) qty = parsedQty;
    }

    const cleanQuery = normQuery.replace(/^(?:x\s*)?\d+\s+/, '').replace(/\s+x\s*\d+$/, '').trim();
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length >= 2).map(toSingular);
    if (queryWords.length === 0) return null;

    const targetSuper = (itemSuper || (selectedTab !== 'TODOS' && selectedTab !== 'OTRO' ? selectedTab : '')).toUpperCase();

    let bestMatch = null;
    let bestScore = 0;

    for (const p of productPrices) {
      const normCat = normalize(p.name);
      const catWords = normCat.split(/\s+/).filter(w => w.length >= 2).map(toSingular);
      if (catWords.length === 0) continue;

      let score = 0;
      if (normCat === cleanQuery || catWords.join(' ') === queryWords.join(' ')) {
        score = 100; // Coincidencia exacta
      } else {
        // Contar palabras que coinciden
        let matchedWords = 0;
        for (const qw of queryWords) {
          if (catWords.some(cw => cw === qw || (cw.length >= 4 && qw.length >= 4 && (cw.includes(qw) || qw.includes(cw))))) {
            matchedWords++;
          }
        }
        if (matchedWords > 0) {
          // Proporción de coincidencia
          score = (matchedWords / Math.max(queryWords.length, catWords.length)) * 75;
          // Bonus si la primera palabra clave (ej. "tomate", "leche") coincide exactamente
          if (catWords[0] === queryWords[0]) {
            score += 15;
          }
        }
      }

      if (score >= 35) {
        // Bonus importante si coincide con el supermercado del producto o de la pestaña activa
        const sameSuper = targetSuper && p.supermarket === targetSuper;
        const totalScore = score + (sameSuper ? 25 : 0);

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMatch = p;
        }
      }
    }

    if (!bestMatch) return null;

    return {
      unitPrice: bestMatch.price,
      totalPrice: Number((bestMatch.price * qty).toFixed(2)),
      qty,
      matchedName: bestMatch.name,
      supermarket: bestMatch.supermarket,
      isExactSuper: !targetSuper || bestMatch.supermarket === targetSuper
    };
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    try {
      const res = await fetch('/api/gemini/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setGeminiConfigured(!!data.configured);
        setShowKeyConfig(false);
        setApiKeyInput('');
        setScanError('');
      }
    } catch (err) {
      setScanError('No se pudo guardar la clave de API.');
    }
  };

  const handleSelectReceiptImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanLoading(true);
    setScanError('');
    setScannedItems([]);

    const applyDetectedResult = (resultObj) => {
      const detectedSuper = (resultObj.supermarket || 'LIDL').toUpperCase();
      if (supermarkets.includes(detectedSuper)) {
        setScannedSupermarket(detectedSuper);
        setScannedCustomSupermarket('');
      } else {
        setScannedSupermarket('OTRO');
        setScannedCustomSupermarket(detectedSuper);
      }
      setScannedItems(
        (resultObj.items || []).map((it, idx) => ({
          id: it.id || `temp-${Date.now()}-${idx}`,
          name: it.name || it.rawName || 'Producto',
          rawName: it.rawName || it.name || '',
          price: parseFloat(String(it.price || 0).replace(',', '.')) || 0,
          selected: true
        }))
      );
    };

    // Escaneo directo desde el navegador hacia Google Gemini (evita bloqueos/cortes de Render)
    const scanDirectlyFromBrowser = async (imageBase64) => {
      const keyRes = await fetch('/api/gemini/key-value');
      if (!keyRes.ok) throw new Error('No se pudo obtener la clave de Gemini del servidor.');
      const { apiKey } = await keyRes.json();
      if (!apiKey) {
        setShowKeyConfig(true);
        throw new Error('Configura primero tu clave gratuita de Gemini IA.');
      }

      let mimeType = 'image/jpeg';
      let base64Data = imageBase64;
      const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }

      const promptText = `Eres un asistente experto en leer tickets de supermercado de España (Lidl, Mercadona, Ahorramas, Primaprix, Carrefour, Aldi, Dia, Alcampo, Eroski, etc.).
Analiza la imagen del ticket de compra o etiqueta de producto y extrae:
1. "supermarket": El nombre del supermercado en MAYÚSCULAS (ej: "LIDL", "MERCADONA", "AHORRAMAS", "PRIMAPRIX", "CARREFOUR", "ALDI", "DIA"). Si no aparece o es ilegible, pon "GENERAL".
2. "items": Lista de todos los productos comprados con su precio. Para cada producto devuelve:
   - "name": Nombre limpio, genérico, claro y fácil de buscar en una lista de la compra (Primera letra mayúscula, en singular, sin códigos ni pesos extraños. Ejemplo: si en el ticket pone "TOMATE PERA MALLA 1K", pon "Tomate" o "Tomate pera"; si pone "LECHE SEMI S/LACT 1L", pon "Leche semidesnatada sin lactosa" o "Leche").
   - "rawName": El texto original abreviado tal como sale en el ticket.
   - "price": El precio unitario (o precio del envase/pack) como número decimal con punto (ej: 2.10). Ignora líneas de "TOTAL", "IVA", "TARJETA", "CAMBIO" o bolsas si no son relevantes, pero incluye todos los artículos de compra.

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta, sin bloques markdown ni explicaciones:
{
  "supermarket": "LIDL",
  "items": [
    { "name": "Tomate", "rawName": "TOMATE RAMA", "price": 2.10 }
  ]
}`;

      const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
      let lastErr = 'sin respuesta';

      for (const model of models) {
        try {
          const genConfig = { temperature: 0.1 };
          if (model.includes('2.5-flash')) {
            genConfig.thinkingConfig = { thinkingBudget: 0 };
          }
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: promptText },
                    { inline_data: { mime_type: mimeType, data: base64Data } }
                  ]
                }],
                generationConfig: genConfig
              })
            }
          );

          const json = await resp.json();
          if (!resp.ok) {
            lastErr = json?.error?.message || `HTTP ${resp.status}`;
            continue;
          }

          const parts = json?.candidates?.[0]?.content?.parts || [];
          const textOut = parts.map(p => p.text || '').join('\n').trim();
          const cleaned = textOut.replace(/```json/gi, '').replace(/```/g, '').trim();
          const firstBrace = cleaned.indexOf('{');
          const lastBrace = cleaned.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
            if (parsed && Array.isArray(parsed.items)) {
              return parsed;
            }
          }
        } catch (err) {
          lastErr = err.message;
        }
      }
      throw new Error(`No se pudo leer el ticket (${lastErr}).`);
    };

    try {
      const compressedBase64 = await compressImageToBase64(file);

      // 1. Intentar primero directo desde el navegador hacia Gemini (más rápido, no pasa imagen grande por Render)
      try {
        const directData = await scanDirectlyFromBrowser(compressedBase64);
        applyDetectedResult(directData);
        return;
      } catch (directErr) {
        console.warn('Fallback a escaneo vía servidor:', directErr.message);
      }

      // 2. Fallback: escaneo a través del servidor backend
      const res = await fetch('/api/shopping/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: compressedBase64 })
      });

      const rawText = await res.text();
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (_) {
        throw new Error(`El servidor tardó demasiado o devolvió una respuesta inválida (HTTP ${res.status}). Inténtalo de nuevo.`);
      }

      if (!res.ok) {
        if (data.error === 'NEEDS_API_KEY' || data.error === 'INVALID_API_KEY') {
          setShowKeyConfig(true);
        }
        setScanError(data.message || `Error HTTP ${res.status} al analizar el ticket.`);
      } else {
        applyDetectedResult(data);
      }
    } catch (err) {
      console.error('Error escaneando ticket:', err);
      setScanError(`Fallo al analizar (${err.message || 'desconocido'}).`);
    } finally {
      setScanLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmScannedItems = async () => {
    const selected = scannedItems.filter(it => it.selected && it.name.trim() && Number(it.price) > 0);
    if (selected.length === 0) return;

    const finalSuper = scannedSupermarket === 'OTRO'
      ? (scannedCustomSupermarket.trim().toUpperCase() || 'GENERAL')
      : scannedSupermarket;

    try {
      const res = await fetch('/api/prices/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supermarket: finalSuper,
          items: selected.map(it => ({
            name: it.name.trim(),
            rawName: it.rawName,
            price: parseFloat(String(it.price).replace(',', '.')),
            supermarket: finalSuper
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProductPrices(data.prices || []);
        if (data.supermarkets) setSupermarkets(data.supermarkets);
        setShowScanModal(false);
        setScannedItems([]);
      }
    } catch (err) {
      console.error('Error al guardar precios del ticket:', err);
      setScanError('Error al guardar los productos en el catálogo.');
    }
  };

  const handleAddManualCatalogPrice = async (e) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatPrice) return;
    try {
      const res = await fetch('/api/prices/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supermarket: newCatSuper,
          items: [{
            name: newCatName.trim(),
            price: parseFloat(String(newCatPrice).replace(',', '.')),
            supermarket: newCatSuper
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProductPrices(data.prices || []);
        if (data.supermarkets) setSupermarkets(data.supermarkets);
        setNewCatName('');
        setNewCatPrice('');
      }
    } catch (err) {
      console.error('Error al añadir precio manual:', err);
    }
  };

  const handleSaveCatalogEdit = async (id) => {
    try {
      const res = await fetch(`/api/prices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editPriceName,
          supermarket: editPriceSuper,
          price: editPriceVal
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProductPrices(data.prices || []);
        if (data.supermarkets) setSupermarkets(data.supermarkets);
        setEditingPriceId(null);
      }
    } catch (err) {
      console.error('Error al editar precio del catálogo:', err);
    }
  };

  const handleDeleteCatalogPrice = async (id) => {
    try {
      const res = await fetch(`/api/prices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductPrices(await res.json());
      }
    } catch (err) {
      console.error('Error al eliminar precio:', err);
    }
  };

  const handleAddSupermarket = async (e) => {
    e.preventDefault();
    if (!newSupermarket.trim()) return;
    const name = newSupermarket.trim().toUpperCase();

    try {
      const res = await fetch('/api/supermarkets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        const data = await res.json();
        setSupermarkets(data);
        setSelectedTab(name);
        setItemSupermarket(name);
        setNewSupermarket('');
        setShowAddSupermarketForm(false);
      }
    } catch (err) {
      console.error('Error al añadir supermercado:', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    let supermarketToSave = itemSupermarket;
    if (itemSupermarket === "OTRO") {
      if (!customSupermarket.trim()) return;
      supermarketToSave = customSupermarket.trim().toUpperCase();
      
      // Auto-añadir súper nuevo
      try {
        const res = await fetch('/api/supermarkets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: supermarketToSave })
        });
        if (res.ok) {
          const data = await res.json();
          setSupermarkets(data);
        }
      } catch (err) {
        console.error('Error al auto-añadir súper:', err);
      }
    }

    try {
      const res = await fetch('/api/shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newItemText.trim(),
          note: newItemNote.trim(),
          supermarket: supermarketToSave,
          addedBy: currentUser
        })
      });

      if (res.ok) {
        const addedItem = await res.json();
        setItems(prev => [...prev, addedItem]);
        setNewItemText('');
        setNewItemNote('');
        setCustomSupermarket('');
        if (selectedTab !== "TODOS" && selectedTab !== "OTRO") {
          setItemSupermarket(selectedTab);
        } else {
          setItemSupermarket("");
        }
      }
    } catch (err) {
      console.error('Error al añadir item:', err);
    }
  };

  const handleToggleItem = async (id, currentCompleted) => {
    try {
      const nextCompleted = !currentCompleted;
      const res = await fetch(`/api/shopping/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: nextCompleted,
          completedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      }
    } catch (err) {
      console.error('Error al cambiar estado de item:', err);
    }
  };

  const handleStartPress = (item) => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setEditingItem(item);
      setEditTitle(item.text);
      setEditNote(item.note || '');
      
      const isStandard = supermarkets.includes(item.supermarket);
      if (isStandard) {
        setEditSupermarket(item.supermarket);
        setEditCustomSupermarket('');
      } else {
        setEditSupermarket("OTRO");
        setEditCustomSupermarket(item.supermarket);
      }
    }, 750); // 750ms para disparar edición
  };

  const handleCancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
  };

  const handleItemClick = (item) => {
    if (!isLongPressRef.current) {
      handleToggleItem(item.id, item.completed);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editingItem) return;

    let finalSupermarket = editSupermarket;
    if (editSupermarket === "OTRO") {
      if (!editCustomSupermarket.trim()) return;
      finalSupermarket = editCustomSupermarket.trim().toUpperCase();

      // Auto-registrar supermercado
      try {
        const res = await fetch('/api/supermarkets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: finalSupermarket })
        });
        if (res.ok) {
          const data = await res.json();
          setSupermarkets(data);
        }
      } catch (err) {
        console.error('Error al auto-añadir súper:', err);
      }
    }

    try {
      const res = await fetch(`/api/shopping/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editTitle.trim(),
          note: editNote.trim(),
          supermarket: finalSupermarket,
          updatedBy: currentUser
        })
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
        setEditingItem(null);
      }
    } catch (err) {
      console.error('Error al editar item:', err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const url = selectedTab !== "TODOS" 
        ? `/api/shopping/completed?supermarket=${encodeURIComponent(selectedTab)}`
        : '/api/shopping/completed';

      const res = await fetch(url, {
        method: 'DELETE'
      });
      if (res.ok) {
        const remaining = await res.json();
        setItems(remaining);
      }
    } catch (err) {
      console.error('Error al limpiar completados:', err);
    }
  };

  // Filtrar los items por el supermercado de la pestaña activa
  const filteredItems = items.filter(item => {
    if (selectedTab === "TODOS" || selectedTab === "OTRO") return true;
    return item.supermarket === selectedTab;
  });

  // Calcular estimación total del carrito visible (pendientes y total)
  const cartEstimation = filteredItems.reduce(
    (acc, item) => {
      const est = estimateItemPrice(item.text, item.supermarket);
      if (est) {
        acc.total += est.totalPrice;
        acc.matchedCount += 1;
        if (!item.completed) {
          acc.pendingTotal += est.totalPrice;
          acc.pendingMatched += 1;
        }
      } else if (!item.completed) {
        acc.unmatchedPending += 1;
      }
      return acc;
    },
    { total: 0, pendingTotal: 0, matchedCount: 0, pendingMatched: 0, unmatchedPending: 0 }
  );

  // vista previa en vivo mientras escribes un producto nuevo
  const liveInputEstimate = newItemText.trim()
    ? estimateItemPrice(
        newItemText,
        itemSupermarket === 'OTRO' ? customSupermarket.toUpperCase() : itemSupermarket
      )
    : null;

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 className="card-title">
          <span className="card-title-icon">🛒</span>
          Lista de la Compra
        </h2>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setScanError('');
              setShowScanModal(true);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.25))',
              color: '#34d399',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Subir foto de un ticket para que la IA aprenda los precios"
          >
            <span>📸</span> Escanear Ticket IA
          </button>

          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Ver y corregir precios guardados por supermercado"
          >
            <span>🏷️</span> Precios ({productPrices.length})
          </button>

          {filteredItems.some(i => i.completed) && (
            <button 
              onClick={handleClearCompleted}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.7rem', fontSize: '0.75rem' }}
              title={`Limpiar items completados ${selectedTab !== 'TODOS' ? 'de ' + selectedTab : ''}`}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Banner de Presupuesto Estimado si hay productos con precio conocido */}
      {filteredItems.length > 0 && cartEstimation.matchedCount > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '0.65rem 0.9rem',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💶</span>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                Coste estimado {selectedTab !== 'TODOS' && selectedTab !== 'OTRO' ? `en ${selectedTab}` : 'del carrito'}:
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Basado en {cartEstimation.pendingMatched} producto{cartEstimation.pendingMatched !== 1 ? 's' : ''} pendiente{cartEstimation.pendingMatched !== 1 ? 's' : ''} con precio registrado
                {cartEstimation.unmatchedPending > 0 ? ` (${cartEstimation.unmatchedPending} sin precio aún)` : ''}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
              ~{cartEstimation.pendingTotal.toFixed(2)} €
            </span>
            {cartEstimation.total !== cartEstimation.pendingTotal && (
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Total c/comprados: {cartEstimation.total.toFixed(2)} €
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulario para añadir compras */}
      <form onSubmit={handleAddItem} className="input-group" style={{ flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.2rem', opacity: 0.8 }}>Supermercado</label>
            <select
              value={itemSupermarket}
              onChange={(e) => setItemSupermarket(e.target.value)}
              className="custom-input"
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
            >
              <option value="">-- Sin especificar --</option>
              {supermarkets.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="OTRO">OTRO (Especificar...)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8 }}>Producto</label>
              {liveInputEstimate && (
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>
                  💡 ~{liveInputEstimate.totalPrice.toFixed(2)}€ ({liveInputEstimate.supermarket})
                </span>
              )}
            </div>
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Ej: Tomate, Leche, Huevos..."
              className="custom-input"
              style={{ width: '100%', padding: '0.6rem' }}
              maxLength={100}
              required
            />
          </div>
        </div>

        {/* Campo de súper custom si se selecciona OTRO */}
        {itemSupermarket === "OTRO" && (
          <div style={{ width: '100%' }}>
            <input
              type="text"
              value={customSupermarket}
              onChange={(e) => setCustomSupermarket(e.target.value)}
              placeholder="Escribe el nombre del supermercado custom..."
              className="custom-input"
              style={{ width: '100%', fontSize: '0.85rem' }}
              maxLength={30}
              required
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <input
            type="text"
            value={newItemNote}
            onChange={(e) => setNewItemNote(e.target.value)}
            placeholder="Nota opcional (ej: Mercadona, marca...)"
            className="custom-input"
            style={{ flex: 1, fontSize: '0.85rem' }}
            maxLength={100}
          />
          <button type="submit" className="btn-primary" aria-label="Añadir item de compra">
            <span>Añadir</span>
          </button>
        </div>
      </form>

      {/* Pestañas de Filtro de Supermercado (Debajo de Añadir Producto) */}
      <div className="supermarket-tabs-wrapper" style={{ marginBottom: '1.2rem', overflowX: 'auto', display: 'flex', gap: '0.4rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--glass-border)' }}>
        <button
          key="TODOS"
          onClick={() => { setSelectedTab("TODOS"); setItemSupermarket("LIDL"); setShowAddSupermarketForm(false); }}
          className={`tab-btn ${selectedTab === "TODOS" ? "active" : ""}`}
          style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: selectedTab === "TODOS" ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#ffffff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          🛒 TODOS
        </button>
        
        {supermarkets.map(superName => {
          const logoUrl = SUPERMARKET_LOGOS[superName];
          return (
            <button
              key={superName}
              onClick={() => { setSelectedTab(superName); setItemSupermarket(superName); setShowAddSupermarketForm(false); }}
              className={`tab-btn ${selectedTab === superName ? "active" : ""}`}
              style={{ 
                padding: logoUrl ? '0.2rem 0.6rem' : '0.4rem 0.8rem', 
                borderRadius: '20px', 
                border: '1px solid var(--glass-border)', 
                background: selectedTab === superName ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                color: '#ffffff', 
                cursor: 'pointer', 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                transition: 'all 0.2s', 
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '28px'
              }}
              title={`Ver compras de ${superName}`}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={superName}
                  style={{
                    height: '16px',
                    maxWidth: '65px',
                    objectFit: 'contain',
                    filter: selectedTab === superName ? 'brightness(1.1) contrast(1.1)' : 'opacity(0.85)',
                    borderRadius: '2px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
              ) : null}
              <span style={{ display: logoUrl ? 'none' : 'inline' }}>🏪 {superName}</span>
            </button>
          );
        })}

        <button
          key="OTRO"
          onClick={() => { setSelectedTab("OTRO"); setShowAddSupermarketForm(true); }}
          className={`tab-btn ${selectedTab === "OTRO" ? "active" : ""}`}
          style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', background: selectedTab === "OTRO" ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: '#ffffff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
          ➕ OTRO
        </button>
      </div>

      {/* Formulario flotante para Añadir Nuevo Supermercado */}
      {showAddSupermarketForm && (
        <form onSubmit={handleAddSupermarket} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <input
            type="text"
            value={newSupermarket}
            onChange={(e) => setNewSupermarket(e.target.value)}
            placeholder="Nombre del nuevo súper (ej: ALDI)..."
            className="custom-input"
            style={{ flex: 1, fontSize: '0.85rem' }}
            maxLength={20}
            required
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Añadir Súper
          </button>
        </form>
      )}

      {loading ? (
        <div className="empty-state">
          <span>Cargando lista...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <span>¡La lista está vacía!</span>
          <span className="card-subtitle">
            {selectedTab !== "TODOS" && selectedTab !== "OTRO" 
              ? `No hay compras pendientes para ${selectedTab}.` 
              : "Añade cosas que hagan falta en casa."}
          </span>
        </div>
      ) : (
        <div className="list-container">
          {filteredItems.map((item) => {
            const estimated = estimateItemPrice(item.text, item.supermarket);
            return (
              <div 
                key={item.id} 
                className={`list-item ${item.completed ? 'completed' : ''}`}
                style={{
                  background: item.supermarket ? getSupermarketBgColor(item.supermarket) : 'var(--glass-bg)',
                  borderLeft: item.supermarket ? `4px solid ${getSupermarketColor(item.supermarket)}` : '1px solid var(--glass-border)',
                  paddingLeft: item.supermarket ? '0.75rem' : '1rem',
                  paddingRight: item.supermarket ? '52px' : '1rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  className="list-item-content" 
                  onClick={() => handleItemClick(item)}
                  onMouseDown={() => handleStartPress(item)}
                  onMouseUp={handleCancelPress}
                  onMouseLeave={handleCancelPress}
                  onTouchStart={() => handleStartPress(item)}
                  onTouchEnd={handleCancelPress}
                  onTouchMove={handleCancelPress}
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  title="Mantén pulsado para editar"
                >
                  <div className="checkbox-custom" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="list-item-text" style={{ fontWeight: 500 }}>{item.text}</span>
                      {estimated && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.12rem 0.45rem',
                            borderRadius: '8px',
                            background: estimated.isExactSuper ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.15)',
                            color: estimated.isExactSuper ? '#34d399' : '#fbbf24',
                            border: estimated.isExactSuper ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                          }}
                          title={`Precio estimado según ${estimated.matchedName} en ${estimated.supermarket}`}
                        >
                          ~{estimated.totalPrice.toFixed(2)} €
                          {!estimated.isExactSuper ? ` (${estimated.supermarket})` : ''}
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <span 
                        className="list-item-note" 
                        style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          fontStyle: 'italic', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.2rem', 
                          marginTop: '0.15rem' 
                        }}
                      >
                        🏷️ {item.note}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="item-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <span className={`meta-user ${item.completed ? (item.completedBy?.toLowerCase() || 'sandra') : (item.addedBy?.toLowerCase() || 'ismael')}`}>
                    {item.completed 
                      ? `Hecho: ${item.completedBy}` 
                      : `Por: ${item.addedBy}`}
                  </span>
                  <span style={{ fontSize: '0.62rem', opacity: 0.6, marginTop: '2px' }}>
                    {item.completed 
                      ? new Date(item.completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) 
                      : new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                {/* Bandera con logo en la pestaña al final */}
                {item.supermarket && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '45px',
                    background: getSupermarketColor(item.supermarket),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 20% 100%, 0 50%)',
                    paddingLeft: '8px',
                    boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.15)'
                  }} title={`Supermercado: ${item.supermarket}`}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {SUPERMARKET_LOGOS[item.supermarket] ? (
                        <img 
                          src={SUPERMARKET_LOGOS[item.supermarket]} 
                          alt={item.supermarket} 
                          style={{ width: '15px', height: '15px', objectFit: 'contain' }} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                      ) : null}
                      <span style={{ 
                        display: SUPERMARKET_LOGOS[item.supermarket] ? 'none' : 'inline',
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        color: '#333333'
                      }}>
                        {item.supermarket.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Escáner de Tickets con IA */}
      {showScanModal && (
        <div className="modal-overlay" onClick={() => setShowScanModal(false)} style={{ zIndex: 120, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(8px)' }}>
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px', width: '94%', maxHeight: '88vh', overflowY: 'auto', padding: '1.3rem', background: '#111827', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="modal-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.15rem' }}>
                <span>📸</span> Escanear Ticket con IA
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--glass-border)',
                    color: geminiConfigured ? '#34d399' : '#fbbf24',
                    borderRadius: '8px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                  title="Configurar API Key de Gemini"
                >
                  🔑 {geminiConfigured ? 'IA Lista' : 'Configurar IA'}
                </button>
                <button className="modal-close" onClick={() => setShowScanModal(false)}>&times;</button>
              </div>
            </div>

            {(!geminiConfigured || showKeyConfig) && (
              <form onSubmit={handleSaveApiKey} style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', color: '#fcd34d', lineHeight: 1.4 }}>
                  <strong>Clave gratuita de Google Gemini IA:</strong> Para leer tickets necesitas una clave gratuita de Google AI Studio (<a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>consíguela aquí en 1 clic</a>). Se guardará en vuestra base de datos para siempre.
                </p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Pega tu API Key (AIzaSy...)"
                    className="custom-input"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
                    Guardar
                  </button>
                </div>
              </form>
            )}

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '1rem' }}>
              Haz una foto o sube un ticket de compra (Lidl, Mercadona, Ahorramas, etc.). La IA detectará el supermercado, limpiará los nombres de los productos y guardará sus precios para estimar tus próximos carritos.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelectReceiptImage}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
              <button
                type="button"
                disabled={scanLoading}
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)'
                }}
              >
                <span>📷</span> {scanLoading ? 'Analizando ticket con IA...' : 'Subir o Hacer Foto del Ticket'}
              </button>
            </div>

            {scanError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.7rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                marginBottom: '1rem'
              }}>
                ⚠️ {scanError}
              </div>
            )}

            {scannedItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>🏪 Súper detectado:</label>
                  <select
                    value={scannedSupermarket}
                    onChange={(e) => setScannedSupermarket(e.target.value)}
                    className="custom-input"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
                  >
                    {supermarkets.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="OTRO">OTRO...</option>
                  </select>
                  {scannedSupermarket === 'OTRO' && (
                    <input
                      type="text"
                      value={scannedCustomSupermarket}
                      onChange={(e) => setScannedCustomSupermarket(e.target.value)}
                      placeholder="Nombre del súper"
                      className="custom-input"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
                    />
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Revisa o retoca los nombres/precios detectados antes de guardarlos:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {scannedItems.map((it, idx) => (
                    <div
                      key={it.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '0.4rem 0.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        opacity: it.selected ? 1 : 0.45
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={it.selected}
                        onChange={(e) => {
                          const next = [...scannedItems];
                          next[idx].selected = e.target.checked;
                          setScannedItems(next);
                        }}
                      />
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) => {
                          const next = [...scannedItems];
                          next[idx].name = e.target.value;
                          setScannedItems(next);
                        }}
                        className="custom-input"
                        style={{ flex: 2, fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                        title={it.rawName ? `En el ticket: ${it.rawName}` : ''}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <input
                          type="number"
                          step="0.01"
                          value={it.price}
                          onChange={(e) => {
                            const next = [...scannedItems];
                            next[idx].price = e.target.value;
                            setScannedItems(next);
                          }}
                          className="custom-input"
                          style={{ width: '72px', fontSize: '0.78rem', padding: '0.35rem 0.4rem', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>€</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setScannedItems([])}
                    className="btn-secundario"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem' }}
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmScannedItems}
                    className="btn-primario"
                    style={{ flex: 2, padding: '0.6rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                  >
                    💾 Guardar {scannedItems.filter(i => i.selected).length} Precios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Catálogo de Precios Guardados */}
      {showCatalogModal && (
        <div className="modal-overlay" onClick={() => setShowCatalogModal(false)} style={{ zIndex: 120, background: 'rgba(5, 8, 20, 0.85)', backdropFilter: 'blur(8px)' }}>
          <div
            className="modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '620px', width: '95%', maxHeight: '88vh', overflowY: 'auto', padding: '1.3rem', background: '#111827', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="modal-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.15rem' }}>
                <span>🏷️</span> Catálogo de Precios por Supermercado
              </h2>
              <button className="modal-close" onClick={() => setShowCatalogModal(false)}>&times;</button>
            </div>

            {/* Añadir producto manualmente al catálogo */}
            <form onSubmit={handleAddManualCatalogPrice} style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '0.75rem',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                placeholder="Producto (ej: Tomate)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="custom-input"
                style={{ flex: 2, minWidth: '130px', fontSize: '0.78rem', padding: '0.45rem' }}
                required
              />
              <select
                value={newCatSuper}
                onChange={(e) => setNewCatSuper(e.target.value)}
                className="custom-input"
                style={{ flex: 1, minWidth: '105px', fontSize: '0.78rem', padding: '0.45rem' }}
              >
                {supermarkets.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Precio €"
                value={newCatPrice}
                onChange={(e) => setNewCatPrice(e.target.value)}
                className="custom-input"
                style={{ width: '85px', fontSize: '0.78rem', padding: '0.45rem' }}
                required
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem' }}
              >
                + Añadir
              </button>
            </form>

            {/* Buscador y filtro del catálogo */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <input
                type="text"
                placeholder="🔍 Buscar producto en el catálogo..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="custom-input"
                style={{ flex: 2, fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
              />
              <select
                value={catalogFilterSuper}
                onChange={(e) => setCatalogFilterSuper(e.target.value)}
                className="custom-input"
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem' }}
              >
                <option value="TODOS">Todos los súper</option>
                {supermarkets.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Lista de precios guardados */}
            {productPrices.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem 0.5rem' }}>
                <span>Aún no hay precios guardados. ¡Escanea un ticket o añade uno arriba!</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {productPrices
                  .filter(p => {
                    if (catalogFilterSuper !== 'TODOS' && p.supermarket !== catalogFilterSuper) return false;
                    if (catalogSearch.trim()) {
                      return p.name.toLowerCase().includes(catalogSearch.trim().toLowerCase());
                    }
                    return true;
                  })
                  .map(p => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '10px',
                        borderLeft: `3px solid ${getSupermarketColor(p.supermarket)}`,
                        borderTop: '1px solid var(--glass-border)',
                        borderRight: '1px solid var(--glass-border)',
                        borderBottom: '1px solid var(--glass-border)'
                      }}
                    >
                      {editingPriceId === p.id ? (
                        <div style={{ display: 'flex', gap: '0.4rem', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            value={editPriceName}
                            onChange={(e) => setEditPriceName(e.target.value)}
                            className="custom-input"
                            style={{ flex: 2, minWidth: '120px', fontSize: '0.78rem', padding: '0.3rem 0.5rem' }}
                          />
                          <select
                            value={editPriceSuper}
                            onChange={(e) => setEditPriceSuper(e.target.value)}
                            className="custom-input"
                            style={{ flex: 1, fontSize: '0.75rem', padding: '0.3rem' }}
                          >
                            {supermarkets.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            value={editPriceVal}
                            onChange={(e) => setEditPriceVal(e.target.value)}
                            className="custom-input"
                            style={{ width: '70px', fontSize: '0.78rem', padding: '0.3rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCatalogEdit(p.id)}
                            style={{ background: '#10b981', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.3rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPriceId(null)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.3rem 0.55rem', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#fff' }}>{p.name}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              🏪 {p.supermarket} {p.rawName && p.rawName !== p.name ? `• Ticket: "${p.rawName}"` : ''}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                              {Number(p.price).toFixed(2)} €
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPriceId(p.id);
                                setEditPriceName(p.name);
                                setEditPriceSuper(p.supermarket);
                                setEditPriceVal(p.price);
                              }}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem' }}
                              title="Editar producto o precio"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCatalogPrice(p.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.2rem' }}
                              title="Eliminar del catálogo"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de edición de artículo */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
            <div className="modal-header" style={{ marginBottom: '1.2rem' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem' }}>
                <span>✏️</span> Editar Artículo
              </h2>
              <button className="modal-close" onClick={() => setEditingItem(null)}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Producto</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  maxLength={100}
                  className="custom-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Supermercado</label>
                <select
                  value={editSupermarket}
                  onChange={(e) => setEditSupermarket(e.target.value)}
                  className="custom-input"
                  style={{ width: '100%' }}
                >
                  <option value="">-- Sin especificar --</option>
                  {supermarkets.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="OTRO">OTRO (Especificar...)</option>
                </select>
              </div>

              {editSupermarket === "OTRO" && (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Súper Custom</label>
                  <input
                    type="text"
                    value={editCustomSupermarket}
                    onChange={(e) => setEditCustomSupermarket(e.target.value)}
                    required
                    maxLength={30}
                    placeholder="Ej. CARREFOUR"
                    className="custom-input"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', opacity: 0.9 }}>Nota / Detalle</label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  maxLength={100}
                  placeholder="Sin notas"
                  className="custom-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-secundario"
                  style={{ flex: 1, padding: '0.6rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primario"
                  style={{ flex: 1, padding: '0.6rem' }}
                  disabled={!editTitle.trim()}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
