import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_VERCEL = !!process.env.VERCEL;
const SEED_DB_PATH = path.join(__dirname, 'db.json');
const DB_PATH = IS_VERCEL ? '/tmp/db.json' : SEED_DB_PATH;

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
  planning: defaultPlanning,
  birthdays: [],
  productPrices: [],
  gymWorkouts: [],
  gymBodyWeights: [],
  gymGoals: {
    Ismael: { targetDaysPerWeek: 3, targetWeightKg: null },
    Sandra: { targetDaysPerWeek: 3, targetWeightKg: null }
  },
  gymCustomRoutines: []
};

// Leer base de datos
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      if (IS_VERCEL && fs.existsSync(SEED_DB_PATH)) {
        fs.copyFileSync(SEED_DB_PATH, DB_PATH);
      } else {
        writeDB(defaultData);
        return defaultData;
      }
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
    if (!data.birthdays) {
      data.birthdays = [];
      changed = true;
    }
    if (!data.productPrices) {
      data.productPrices = [];
      changed = true;
    }
    if (!data.gymWorkouts) {
      data.gymWorkouts = [];
      changed = true;
    }
    if (!data.gymBodyWeights) {
      data.gymBodyWeights = [];
      changed = true;
    }
    if (!data.gymGoals) {
      data.gymGoals = {
        Ismael: { targetDaysPerWeek: 3, targetWeightKg: null },
        Sandra: { targetDaysPerWeek: 3, targetWeightKg: null }
      };
      changed = true;
    }
    if (!data.gymCustomRoutines) {
      data.gymCustomRoutines = [];
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

let pendingMongoPushPromise = null;

export async function flushPendingMongoWrites() {
  if (pendingMongoPushPromise) {
    try {
      await pendingMongoPushPromise;
    } catch (_) {}
    pendingMongoPushPromise = null;
  }
}

// Guardar base de datos de manera atómica
function writeDB(data) {
  try {
    const tempPath = DB_PATH + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);

    // Si hay variable de entorno, subir a MongoDB Atlas (y guardar la promesa para Serverless en Vercel)
    if (process.env.MONGODB_URI) {
      pendingMongoPushPromise = pushToMongoDB(data).catch(err => console.error('Error al sincronizar en segundo plano:', err));
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
  addWarranty: (name, purchaseDate, expirationDate, imagesBase64, addedBy) => {
    const data = readDB();
    if (!data.warranties) data.warranties = [];
    const newWarranty = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name,
      purchaseDate,
      expirationDate,
      imagesBase64: Array.isArray(imagesBase64) ? imagesBase64 : [],
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
      data.maintenanceBooks = {};
    }
    // Asegurar que existan todos los vehículos requeridos en la estructura
    let updated = false;
    const initialKawasaki = [
      {
        id: 1731860000000,
        date: new Date().toISOString().split('T')[0],
        km: 12000,
        type: "revision",
        description: "Compra del vehículo con 12.000 km. Incorporación de Kawasaki Ninja 650 a Casita.",
        imagesBase64: [],
        addedBy: "Ismael",
        createdAt: new Date().toISOString()
      }
    ];

    if (!data.maintenanceBooks["Kawasaki Ninja 650"] || data.maintenanceBooks["Kawasaki Ninja 650"].length === 0) {
      data.maintenanceBooks["Kawasaki Ninja 650"] = initialKawasaki;
      updated = true;
    }

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
  addMaintenanceEntry: (vehicleName, date, km, type, description, imagesBase64, addedBy) => {
    const data = readDB();
    if (!data.maintenanceBooks) data.maintenanceBooks = {};
    if (!data.maintenanceBooks[vehicleName]) {
      data.maintenanceBooks[vehicleName] = [];
    }
    const cleanKm = (km !== undefined && km !== null && km !== '') ? parseInt(km) : null;
    const newEntry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      date,
      km: cleanKm,
      type, // 'revision' | 'reparacion' | 'otro'
      description: description || '',
      imagesBase64: Array.isArray(imagesBase64) ? imagesBase64 : [],
      addedBy,
      createdAt: new Date().toISOString()
    };
    data.maintenanceBooks[vehicleName].push(newEntry);
    // Ordenar de más reciente a más antiguo por fecha y km
    data.maintenanceBooks[vehicleName].sort((a, b) => new Date(b.date) - new Date(a.date) || (b.km || 0) - (a.km || 0));
    writeDB(data);
    return newEntry;
  },
  deleteMaintenanceEntry: (vehicleName, entryId) => {
    const data = readDB();
    if (!data.maintenanceBooks || !data.maintenanceBooks[vehicleName]) return false;
    data.maintenanceBooks[vehicleName] = data.maintenanceBooks[vehicleName].filter(e => e.id !== entryId);
    writeDB(data);
    return true;
  },

  // --- CONFIGURACIÓN DE ALEXA ---
  getAlexaConfig: () => {
    const data = readDB();
    return data.alexaConfig || { skillId: null };
  },

  // --- MINIJUEGO MATRÍCULAS ---
  getPlates: () => {
    const data = readDB();
    if (!data.plates) {
      data.plates = [
        "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"
      ].map(num => ({
        id: num,
        plate: `${num}XXX`,
        completed: false,
        completedBy: null,
        completedAt: null
      }));
      writeDB(data);
    }
    return data.plates;
  },
  togglePlate: (id, completedBy) => {
    const data = readDB();
    if (!data.plates) return [];
    const plate = data.plates.find(p => p.id === id);
    if (plate) {
      plate.completed = !plate.completed;
      plate.completedBy = plate.completed ? completedBy : null;
      plate.completedAt = plate.completed ? new Date().toISOString() : null;
      writeDB(data);
    }
    return data.plates;
  },
  resetPlates: () => {
    const data = readDB();
    data.plates = [
      "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"
    ].map(num => ({
      id: num,
      plate: `${num}XXX`,
      completed: false,
      completedBy: null,
      completedAt: null
    }));
    writeDB(data);
    return data.plates;
  },

  // --- CONFIGURACIÓN DE OREO (ACTIVO/INACTIVO) ---
  getOreoActive: () => {
    const data = readDB();
    if (data.oreoActive === undefined) {
      return true;
    }
    return data.oreoActive;
  },
  setOreoActive: (active) => {
    const data = readDB();
    data.oreoActive = !!active;
    writeDB(data);
    return data.oreoActive;
  },

  // --- CUMPLEAÑOS ---
  getBirthdays: () => {
    const data = readDB();
    return data.birthdays || [];
  },
  addBirthday: (name, date, notes) => {
    const data = readDB();
    if (!data.birthdays) data.birthdays = [];
    const newBday = {
      id: Date.now().toString(),
      name,
      date, // YYYY-MM-DD
      notes: notes || ''
    };
    data.birthdays.push(newBday);
    writeDB(data);
    return data.birthdays;
  },
  deleteBirthday: (id) => {
    const data = readDB();
    if (!data.birthdays) return [];
    data.birthdays = data.birthdays.filter(b => b.id !== id);
    writeDB(data);
    return data.birthdays;
  },

  // --- CATÁLOGO DE PRECIOS E IA (GEMINI) ---
  getGeminiKey: () => {
    const data = readDB();
    return process.env.GEMINI_API_KEY || data.geminiApiKey || '';
  },
  setGeminiKey: (key) => {
    const data = readDB();
    data.geminiApiKey = key ? key.trim() : '';
    writeDB(data);
    return !!data.geminiApiKey;
  },
  getPrices: () => {
    const data = readDB();
    return data.productPrices || [];
  },
  savePricesBatch: (items, defaultSupermarket) => {
    const data = readDB();
    if (!data.productPrices) data.productPrices = [];
    if (!data.supermarkets) data.supermarkets = ["LIDL", "MERCADONA", "PRIMAPRIX", "AHORRAMAS"];

    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    items.forEach(item => {
      if (!item.name || item.price === undefined || item.price === null) return;
      const numPrice = parseFloat(String(item.price).replace(',', '.'));
      if (isNaN(numPrice) || numPrice <= 0) return;

      const superm = (item.supermarket || defaultSupermarket || 'GENERAL').trim().toUpperCase();
      if (superm && superm !== 'GENERAL' && !data.supermarkets.includes(superm)) {
        data.supermarkets.push(superm);
      }

      const normName = normalize(item.name);
      const existing = data.productPrices.find(
        p => normalize(p.name) === normName && (p.supermarket || 'GENERAL').toUpperCase() === superm
      );

      if (existing) {
        existing.name = item.name.trim();
        existing.price = Number(numPrice.toFixed(2));
        if (item.rawName) existing.rawName = item.rawName;
        existing.updatedAt = new Date().toISOString();
      } else {
        data.productPrices.push({
          id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
          name: item.name.trim(),
          rawName: item.rawName || item.name.trim(),
          supermarket: superm,
          price: Number(numPrice.toFixed(2)),
          updatedAt: new Date().toISOString()
        });
      }
    });

    // Ordenar alfabéticamente por nombre de producto
    data.productPrices.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    writeDB(data);
    return data.productPrices;
  },
  updatePriceItem: (id, name, supermarket, price) => {
    const data = readDB();
    if (!data.productPrices) return [];
    const item = data.productPrices.find(p => p.id === id);
    if (item) {
      if (name !== undefined && name.trim()) item.name = name.trim();
      if (supermarket !== undefined) {
        const superm = supermarket.trim().toUpperCase() || 'GENERAL';
        item.supermarket = superm;
        if (superm !== 'GENERAL' && data.supermarkets && !data.supermarkets.includes(superm)) {
          data.supermarkets.push(superm);
        }
      }
      if (price !== undefined) {
        const numPrice = parseFloat(String(price).replace(',', '.'));
        if (!isNaN(numPrice) && numPrice >= 0) {
          item.price = Number(numPrice.toFixed(2));
        }
      }
      item.updatedAt = new Date().toISOString();
      data.productPrices.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      writeDB(data);
    }
    return data.productPrices;
  },
  deletePriceItem: (id) => {
    const data = readDB();
    if (!data.productPrices) return [];
    data.productPrices = data.productPrices.filter(p => p.id !== id);
    writeDB(data);
    return data.productPrices;
  },

  // --- GIMNASIO MARBELLA & PERSONAL TRAINER ---
  getGymData: () => {
    const data = readDB();
    const defaultIsmael = {
      goalType: 'brazos_abs_grasa',
      goalLabel: '🔥💪🍫 Perder Grasa + Brazos y Tableta de Chocolate',
      customFocus: 'Perder peso, muscular brazos (bíceps/tríceps/hombros) y marcar tableta de abdominales con entreno duro',
      level: 'Duro / Progresivo',
      targetDaysPerWeek: 4,
      targetWeightKg: null
    };
    const defaultSandra = {
      goalType: 'tonificar',
      goalLabel: '⚡ Tonificar y Ponerse en Forma',
      customFocus: '',
      level: 'Adaptación / Progresivo',
      targetDaysPerWeek: 3,
      targetWeightKg: null
    };
    if (!data.gymWorkouts) data.gymWorkouts = [];

    // Helper para obtener fecha real en zona horaria de Madrid (YYYY-MM-DD)
    const getMadridDateStr = (daysOffset = 0) => {
      const d = new Date(Date.now() + daysOffset * 86400000);
      try {
        return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
      } catch (_) {
        return d.toISOString().split('T')[0];
      }
    };

    // Limpiar semillas antiguas con fecha futura 2026-11-* y aplicar fechas reales dinámicas
    if (!data.gymSeededDynamicV2) {
      const realToday = getMadridDateStr(0);
      const realYesterday = getMadridDateStr(-1);

      // Quitar las semillas que tenían 2026-11-15 / 2026-11-16 fijo
      data.gymWorkouts = data.gymWorkouts.filter(
        w => !(w.id && String(w.id).startsWith('seed-') && String(w.date).startsWith('2026-11-'))
      );

      const hasGymRecent = data.gymWorkouts.some(
        w => w.user === 'Ismael' && w.type !== 'home' && (w.date === realYesterday || w.date === realToday)
      );
      if (!hasGymRecent) {
        data.gymWorkouts.push({
          id: 'seed-gym-ismael-' + realYesterday,
          user: 'Ismael',
          type: 'gym',
          routineId: 'dia-1',
          date: realYesterday,
          routineName: '🔥💪 Día 1: Pecho, Espalda, Bombeo de Brazos + Tableta + Cardio',
          category: 'Gimnasio Marbella',
          durationMin: 55,
          caloriesBurned: 367,
          totalVolumeKg: 4860,
          feeling: '💪 Muy bien',
          notes: 'Sesión completada en Gimnasio Marbella + Cardio 20:43 (3.28 Km · 115.2 kcal · Nivel 6)',
          exercises: [
            { name: 'Press de Pecho Sentado', machine: 'Máquina de Pecho', sets: 4, reps: '12', weightKg: 30, isCardio: false, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Jalón al Pecho en Polea Alta', machine: 'Polea Alta (Espalda en V)', sets: 4, reps: '12', weightKg: 35, isCardio: false, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Curl de Bíceps en Polea Baja o Mancuernas', machine: 'Polea Baja / Mancuernas', sets: 4, reps: '12', weightKg: 12, isCardio: false, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Extensión de Tríceps con Cuerda en Polea', machine: 'Estación de Poleas', sets: 4, reps: '12', weightKg: 17.5, isCardio: false, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Crunch Abdominal con Peso en Polea / Máquina', machine: 'Polea Alta / Máquina Abs', sets: 4, reps: '15', weightKg: 25, isCardio: false, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Plancha Abdominal Dura (Core de Acero)', machine: 'Zona Colchonetas', sets: 3, reps: '45 seg', weightKg: 0, isCardio: true, nextAction: 'mejorar', completed: true, setDetails: [] },
            { name: 'Cardio Quema-Grasa (Elíptica / Cinta / Bici)', machine: 'Zona Cardio (Pantalla)', sets: 1, reps: '20:43', weightKg: 0, isCardio: true, distanceKm: 3.28, caloriesKcal: 115.2, levelMax: 6, avgPulse: 107, avgRpm: 40, nextAction: 'mejorar', completed: true, setDetails: [] }
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString()
        });
      }

      const hasHomeMorning = data.gymWorkouts.some(
        w => w.user === 'Ismael' && w.type === 'home' && w.routineId === 'casa-manana'
      );
      if (!hasHomeMorning) {
        data.gymWorkouts.push({
          id: 'seed-home-manana-ismael-' + realToday,
          user: 'Ismael',
          type: 'home',
          routineId: 'casa-manana',
          date: realToday,
          routineName: '☀️ Antes del Curro: Despertar, Activar y Quemar (5 min)',
          category: 'En Casa',
          durationMin: 6,
          caloriesBurned: 55,
          totalVolumeKg: 0,
          feeling: '🔥 A tope',
          notes: 'Validado antes de ir al curro',
          exercises: [
            { name: 'Sentadillas al aire (a ritmo fluido)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '15 reps', weightKg: 0, completed: true },
            { name: 'Flexiones de brazos', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '12 reps', weightKg: 0, completed: true },
            { name: 'Plancha Abdominal en alfombra/suelo', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '35 seg', weightKg: 0, completed: true },
            { name: 'Abdominales Crunch + Puente lumbar', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '15 reps', weightKg: 0, completed: true }
          ],
          createdAt: new Date().toISOString()
        });
      }

      const hasHome8Min = data.gymWorkouts.some(
        w => w.user === 'Ismael' && w.type === 'home' && w.routineId === 'casa-brazos-tableta'
      );
      if (!hasHome8Min) {
        data.gymWorkouts.push({
          id: 'seed-home-8min-ismael-' + realToday,
          user: 'Ismael',
          type: 'home',
          routineId: 'casa-brazos-tableta',
          date: realToday,
          routineName: '🍫💪 Especial Duro Ismael: Brazos + Tableta de Chocolate (8 min)',
          category: 'En Casa',
          durationMin: 8,
          caloriesBurned: 90,
          totalVolumeKg: 0,
          feeling: '🔥 A tope',
          notes: 'Validado en casa (8 min brazos + tableta)',
          exercises: [
            { name: 'Flexiones cerradas (Foco Tríceps y Pecho)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '12 reps', weightKg: 0, completed: true },
            { name: 'Crunch Abdominal Superior (Apretando 1s arriba)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '20 reps', weightKg: 0, completed: true },
            { name: 'Elevación de Piernas tumbado (Abdomen Inferior)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '15 reps', weightKg: 0, completed: true },
            { name: 'Bicicleta Abdominal (Oblicuos y Cintura)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '24 toques alternos', weightKg: 0, completed: true },
            { name: 'Plancha Abdominal RKC (Máxima Tensión)', machine: 'En Casa (Salón / Despacho)', sets: 1, reps: '45 seg', weightKg: 0, completed: true }
          ],
          createdAt: new Date().toISOString()
        });
      }

      data.gymSeededDynamicV2 = true;
      data.gymWorkouts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
      writeDB(data);
    }

    const goals = data.gymGoals || {};
    return {
      workouts: data.gymWorkouts || [],
      bodyWeights: data.gymBodyWeights || [],
      meals: data.gymMeals || [],
      waterLogs: data.gymWaterLogs || {},
      inProgress: data.gymInProgress || {},
      goals: {
        Ismael: { ...defaultIsmael, ...(goals.Ismael || {}), goalType: (goals.Ismael && goals.Ismael.goalType) || 'brazos_abs_grasa', goalLabel: (goals.Ismael && goals.Ismael.goalLabel) || defaultIsmael.goalLabel },
        Sandra: { ...defaultSandra, ...(goals.Sandra || {}) }
      },
      customRoutines: data.gymCustomRoutines || []
    };
  },
  saveGymInProgress: (user, date, stateObj) => {
    const data = readDB();
    if (!data.gymInProgress) data.gymInProgress = {};
    const key = `${user}_${date}`;
    const prev = data.gymInProgress[key] || {};
    data.gymInProgress[key] = {
      ...prev,
      ...(stateObj || {}),
      byRoutine: {
        ...(prev.byRoutine || {}),
        ...((stateObj && stateObj.byRoutine) || {})
      },
      homeCheckedByRoutine: {
        ...(prev.homeCheckedByRoutine || {}),
        ...((stateObj && stateObj.homeCheckedByRoutine) || {})
      },
      updatedAt: new Date().toISOString()
    };
    writeDB(data);
    return data.gymInProgress;
  },
  clearGymInProgress: (user, date) => {
    const data = readDB();
    if (!data.gymInProgress) data.gymInProgress = {};
    const key = `${user}_${date}`;
    delete data.gymInProgress[key];
    writeDB(data);
    return data.gymInProgress;
  },
  addGymWorkout: (workout) => {
    const data = readDB();
    if (!data.gymWorkouts) data.gymWorkouts = [];
    const exercises = Array.isArray(workout.exercises) ? workout.exercises.map(ex => {
      const setDetails = Array.isArray(ex.setDetails) ? ex.setDetails.map(s => ({
        reps: String(s.reps ?? ex.reps ?? '12'),
        weightKg: s.weightKg !== undefined && s.weightKg !== '' ? Number(s.weightKg) : 0,
        done: s.done !== false
      })) : [];
      return {
        name: (ex.name || '').trim(),
        machine: (ex.machine || '').trim(),
        sets: setDetails.length > 0 ? setDetails.length : (Number(ex.sets) || 3),
        reps: String(ex.reps || '12'),
        weightKg: ex.weightKg !== undefined && ex.weightKg !== '' ? Number(ex.weightKg) : 0,
        durationMin: ex.durationMin !== undefined && ex.durationMin !== '' ? Number(ex.durationMin) : 0,
        isCardio: !!ex.isCardio,
        nextAction: ex.nextAction || 'mantener',
        distanceKm: ex.distanceKm !== undefined && ex.distanceKm !== '' && ex.distanceKm !== null ? Number(ex.distanceKm) : null,
        caloriesKcal: ex.caloriesKcal !== undefined && ex.caloriesKcal !== '' && ex.caloriesKcal !== null ? Number(ex.caloriesKcal) : null,
        levelMax: ex.levelMax !== undefined && ex.levelMax !== '' && ex.levelMax !== null ? Number(ex.levelMax) : null,
        avgPulse: ex.avgPulse !== undefined && ex.avgPulse !== '' && ex.avgPulse !== null ? Number(ex.avgPulse) : null,
        avgRpm: ex.avgRpm !== undefined && ex.avgRpm !== '' && ex.avgRpm !== null ? Number(ex.avgRpm) : null,
        completed: ex.completed !== false,
        setDetails
      };
    }) : [];

    const totalVolumeKg = exercises.reduce((sum, ex) => {
      if (ex.completed === false) return sum;
      if (Array.isArray(ex.setDetails) && ex.setDetails.length > 0) {
        return sum + ex.setDetails.reduce((sSum, s) => {
          if (!s.done) return sSum;
          const r = parseInt(String(s.reps), 10) || 0;
          const w = Number(s.weightKg) || 0;
          return sSum + (r * w);
        }, 0);
      }
      const setsNum = Number(ex.sets) || 0;
      const repsNum = parseInt(String(ex.reps), 10) || 0;
      const weightNum = Number(ex.weightKg) || 0;
      return sum + (setsNum * repsNum * weightNum);
    }, 0);

    const workoutDate = workout.date || new Date().toISOString().split('T')[0];
    const workoutUser = workout.user || 'Ismael';
    const workoutType = workout.type || 'gym';

    // Si ya había un entrenamiento de gimnasio hoy para este usuario y se vuelve a guardar/actualizar, reemplazarlo para no duplicar el día
    if (workoutType === 'gym') {
      data.gymWorkouts = data.gymWorkouts.filter(w => !(w.user === workoutUser && w.type !== 'home' && w.date === workoutDate));
    } else if (workoutType === 'home' && workout.routineId) {
      data.gymWorkouts = data.gymWorkouts.filter(w => !(w.user === workoutUser && w.type === 'home' && w.date === workoutDate && w.routineId === workout.routineId));
    }

    const newWorkout = {
      id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
      user: workoutUser,
      type: workoutType, // 'gym' | 'home'
      routineId: workout.routineId || null,
      date: workoutDate,
      routineName: (workout.routineName || 'Entrenamiento en Gimnasio Marbella').trim(),
      category: workout.category || 'General',
      durationMin: Number(workout.durationMin) || 45,
      caloriesBurned: Number(workout.caloriesBurned) || 300,
      totalVolumeKg: Math.round(totalVolumeKg),
      feeling: workout.feeling || '💪 Muy bien',
      notes: (workout.notes || '').trim(),
      exercises,
      createdAt: new Date().toISOString()
    };
    data.gymWorkouts.unshift(newWorkout);
    data.gymWorkouts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));

    // Limpiar el borrador en curso de hoy si es de gimnasio
    if (workoutType === 'gym' && data.gymInProgress) {
      delete data.gymInProgress[`${workoutUser}_${workoutDate}`];
    }

    writeDB(data);
    return data.gymWorkouts;
  },
  deleteGymWorkout: (id) => {
    const data = readDB();
    if (!data.gymWorkouts) return [];
    data.gymWorkouts = data.gymWorkouts.filter(w => w.id !== id);
    writeDB(data);
    return data.gymWorkouts;
  },
  addGymBodyWeight: (entry) => {
    const data = readDB();
    if (!data.gymBodyWeights) data.gymBodyWeights = [];
    const weightNum = parseFloat(String(entry.weightKg).replace(',', '.'));
    if (isNaN(weightNum) || weightNum <= 0) return data.gymBodyWeights;

    const newEntry = {
      id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
      user: entry.user || 'Ismael',
      date: entry.date || new Date().toISOString().split('T')[0],
      weightKg: Number(weightNum.toFixed(1)),
      note: (entry.note || '').trim(),
      createdAt: new Date().toISOString()
    };
    data.gymBodyWeights.unshift(newEntry);
    data.gymBodyWeights.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
    writeDB(data);
    return data.gymBodyWeights;
  },
  deleteGymBodyWeight: (id) => {
    const data = readDB();
    if (!data.gymBodyWeights) return [];
    data.gymBodyWeights = data.gymBodyWeights.filter(w => w.id !== id);
    writeDB(data);
    return data.gymBodyWeights;
  },
  updateGymGoal: (user, goalData) => {
    const data = readDB();
    if (!data.gymGoals) {
      data.gymGoals = {
        Ismael: { targetDaysPerWeek: 3, targetWeightKg: null, goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo' },
        Sandra: { targetDaysPerWeek: 3, targetWeightKg: null, goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo' }
      };
    }
    if (!data.gymGoals[user]) {
      data.gymGoals[user] = { targetDaysPerWeek: 3, targetWeightKg: null, goalType: 'tonificar', goalLabel: '⚡ Tonificar y Ponerse en Forma', customFocus: '', level: 'Adaptación / Progresivo' };
    }
    if (goalData.targetDaysPerWeek !== undefined) {
      data.gymGoals[user].targetDaysPerWeek = Number(goalData.targetDaysPerWeek) || 3;
    }
    if (goalData.targetWeightKg !== undefined) {
      const w = parseFloat(String(goalData.targetWeightKg).replace(',', '.'));
      data.gymGoals[user].targetWeightKg = (!isNaN(w) && w > 0) ? Number(w.toFixed(1)) : null;
    }
    if (goalData.goalType !== undefined) {
      data.gymGoals[user].goalType = goalData.goalType;
    }
    if (goalData.goalLabel !== undefined) {
      data.gymGoals[user].goalLabel = goalData.goalLabel;
    }
    if (goalData.customFocus !== undefined) {
      data.gymGoals[user].customFocus = String(goalData.customFocus).trim();
    }
    if (goalData.level !== undefined) {
      data.gymGoals[user].level = goalData.level;
    }
    writeDB(data);
    return db.getGymData().goals;
  },
  saveCustomGymRoutine: (routine) => {
    const data = readDB();
    if (!data.gymCustomRoutines) data.gymCustomRoutines = [];
    const newRoutine = {
      id: 'custom-' + Date.now().toString(),
      title: (routine.title || 'Rutina Personalizada').trim(),
      subtitle: (routine.subtitle || 'Creada por tu Personal Trainer').trim(),
      duration: routine.duration || '45-55 min',
      calories: routine.calories || '~350-450 kcal',
      goal: routine.goal || 'Quema de grasa y tonificación',
      coachTip: routine.coachTip || 'Mantén descansos de 60-75 segundos entre series para mantener las pulsaciones activas.',
      exercises: Array.isArray(routine.exercises) ? routine.exercises : [],
      createdBy: routine.createdBy || 'Entrenador IA',
      createdAt: new Date().toISOString()
    };
    data.gymCustomRoutines.unshift(newRoutine);
    writeDB(data);
    return data.gymCustomRoutines;
  },
  deleteCustomGymRoutine: (id) => {
    const data = readDB();
    if (!data.gymCustomRoutines) return [];
    data.gymCustomRoutines = data.gymCustomRoutines.filter(r => r.id !== id);
    writeDB(data);
    return data.gymCustomRoutines;
  },
  addGymMeal: (meal) => {
    const data = readDB();
    if (!data.gymMeals) data.gymMeals = [];
    const newMeal = {
      id: Date.now().toString() + '-' + Math.floor(Math.random() * 10000),
      user: meal.user || 'Ismael',
      date: meal.date || new Date().toISOString().split('T')[0],
      mealType: meal.mealType || 'Comida del día',
      text: (meal.text || '').trim(),
      calories: Number(meal.calories) || 0,
      proteinG: Number(meal.proteinG) || 0,
      score: meal.score || '🟢 Equilibrado',
      coachFeedback: (meal.coachFeedback || '').trim(),
      createdAt: new Date().toISOString()
    };
    data.gymMeals.unshift(newMeal);
    writeDB(data);
    return data.gymMeals;
  },
  deleteGymMeal: (id) => {
    const data = readDB();
    if (!data.gymMeals) return [];
    data.gymMeals = data.gymMeals.filter(m => m.id !== id);
    writeDB(data);
    return data.gymMeals;
  },
  updateGymWater: (user, date, glasses) => {
    const data = readDB();
    if (!data.gymWaterLogs) data.gymWaterLogs = {};
    const key = `${user}_${date}`;
    data.gymWaterLogs[key] = Math.max(0, Number(glasses) || 0);
    writeDB(data);
    return data.gymWaterLogs;
  },

  // --- ORGANIZADOR DE VIDA Y PROYECTOS DE ISMAEL (06:00 a 22:30) ---
  getLifeOrganizer: () => {
    const data = readDB();
    const defaultProjects = {
      cv_curro: [
        { id: 'cv-1', text: 'Actualizar CV en formato Papel (limpio, directo, listo para imprimir)', done: false },
        { id: 'cv-2', text: 'Actualizar CV Digital (PDF moderno + perfil de LinkedIn / InfoJobs)', done: false },
        { id: 'cv-3', text: 'Buscar ofertas nuevas y enviar al menos 2-3 candidaturas', done: false }
      ],
      somosgamberros: [
        { id: 'sg-1', text: 'Repaso diario general de SomosGamberros (revisar estado y pendientes)', done: false },
        { id: 'sg-2', text: 'Meter 1 mejora o corrección diaria en SomosGamberros', done: false }
      ],
      soundpulse: [
        { id: 'sp-1', text: 'Revisar interfaz y generación de audio en SoundPulse (Local AI Music)', done: false },
        { id: 'sp-2', text: 'Mejorar flujo/modelo local o añadir nueva función a SoundPulse', done: false }
      ],
      casa_comidas: [
        { id: 'cc-1', text: 'Revisar comida/cena del día y dejar adelantada la cena antes de las 18:30', done: false },
        { id: 'cc-2', text: 'Hacer 1 arreglo o tarea pendiente de casa (20-25 min)', done: false }
      ]
    };

    if (!data.ismaelOrganizer) {
      data.ismaelOrganizer = {
        dailyBlocks: {}, // { 'YYYY-MM-DD': { 'bloque-0600': true, ... } }
        projects: defaultProjects,
        dailyNotes: {}, // { 'YYYY-MM-DD': '...' }
        jobApplicationsCount: 0
      };
      writeDB(data);
    } else if (!data.ismaelOrganizer.projects) {
      data.ismaelOrganizer.projects = defaultProjects;
      writeDB(data);
    }
    return data.ismaelOrganizer;
  },

  toggleLifeBlock: (date, blockId, done) => {
    db.getLifeOrganizer();
    const fresh = readDB();
    const targetDate = date || (new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()));
    if (!fresh.ismaelOrganizer.dailyBlocks) fresh.ismaelOrganizer.dailyBlocks = {};
    if (!fresh.ismaelOrganizer.dailyBlocks[targetDate]) fresh.ismaelOrganizer.dailyBlocks[targetDate] = {};
    if (done === undefined) {
      fresh.ismaelOrganizer.dailyBlocks[targetDate][blockId] = !fresh.ismaelOrganizer.dailyBlocks[targetDate][blockId];
    } else {
      fresh.ismaelOrganizer.dailyBlocks[targetDate][blockId] = !!done;
    }
    writeDB(fresh);
    return fresh.ismaelOrganizer;
  },

  addLifeProjectItem: (projectKey, text) => {
    db.getLifeOrganizer();
    const data = readDB();
    if (!data.ismaelOrganizer.projects[projectKey]) {
      data.ismaelOrganizer.projects[projectKey] = [];
    }
    data.ismaelOrganizer.projects[projectKey].push({
      id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      text: String(text || '').trim(),
      done: false,
      createdAt: new Date().toISOString()
    });
    writeDB(data);
    return data.ismaelOrganizer;
  },

  toggleLifeProjectItem: (projectKey, itemId) => {
    db.getLifeOrganizer();
    const data = readDB();
    const list = data.ismaelOrganizer.projects[projectKey] || [];
    const item = list.find(i => i.id === itemId);
    if (item) {
      item.done = !item.done;
      writeDB(data);
    }
    return data.ismaelOrganizer;
  },

  deleteLifeProjectItem: (projectKey, itemId) => {
    db.getLifeOrganizer();
    const data = readDB();
    if (data.ismaelOrganizer.projects[projectKey]) {
      data.ismaelOrganizer.projects[projectKey] = data.ismaelOrganizer.projects[projectKey].filter(i => i.id !== itemId);
      writeDB(data);
    }
    return data.ismaelOrganizer;
  },

  updateJobCounter: (delta) => {
    db.getLifeOrganizer();
    const data = readDB();
    data.ismaelOrganizer.jobApplicationsCount = Math.max(0, (Number(data.ismaelOrganizer.jobApplicationsCount) || 0) + Number(delta));
    writeDB(data);
    return data.ismaelOrganizer;
  },

  updateLifeDailyNote: (date, note) => {
    db.getLifeOrganizer();
    const data = readDB();
    const targetDate = date || (new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()));
    if (!data.ismaelOrganizer.dailyNotes) data.ismaelOrganizer.dailyNotes = {};
    data.ismaelOrganizer.dailyNotes[targetDate] = String(note || '');
    writeDB(data);
    return data.ismaelOrganizer;
  }
};

