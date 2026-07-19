import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const defaultPlanning = [
  { dayId: 1, dayName: 'Lunes', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 2, dayName: 'Martes', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 3, dayName: 'Miércoles', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 4, dayName: 'Jueves', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 5, dayName: 'Viernes', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 6, dayName: 'Sábado', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null },
  { dayId: 7, dayName: 'Domingo', comida: '', cena: '', actividad: '', actividadCompleted: false, actividadCompletedBy: null, completedAt: null, updatedBy: null, updatedAt: null }
];

const defaultData = {
  shopping: [],
  tasks: [],
  taskHistory: [],
  careLogs: [],
  planning: defaultPlanning
};

// Leer base de datos
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(defaultData);
      return defaultData;
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(content);
    
    // Migración automática para bases de datos existentes sin planning
    let changed = false;
    if (!data.planning) {
      data.planning = defaultPlanning;
      changed = true;
    }
    if (!data.taskHistory) {
      data.taskHistory = [];
      changed = true;
    }
    if (!data.careLogs) {
      data.careLogs = [];
      changed = true;
    }
    if (changed) {
      writeDB(data);
    }
    
    return data;
  } catch (error) {
    console.error('Error leyendo la base de datos, usando datos por defecto:', error);
    return defaultData;
  }
}

let mongoClient = null;
let mongoDb = null;

// Inicializar conexión con MongoDB Atlas
async function initMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      mongoDb = mongoClient.db('casitahub');
      console.log('✅ Conectado a MongoDB Atlas para la base de datos de copia de seguridad');
    }
    return mongoDb;
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB Atlas:', err);
    return null;
  }
}

// Descargar el estado global desde MongoDB a db.json local al arrancar
export async function syncFromMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI no detectado en el entorno. Corriendo con db.json local.');
    return;
  }

  const dbInstance = await initMongo();
  if (!dbInstance) {
    console.error('⚠️ No se pudo conectar a MongoDB Atlas. Iniciando con copia local de db.json.');
    return;
  }

  try {
    const collection = dbInstance.collection('app_state');
    const doc = await collection.findOne({ key: 'global_state' });

    if (doc) {
      console.log('📥 Sincronizando datos desde MongoDB Atlas...');
      // Extraer datos de la app y desechar metadatos de MongoDB
      const { _id, key, ...appData } = doc;
      
      const tempPath = DB_PATH + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(appData, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_PATH);
      console.log('✅ Base de datos local db.json sincronizada de forma correcta');
    } else {
      console.log('🌱 MongoDB Atlas no tiene datos registrados. Subiendo datos iniciales...');
      const localData = readDB();
      await collection.updateOne(
        { key: 'global_state' },
        { $set: { ...localData } },
        { upsert: true }
      );
      console.log('✅ Datos iniciales subidos a MongoDB Atlas');
    }
  } catch (err) {
    console.error('❌ Error durante la sincronización inicial de MongoDB:', err);
  }
}

// Subir cambios locales a MongoDB Atlas en segundo plano
async function pushToMongoDB(data) {
  const dbInstance = await initMongo();
  if (!dbInstance) return;

  try {
    const collection = dbInstance.collection('app_state');
    await collection.updateOne(
      { key: 'global_state' },
      { $set: { ...data } },
      { upsert: true }
    );
    console.log('📤 Copia de seguridad sincronizada en MongoDB Atlas (en segundo plano)');
  } catch (err) {
    console.error('❌ Error al subir copia de seguridad a MongoDB Atlas:', err);
  }
}

// Guardar base de datos de manera atómica
function writeDB(data) {
  try {
    const tempPath = DB_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);

    // Si hay variable de entorno, subir en segundo plano
    if (process.env.MONGODB_URI) {
      pushToMongoDB(data).catch(err => console.error('Error al sincronizar en segundo plano:', err));
    }
  } catch (error) {
    console.error('Error escribiendo la base de datos:', error);
  }
}

export const db = {
  // --- LISTA DE COMPRAS ---
  getShopping: () => {
    return readDB().shopping;
  },

  addShopping: (text, note, supermarket, addedBy) => {
    const data = readDB();
    const newItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      note: note || '',
      supermarket: supermarket ? supermarket.trim().toUpperCase() : '',
      completed: false,
      addedBy,
      completedBy: null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    data.shopping.push(newItem);
    writeDB(data);
    return newItem;
  },

  toggleShopping: (id, completed, completedBy) => {
    const data = readDB();
    const item = data.shopping.find(i => i.id === id);
    if (item) {
      item.completed = completed;
      item.completedBy = completed ? completedBy : null;
      item.completedAt = completed ? new Date().toISOString() : null;
      writeDB(data);
    }
    return item;
  },
  updateShopping: (id, text, note, supermarket) => {
    const data = readDB();
    const item = data.shopping.find(i => i.id === id);
    if (item) {
      if (text !== undefined) item.text = text;
      if (note !== undefined) item.note = note;
      if (supermarket !== undefined) item.supermarket = supermarket.trim().toUpperCase();
      writeDB(data);
    }
    return item;
  },
  clearCompletedShopping: (supermarket) => {
    const data = readDB();
    const filterUpper = supermarket ? supermarket.trim().toUpperCase() : null;
    
    data.shopping = data.shopping.filter(i => {
      if (i.completed) {
        if (filterUpper && filterUpper !== 'TODOS') {
          return i.supermarket !== filterUpper;
        }
        return false;
      }
      return true;
    });
    writeDB(data);
    return data.shopping;
  },

  getSupermarkets: () => {
    const data = readDB();
    if (!data.supermarkets) {
      data.supermarkets = ["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"];
      writeDB(data);
    }
    return data.supermarkets;
  },
  addSupermarket: (name) => {
    const data = readDB();
    if (!data.supermarkets) {
      data.supermarkets = ["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"];
    }
    const formattedName = name.trim().toUpperCase();
    if (formattedName && !data.supermarkets.includes(formattedName)) {
      data.supermarkets.push(formattedName);
      writeDB(data);
    }
    return data.supermarkets;
  },

  // --- TAREAS Y REPARACIONES ---
  getTasks: () => {
    return readDB().tasks.filter(t => t.status === 'active');
  },

  addTask: (text, category, addedBy) => {
    const data = readDB();
    const newTask = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      category, // 'domestica' | 'reparacion' | 'otra'
      addedBy,
      status: 'active', // 'active' | 'archived'
      createdAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    writeDB(data);
    return newTask;
  },

  archiveTask: (id) => {
    const data = readDB();
    const task = data.tasks.find(t => t.id === id);
    if (task) {
      task.status = 'archived';
      writeDB(data);
    }
    return task;
  },

  // Completar tarea (registra en historial y opcionalmente archiva si es reparación)
  completeTask: (id, completedBy) => {
    const data = readDB();
    const task = data.tasks.find(t => t.id === id);
    if (!task) return null;

    const historyEntry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      taskId: task.id,
      taskText: task.text,
      category: task.category,
      completedBy,
      completedAt: new Date().toISOString()
    };

    data.taskHistory.push(historyEntry);

    // Si es una reparación, la archivamos automáticamente al completarse.
    if (task.category === 'reparacion') {
      task.status = 'archived';
    }

    writeDB(data);
    return { task, historyEntry };
  },

  getTaskHistory: (limit = 50) => {
    const history = readDB().taskHistory || [];
    return history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, limit);
  },

  // --- CUIDADO DE JERBOS Y PLANTAS ---
  getCareLogs: (limit = 50) => {
    const logs = readDB().careLogs || [];
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  },

  logCare: (target, action, performedBy) => {
    const data = readDB();
    const newLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      target, // 'Jerbos (Kalu & Lua)' | 'Plantas Terraza'
      action, // 'Agua' | 'Comida' | 'Riego'
      performedBy, // 'Ismael' | 'Sandra'
      timestamp: new Date().toISOString()
    };
    if (!data.careLogs) data.careLogs = [];
    data.careLogs.push(newLog);
    writeDB(data);
    return newLog;
  },

  // --- PLANIFICADOR SEMANAL (Calendario Dinámico de 7 días) ---
  getPlanning: () => {
    const data = readDB();
    if (!data.planning) data.planning = [];

    // Funciones auxiliares para fechas locales (Zona horaria de España/Local)
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDayName = (date) => {
      const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      return `${capitalizedWeekday} ${day}/${month}`;
    };

    const todayStr = getLocalDateString(new Date());

    // 1. Generar la lista de los próximos 7 días (incluyendo hoy)
    const rollingDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      rollingDays.push({
        id: getLocalDateString(d),
        name: formatDayName(d)
      });
    }

    // 2. Limpiar/Borrar días pasados (aquellos menores que hoy, o con formato anterior)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    data.planning = data.planning.filter(d => 
      typeof d.dayId === 'string' && 
      dateRegex.test(d.dayId) && 
      d.dayId >= todayStr
    );

    // 3. Asegurar que existan los 7 días actuales
    let dbUpdated = false;
    rollingDays.forEach(r => {
      const exists = data.planning.some(d => d.dayId === r.id);
      if (!exists) {
        data.planning.push({
          dayId: r.id,
          dayName: r.name,
          comida: '',
          cena: '',
          actividad: '',
          actividadCompleted: false,
          actividadCompletedBy: null,
          completedAt: null,
          updatedBy: null,
          updatedAt: null
        });
        dbUpdated = true;
      } else {
        // Actualizar el nombre del día por si acaso cambia el idioma/formato
        const item = data.planning.find(d => d.dayId === r.id);
        if (item && item.dayName !== r.name) {
          item.dayName = r.name;
          dbUpdated = true;
        }
      }
    });

    // 4. Ordenar cronológicamente
    data.planning.sort((a, b) => a.dayId.localeCompare(b.dayId));

    if (dbUpdated || data.planning.length !== readDB().planning.length) {
      writeDB(data);
    }

    return data.planning;
  },

  updatePlanningDay: (dayId, comida, cena, actividad, updatedBy) => {
    const data = readDB();
    const day = data.planning.find(d => String(d.dayId) === String(dayId));
    if (day) {
      // Si la actividad cambia, reseteamos su estado de completado
      if (actividad !== undefined && actividad !== day.actividad) {
        day.actividad = actividad;
        day.actividadCompleted = false;
        day.actividadCompletedBy = null;
        day.completedAt = null;
      }
      
      if (comida !== undefined) day.comida = comida;
      if (cena !== undefined) day.cena = cena;
      
      day.updatedBy = updatedBy;
      day.updatedAt = new Date().toISOString();
      
      writeDB(data);
    }
    return day;
  },

  togglePlanningActivity: (dayId, completed, completedBy) => {
    const data = readDB();
    const day = data.planning.find(d => String(d.dayId) === String(dayId));
    if (day) {
      day.actividadCompleted = completed;
      day.actividadCompletedBy = completed ? completedBy : null;
      day.completedAt = completed ? new Date().toISOString() : null;
      
      // También agregamos un registro al historial de tareas general para llevar el control
      if (completed && day.actividad) {
        const historyEntry = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          taskId: `plan-${dayId}`, // Usamos un prefijo de texto para evitar colisiones
          taskText: `[Plan Semanal - ${day.dayName}] ${day.actividad}`,
          category: 'plan_semanal',
          completedBy,
          completedAt: new Date().toISOString()
        };
        data.taskHistory.push(historyEntry);
      }
      
      writeDB(data);
    }
    return day;
  },

  // --- NOTIFICACIONES PUSH ---
  getSMTPConfig: () => {
    return readDB().smtp || null;
  },

  getVapidKeys: () => {
    return readDB().vapid || null;
  },

  saveVapidKeys: (keys) => {
    const data = readDB();
    data.vapid = keys;
    writeDB(data);
    return keys;
  },

  saveSubscription: (user, subscription) => {
    const data = readDB();
    if (!data.subscriptions) data.subscriptions = [];
    
    // Si ya existe este endpoint, actualizamos el usuario asociado
    const existingIndex = data.subscriptions.findIndex(s => s.subscription.endpoint === subscription.endpoint);
    if (existingIndex !== -1) {
      data.subscriptions[existingIndex].user = user;
      data.subscriptions[existingIndex].updatedAt = new Date().toISOString();
      writeDB(data);
    } else {
      data.subscriptions.push({
        user,
        subscription,
        createdAt: new Date().toISOString()
      });
      writeDB(data);
    }
    return subscription;
  },

  getSubscriptionsForUser: (user) => {
    const data = readDB();
    if (!data.subscriptions) return [];
    return data.subscriptions.filter(s => s.user === user);
  },

  removeSubscription: (endpoint) => {
    const data = readDB();
    if (!data.subscriptions) return;
    const initialLength = data.subscriptions.length;
    data.subscriptions = data.subscriptions.filter(s => s.subscription.endpoint !== endpoint);
    if (data.subscriptions.length !== initialLength) {
      writeDB(data);
    }
  },

  // --- GASTOS COMPARTIDOS ---
  getExpenses: () => {
    const data = readDB();
    if (!data.expenses) data.expenses = [];
    return data.expenses;
  },
  addExpense: (description, amount, paidBy, category) => {
    const data = readDB();
    if (!data.expenses) data.expenses = [];
    const newExpense = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      paidBy, // 'Ismael' | 'Sandra' | 'Conjunta'
      category, // 'ocio' | 'domestico' | 'compra'
      createdAt: new Date().toISOString()
    };
    data.expenses.push(newExpense);
    writeDB(data);
    return newExpense;
  },
  deleteExpense: (id) => {
    const data = readDB();
    if (!data.expenses) return false;
    const initialLength = data.expenses.length;
    data.expenses = data.expenses.filter(e => e.id !== id);
    if (data.expenses.length !== initialLength) {
      writeDB(data);
      return true;
    }
    return false;
  },
  clearExpenses: () => {
    const data = readDB();
    data.expenses = [];
    writeDB(data);
    return [];
  },

  // --- NEVERA VIRTUAL ---
  getFridgeNotes: () => {
    const data = readDB();
    if (!data.fridgeNotes) data.fridgeNotes = [];
    return data.fridgeNotes;
  },
  addFridgeNote: (text, color, addedBy) => {
    const data = readDB();
    if (!data.fridgeNotes) data.fridgeNotes = [];
    const newNote = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      color, // 'yellow' | 'green' | 'pink' | 'blue'
      addedBy,
      createdAt: new Date().toISOString()
    };
    data.fridgeNotes.push(newNote);
    writeDB(data);
    return newNote;
  },
  deleteFridgeNote: (id) => {
    const data = readDB();
    if (!data.fridgeNotes) return false;
    const initialLength = data.fridgeNotes.length;
    data.fridgeNotes = data.fridgeNotes.filter(n => n.id !== id);
    if (data.fridgeNotes.length !== initialLength) {
      writeDB(data);
      return true;
    }
    return false;
  },

  // --- RECETARIO ---
  getRecipes: () => {
    const data = readDB();
    if (!data.recipes) data.recipes = [];
    return data.recipes;
  },
  addRecipe: (name, ingredients, instructions, addedBy) => {
    const data = readDB();
    if (!data.recipes) data.recipes = [];
    const newRecipe = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name,
      ingredients, // Array of { name, supermarket, qty }
      instructions,
      addedBy
    };
    data.recipes.push(newRecipe);
    writeDB(data);
    return newRecipe;
  },

  // --- MASCOTAS ---
  getPetsData: () => {
    const data = readDB();
    // Forzar que solo existan Kalu, Lua y Oreo en la estructura de datos
    if (!data.pets || !data.pets["Kalu"] || !data.pets["Lua"] || !data.pets["Oreo"] || data.pets["Jade"] || data.pets["Lulu"]) {
      const oldOreo = data.pets && data.pets["Oreo"] ? data.pets["Oreo"] : { "birthday": "", "weightLog": [], "medicalLog": [] };
      const oldKalu = data.pets && data.pets["Kalu"] ? data.pets["Kalu"] : { "birthday": "", "weightLog": [], "medicalLog": [] };
      const oldLua = data.pets && data.pets["Lua"] ? data.pets["Lua"] : { "birthday": "", "weightLog": [], "medicalLog": [] };
      data.pets = {
        "Kalu": oldKalu,
        "Lua": oldLua,
        "Oreo": oldOreo
      };
      writeDB(data);
    }
    return data.pets;
  },
  addPetWeight: (petName, weight) => {
    const data = readDB();
    if (!data.pets) data.pets = {};
    if (!data.pets[petName]) {
      data.pets[petName] = { "birthday": "", "weightLog": [], "medicalLog": [] };
    }
    const newLog = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight)
    };
    data.pets[petName].weightLog.push(newLog);
    data.pets[petName].weightLog.sort((a,b) => new Date(b.date) - new Date(a.date));
    writeDB(data);
    return data.pets[petName];
  },
  addPetMedical: (petName, title, note) => {
    const data = readDB();
    if (!data.pets) data.pets = {};
    if (!data.pets[petName]) {
      data.pets[petName] = { "birthday": "", "weightLog": [], "medicalLog": [] };
    }
    const newLog = {
      date: new Date().toISOString().split('T')[0],
      title,
      note
    };
    data.pets[petName].medicalLog.push(newLog);
    data.pets[petName].medicalLog.sort((a,b) => new Date(b.date) - new Date(a.date));
    writeDB(data);
    return data.pets[petName];
  },

  // --- BITÁCORA ---
  getMaintenanceLogs: () => {
    const data = readDB();
    if (!data.maintenanceLogs) data.maintenanceLogs = [];
    return data.maintenanceLogs;
  },
  addMaintenanceLog: (title, description, addedBy) => {
    const data = readDB();
    if (!data.maintenanceLogs) data.maintenanceLogs = [];
    const newLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title,
      description,
      date: new Date().toISOString().split('T')[0],
      addedBy
    };
    data.maintenanceLogs.push(newLog);
    writeDB(data);
    return newLog;
  },

  addTicket: (type, title, description, reportedBy) => {
    const data = readDB();
    if (!data.tickets) data.tickets = [];
    const newTicket = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type, // 'bug' | 'feature'
      title,
      description: description || '',
      reportedBy,
      createdAt: new Date().toISOString()
    };
    data.tickets.push(newTicket);
    writeDB(data);
    return newTicket;
  },

  // --- GARANTÍAS ---
  getWarranties: () => {
    const data = readDB();
    if (!data.warranties) data.warranties = [];
    return data.warranties;
  },
  addWarranty: (name, purchaseDate, expirationDate, imageBase64, addedBy) => {
    const data = readDB();
    if (!data.warranties) data.warranties = [];
    const newWarranty = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name,
      purchaseDate,
      expirationDate,
      imageBase64: imageBase64 || null,
      addedBy,
      createdAt: new Date().toISOString()
    };
    data.warranties.push(newWarranty);
    writeDB(data);
    return newWarranty;
  },
  deleteWarranty: (id) => {
    const data = readDB();
    if (!data.warranties) data.warranties = [];
    data.warranties = data.warranties.filter(w => w.id !== id);
    writeDB(data);
    return true;
  },

  // --- LIBROS DE MANTENIMIENTO ---
  getMaintenanceBooks: () => {
    const data = readDB();
    if (!data.maintenanceBooks) {
      data.maintenanceBooks = {
        "Benelli BN 125": [],
        "Ford Focus": [],
        "Ford Fiesta": []
      };
      writeDB(data);
    }
    // Asegurar que existan todos los vehículos requeridos en la estructura
    let updated = false;
    ["Benelli BN 125", "Ford Focus", "Ford Fiesta"].forEach(v => {
      if (!data.maintenanceBooks[v]) {
        data.maintenanceBooks[v] = [];
        updated = true;
      }
    });
    if (updated) {
      writeDB(data);
    }
    return data.maintenanceBooks;
  },
  addMaintenanceEntry: (vehicleName, date, km, type, description, imageBase64, addedBy) => {
    const data = readDB();
    if (!data.maintenanceBooks) data.maintenanceBooks = {};
    if (!data.maintenanceBooks[vehicleName]) {
      data.maintenanceBooks[vehicleName] = [];
    }
    const newEntry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      date,
      km: parseInt(km) || 0,
      type, // 'revision' | 'reparacion' | 'otro'
      description: description || '',
      imageBase64: imageBase64 || null,
      addedBy,
      createdAt: new Date().toISOString()
    };
    data.maintenanceBooks[vehicleName].push(newEntry);
    // Ordenar de más reciente a más antiguo por fecha y km
    data.maintenanceBooks[vehicleName].sort((a, b) => new Date(b.date) - new Date(a.date) || b.km - a.km);
    writeDB(data);
    return newEntry;
  },
  deleteMaintenanceEntry: (vehicleName, entryId) => {
    const data = readDB();
    if (!data.maintenanceBooks || !data.maintenanceBooks[vehicleName]) return false;
    data.maintenanceBooks[vehicleName] = data.maintenanceBooks[vehicleName].filter(e => e.id !== entryId);
    writeDB(data);
    return true;
  }
};
