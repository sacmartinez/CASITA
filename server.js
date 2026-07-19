import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import webpush from 'web-push';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { db, syncFromMongoDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE NOTIFICACIONES PUSH ---
let vapidKeys = null; // Se inicializará dinámicamente en startServer() tras sincronizar la base de datos.

// Helper para obtener el nombre del otro usuario
const getOtherUser = (user) => user === 'Ismael' ? 'Sandra' : 'Ismael';

// Helper para enviar notificación push
async function sendPushNotification(targetUser, title, body, url) {
  const subscriptions = db.getSubscriptionsForUser(targetUser);
  const payload = JSON.stringify({ title, body, url });

  const promises = subscriptions.map(sub => {
    return webpush.sendNotification(sub.subscription, payload)
      .catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Eliminando suscripción inválida de ${targetUser}:`, sub.subscription.endpoint);
          db.removeSubscription(sub.subscription.endpoint);
        } else {
          console.error(`Error de red al enviar push a ${targetUser}:`, err.message);
        }
      });
  });

  await Promise.all(promises);
}

// Helper para enviar alerta por correo electrónico
async function sendEmailAlert(subject, text) {
  const smtpConfig = db.getSMTPConfig();
  if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
    console.log('[Email] Servidor SMTP no configurado en db.json. Saltando envío de correo.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    }
  });

  const mailOptions = {
    from: `"Casita Hub" <${smtpConfig.user}>`,
    to: 'i.martienztajuelo@gmail.com',
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('[Email] Correo enviado con éxito a i.martienztajuelo@gmail.com');
  } catch (error) {
    console.error('[Email] Error al enviar correo:', error.message);
  }
}

// --- ENDPOINTS DE LA API ---

// 1. LISTA DE COMPRAS
app.get('/api/shopping', (req, res) => {
  try {
    res.json(db.getShopping());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de compras' });
  }
});

app.post('/api/shopping', (req, res) => {
  try {
    const { text, note, supermarket, addedBy } = req.body;
    if (!text || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (text, addedBy)' });
    }
    const item = db.addShopping(text, note, supermarket, addedBy);
    
    // Trigger push notification to the other user
    const noteText = note ? ` (${note})` : '';
    sendPushNotification(
      getOtherUser(addedBy),
      '🛒 Lista de Compra',
      `${addedBy} ha solicitado comprar "${text}"${noteText}`
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir item de compra' });
  }
});

app.put('/api/shopping/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { completed, completedBy, text, note, supermarket, updatedBy } = req.body;
    
    let item;
    if (completed !== undefined) {
      item = db.toggleShopping(id, completed, completedBy);
      if (item && completed && completedBy) {
        // Trigger push notification to other user about shopping item completed
        await sendPushNotification(
          getOtherUser(completedBy),
          '🛒 Compra Realizada',
          `${completedBy} ha comprado: ${item.text}`
        );
      }
    } else {
      item = db.updateShopping(id, text, note, supermarket);
      if (item && updatedBy) {
        // Trigger push notification to other user about the edit
        await sendPushNotification(
          getOtherUser(updatedBy),
          '🛒 Compra Editada',
          `${updatedBy} ha modificado un artículo: ${text}${note ? ` (${note})` : ''}`
        );
      }
    }
    
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar item de compra' });
  }
});

app.delete('/api/shopping/completed', (req, res) => {
  try {
    const { supermarket } = req.query;
    const remaining = db.clearCompletedShopping(supermarket);
    res.json(remaining);
  } catch (error) {
    res.status(500).json({ error: 'Error al limpiar compras completadas' });
  }
});

// Endpoints de Supermercados
app.get('/api/supermarkets', (req, res) => {
  try {
    res.json(db.getSupermarkets());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener supermercados' });
  }
});

app.post('/api/supermarkets', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Falta el nombre del supermercado' });
    }
    const updatedList = db.addSupermarket(name);
    res.status(201).json(updatedList);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir supermercado' });
  }
});

// 2. TAREAS Y REPARACIONES
app.get('/api/tasks', (req, res) => {
  try {
    res.json(db.getTasks());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { text, category, addedBy } = req.body;
    if (!text || !category || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (text, category, addedBy)' });
    }
    const task = db.addTask(text, category, addedBy);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir tarea' });
  }
});

app.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { completedBy } = req.body;
    if (!completedBy) {
      return res.status(400).json({ error: 'Falta especificar quién completó la tarea' });
    }
    const result = db.completeTask(id, completedBy);
    if (!result) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Trigger push notification to the other user
    await sendPushNotification(
      getOtherUser(completedBy),
      '📋 Tarea Realizada',
      `${completedBy} ha completado: ${result.task.text}`
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al completar tarea' });
  }
});

app.post('/api/tasks/:id/archive', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = db.archiveTask(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al archivar tarea' });
  }
});

app.get('/api/tasks/history', (req, res) => {
  try {
    res.json(db.getTaskHistory());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial de tareas' });
  }
});

// 3. CUIDADO DE MASCOTAS Y PLANTAS
app.get('/api/care', (req, res) => {
  try {
    res.json(db.getCareLogs());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener logs de cuidado' });
  }
});

app.post('/api/care', (req, res) => {
  try {
    const { target, action, performedBy } = req.body;
    if (!target || !action || !performedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (target, action, performedBy)' });
    }
    const log = db.logCare(target, action, performedBy);

    // Trigger push notification to the other user
    sendPushNotification(
      getOtherUser(performedBy),
      '🐹 Registro de Cuidados',
      `${performedBy} ha registrado: ${action} para ${target}`
    );

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar log de cuidado' });
  }
});

// 4. PLANIFICADOR SEMANAL
app.get('/api/planning', (req, res) => {
  try {
    res.json(db.getPlanning());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el planificador semanal' });
  }
});

app.put('/api/planning/:dayId', (req, res) => {
  try {
    const dayId = req.params.dayId;
    const { comida, cena, actividad, updatedBy } = req.body;
    if (!updatedBy) {
      return res.status(400).json({ error: 'Falta especificar quién actualiza' });
    }
    const day = db.updatePlanningDay(dayId, comida, cena, actividad, updatedBy);
    if (!day) {
      return res.status(404).json({ error: 'Día no encontrado' });
    }
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la planificación' });
  }
});

app.put('/api/planning/:dayId/complete-activity', async (req, res) => {
  try {
    const dayId = req.params.dayId;
    const { completed, completedBy } = req.body;
    if (completed && !completedBy) {
      return res.status(400).json({ error: 'Falta especificar quién completa la actividad' });
    }
    const day = db.togglePlanningActivity(dayId, completed, completedBy);
    if (!day) {
      return res.status(404).json({ error: 'Día no encontrado' });
    }

    // Trigger push notification to the other user (only if marked completed)
    if (completed && day.actividad) {
      await sendPushNotification(
        getOtherUser(completedBy),
        '📅 Actividad del Plan Realizada',
        `${completedBy} completó la actividad: ${day.actividad} (${day.dayName})`
      );
    }

    res.json(day);
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar estado de la actividad' });
  }
});

// 5. SUSCRIPCIÓN DE NOTIFICACIONES PUSH
app.get('/api/push/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

app.post('/api/push/subscribe', (req, res) => {
  try {
    const { subscription, user } = req.body;
    if (!subscription || !user) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (subscription, user)' });
    }
    db.saveSubscription(user, subscription);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar suscripción push' });
  }
});

// --- CRON JOB: RECORDATORIO DE CUIDADOS DIARIOS (06:00 AM) ---
cron.schedule('0 6 * * *', async () => {
  console.log('[Cron] Ejecutando verificación diaria de cuidados a las 06:00...');
  
  try {
    const logs = db.getCareLogs() || [];
    const now = new Date();
    const limitMs = 48 * 60 * 60 * 1000; // 48 horas (2 días)

    const getLatestLog = (target, action) => {
      return logs.find(log => {
        if (target === 'Jerbos (Kalu & Lua)') {
          return (log.target === 'Jerbos (Kalu & Lua)' || log.target === 'Kalu' || log.target === 'Lua') && log.action === action;
        }
        return log.target === target && log.action === action;
      });
    };

    // 1. Verificar Agua de Jerbos
    const lastWater = getLatestLog('Jerbos (Kalu & Lua)', 'Agua');
    const elapsedWater = lastWater ? (now - new Date(lastWater.timestamp)) : limitMs + 1000;
    if (elapsedWater >= limitMs) {
      console.log('[Cron] Enviando recordatorio de agua de jerbos...');
      await sendPushNotification('Ismael', '⚠️ Kalu & Lua: Agua', 'Llevan más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
      await sendPushNotification('Sandra', '⚠️ Kalu & Lua: Agua', 'Llevan más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
    }

    // 2. Verificar Agua de Oreo (Vacacional)
    const lastOreoWater = getLatestLog('Jerbo (Oreo)', 'Agua');
    const elapsedOreoWater = lastOreoWater ? (now - new Date(lastOreoWater.timestamp)) : limitMs + 1000;
    if (elapsedOreoWater >= limitMs) {
      console.log('[Cron] Enviando recordatorio de agua de Oreo...');
      await sendPushNotification('Ismael', '⚠️ Oreo: Agua', 'Lleva más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
      await sendPushNotification('Sandra', '⚠️ Oreo: Agua', 'Lleva más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
    }

    // 3. Verificar Riego de Plantas
    const lastRiego = getLatestLog('Plantas Terraza', 'Riego');
    const elapsedRiego = lastRiego ? (now - new Date(lastRiego.timestamp)) : limitMs + 1000;
    if (elapsedRiego >= limitMs) {
      console.log('[Cron] Enviando recordatorio de riego de plantas...');
      await sendPushNotification('Ismael', '🌱 Terraza: Riego', 'Las plantas de la terraza llevan más de 2 días sin regar. ¡Recordad echarles agua! 💧');
      await sendPushNotification('Sandra', '🌱 Terraza: Riego', 'Las plantas de la terraza llevan más de 2 días sin regar. ¡Recordad echarles agua! 💧');
    }

  } catch (error) {
    console.error('[Cron] Error en la tarea de recordatorio de cuidados:', error);
  }
});

// Endpoint temporal para forzar y testear el cron desde la consola o REST API
app.post('/api/push/test-cron', async (req, res) => {
  console.log('[Test Cron] Forzando ejecución del recordatorio de cuidados...');
  try {
    const logs = db.getCareLogs() || [];
    const now = new Date();
    const limitMs = 48 * 60 * 60 * 1000; // Restaurar 48 horas (2 días)
    let alertsSent = [];

    const getLatestLog = (target, action) => {
      return logs.find(log => {
        if (target === 'Jerbos (Kalu & Lua)') {
          return (log.target === 'Jerbos (Kalu & Lua)' || log.target === 'Kalu' || log.target === 'Lua') && log.action === action;
        }
        return log.target === target && log.action === action;
      });
    };

    // 1. Verificar Agua de Jerbos
    const lastWater = getLatestLog('Jerbos (Kalu & Lua)', 'Agua');
    const elapsedWater = lastWater ? (now - new Date(lastWater.timestamp)) : limitMs + 1000;
    if (elapsedWater >= limitMs) {
      alertsSent.push('Agua Jerbos');
      await sendPushNotification('Ismael', '⚠️ Kalu & Lua: Agua (Test)', 'Llevan más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
      await sendPushNotification('Sandra', '⚠️ Kalu & Lua: Agua (Test)', 'Llevan más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
    }

    // 2. Verificar Agua de Oreo (Vacacional)
    const lastOreoWater = getLatestLog('Jerbo (Oreo)', 'Agua');
    const elapsedOreoWater = lastOreoWater ? (now - new Date(lastOreoWater.timestamp)) : limitMs + 1000;
    if (elapsedOreoWater >= limitMs) {
      alertsSent.push('Agua Oreo');
      await sendPushNotification('Ismael', '⚠️ Oreo: Agua (Test)', 'Lleva más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
      await sendPushNotification('Sandra', '⚠️ Oreo: Agua (Test)', 'Lleva más de 2 días sin cambio de agua. ¡Recordad ponérsela limpia! 💧');
    }

    // 3. Verificar Riego de Plantas
    const lastRiego = getLatestLog('Plantas Terraza', 'Riego');
    const elapsedRiego = lastRiego ? (now - new Date(lastRiego.timestamp)) : limitMs + 1000;
    if (elapsedRiego >= limitMs) {
      alertsSent.push('Riego Plantas');
      await sendPushNotification('Ismael', '🌱 Terraza: Riego (Test)', 'Las plantas de la terraza llevan más de 2 días sin regar. ¡Recordad echarles agua! 💧');
      await sendPushNotification('Sandra', '🌱 Terraza: Riego (Test)', 'Las plantas de la terraza llevan más de 2 días sin regar. ¡Recordad echarles agua! 💧');
    }

    res.json({
      success: true,
      alertsSent,
      message: alertsSent.length > 0 
        ? `Alertas enviadas para: ${alertsSent.join(', ')}` 
        : 'No se requerían alertas (todo al día)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. REPORTAR TICKETS (BUGS / SUGERENCIAS)
app.post('/api/tickets', (req, res) => {
  try {
    const { type, title, description, reportedBy } = req.body;
    if (!type || !title || !reportedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (type, title, reportedBy)' });
    }
    const ticket = db.addTicket(type, title, description, reportedBy);
    
    // Trigger push notification to other user
    const ticketTypeStr = type === 'bug' ? '🐛 Bug Reportado' : '💡 Nueva Idea';
    sendPushNotification(
      getOtherUser(reportedBy),
      ticketTypeStr,
      `${reportedBy} ha reportado: ${title}`
    );

    // Enviar correo de alerta a i.martienztajuelo@gmail.com
    const emailSubject = `[Casita Hub] ${ticketTypeStr}: ${title}`;
    const emailBody = `Reportado por: ${reportedBy}\nTipo: ${type === 'bug' ? 'Bug / Error' : 'Nueva Idea / Función'}\nTítulo: ${title}\nDescripción:\n${description || 'Sin descripción adicional.'}\n\nEnviado automáticamente por el servidor de Casita Hub.`;
    
    sendEmailAlert(emailSubject, emailBody);

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error al reportar ticket' });
  }
});

// 7. RESUMEN DIARIO DE COMIDAS Y TAREAS
function getDailySummaryData() {
  const quotes = [
    "«El secreto para salir adelante es comenzar.» — Mark Twain",
    "«No cuentes los días, haz que los días cuenten.» — Muhammad Ali",
    "«Haz de cada día tu obra maestra.» — John Wooden",
    "«La felicidad no es algo ya hecho. Viene de tus propias acciones.» — Dalai Lama",
    "«La mejor manera de predecir el futuro es crearlo.» — Peter Drucker",
    "«Solo se vive una vez, pero si lo haces bien, una vez es suficiente.» — Mae West",
    "«Da siempre lo mejor de ti. Lo que plantes ahora, lo cosecharás más tarde.» — Og Mandino",
    "«El único modo de hacer un gran trabajo es amar lo que haces.» — Steve Jobs",
    "«La vida es lo que pasa mientras estás ocupado haciendo otros planes.» — John Lennon",
    "«Hoy es un buen día para tener un gran día.» — Anónimo"
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Formato fecha en castellano: "Lunes, 13 de julio"
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateStr = new Date().toLocaleDateString('es-ES', options);
  const capitalizedDateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Fecha local en formato YYYY-MM-DD
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60 * 1000));
  const todayId = localDate.toISOString().split('T')[0];

  const planningList = db.getPlanning() || [];
  const todayPlanning = planningList.find(p => p.dayId === todayId) || {};

  const pendingTasks = db.getTasks().map(t => t.text);

  return {
    quote: randomQuote,
    date: capitalizedDateStr,
    planning: {
      comida: todayPlanning.comida || 'Sin planificar 🍳',
      cena: todayPlanning.cena || 'Sin planificar 🍲',
      actividad: todayPlanning.actividad || 'Ninguna actividad registrada 🏖️'
    },
    pendingTasks
  };
}

app.get('/api/daily-summary', (req, res) => {
  try {
    res.json(getDailySummaryData());
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el resumen diario' });
  }
});

app.get('/api/push/test-daily-summary', async (req, res) => {
  try {
    const summary = getDailySummaryData();
    const bodyText = `Comida: ${summary.planning.comida}. Cena: ${summary.planning.cena}. Clica para ver detalles.`;
    
    await sendPushNotification('Ismael', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
    await sendPushNotification('Sandra', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
    
    res.json({ success: true, message: 'Resumen push enviado a ambos teléfonos', summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cron de resumen diario a las 06:30 AM
cron.schedule('30 6 * * *', async () => {
  try {
    console.log('[Cron] Ejecutando envío automático del resumen diario a las 06:30 AM...');
    const summary = getDailySummaryData();
    const bodyText = `Comida: ${summary.planning.comida}. Cena: ${summary.planning.cena}. Clica para ver detalles.`;
    
    await sendPushNotification('Ismael', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
    await sendPushNotification('Sandra', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
  } catch (err) {
    console.error('[Cron] Error en envío del resumen diario:', err.message);
  }
});

// Endpoint para disparador de cron externo (evita el apagado de Render gratis)
app.get('/api/cron/daily-summary', async (req, res) => {
  try {
    const { secret } = req.query;
    const expectedSecret = process.env.CRON_SECRET || 'casitahub_secret_key_123';
    
    if (secret !== expectedSecret) {
      return res.status(401).json({ error: 'No autorizado. Secreto inválido.' });
    }
    
    console.log('[External Cron] Ejecutando envío del resumen diario por llamada de cron externo...');
    const summary = getDailySummaryData();
    const bodyText = `Comida: ${summary.planning.comida}. Cena: ${summary.planning.cena}. Clica para ver detalles.`;
    
    await sendPushNotification('Ismael', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
    await sendPushNotification('Sandra', '☀️ Resumen Diario de Hoy', bodyText, '/?openDailySummary=true');
    
    res.json({ success: true, message: 'Resumen enviado correctamente.' });
  } catch (error) {
    console.error('[External Cron] Error en webhook:', error);
    res.status(500).json({ error: error.message });
  }
});
// 8. GASTOS COMPARTIDOS
app.get('/api/expenses', (req, res) => {
  try {
    const list = db.getExpenses();
    
    // Calcular balance
    let balanceIsmaelPaid = 0;
    let balanceSandraPaid = 0;
    list.forEach(e => {
      if (e.paidBy === 'Ismael') balanceIsmaelPaid += e.amount;
      if (e.paidBy === 'Sandra') balanceSandraPaid += e.amount;
      // Los pagados con Tarjeta Conjunta no entran en la deuda individual
    });

    let ower = null;
    let amountOwed = 0;
    
    if (balanceIsmaelPaid > balanceSandraPaid) {
      ower = 'Sandra';
      amountOwed = (balanceIsmaelPaid - balanceSandraPaid) / 2;
    } else if (balanceSandraPaid > balanceIsmaelPaid) {
      ower = 'Ismael';
      amountOwed = (balanceSandraPaid - balanceIsmaelPaid) / 2;
    }

    res.json({
      expenses: list,
      totals: {
        Ismael: balanceIsmaelPaid,
        Sandra: balanceSandraPaid
      },
      balance: {
        ower,
        amount: parseFloat(amountOwed.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, paidBy, category } = req.body;
    if (!description || !amount || !paidBy || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (description, amount, paidBy, category)' });
    }
    const expense = db.addExpense(description, amount, paidBy, category);
    
    // Trigger push notification to other user
    await sendPushNotification(
      getOtherUser(paidBy === 'Conjunta' ? 'Ismael' : paidBy), // si es conjunta, avisamos a Sandra (o al que no la metiera)
      '💰 Gasto Registrado',
      `${paidBy} ha pagado: ${description} (${amount}€)`
    );

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir gasto' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = db.deleteExpense(id);
    if (!success) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar gasto' });
  }
});

app.post('/api/expenses/clear', async (req, res) => {
  try {
    const { clearedBy } = req.body;
    db.clearExpenses();
    
    if (clearedBy) {
      await sendPushNotification(
        getOtherUser(clearedBy),
        '🤝 Gastos Liquidados',
        `${clearedBy} ha saldado las cuentas de casa`
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al liquidar cuentas' });
  }
});

// 9. NEVERA VIRTUAL
app.get('/api/notes', (req, res) => {
  try {
    res.json(db.getFridgeNotes());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notas' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { text, color, addedBy } = req.body;
    if (!text || !color || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const note = db.addFridgeNote(text, color, addedBy);
    
    await sendPushNotification(
      getOtherUser(addedBy),
      '📝 Nota en la Nevera',
      `${addedBy} ha pegado una nota: "${text.length > 30 ? text.slice(0, 30) + '...' : text}"`
    );

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir nota' });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = db.deleteFridgeNote(id);
    if (!success) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar nota' });
  }
});

// 10. RECETARIO Y AUTO-COMPRA
app.get('/api/recipes', (req, res) => {
  try {
    res.json(db.getRecipes());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

app.post('/api/recipes', (req, res) => {
  try {
    const { name, ingredients, instructions, addedBy } = req.body;
    if (!name || !ingredients || !instructions || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const recipe = db.addRecipe(name, ingredients, instructions, addedBy);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir receta' });
  }
});

app.post('/api/recipes/:id/import', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { importedBy } = req.body;
    if (!importedBy) {
      return res.status(400).json({ error: 'Falta especificar quién importa' });
    }
    
    const recipes = db.getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Importar cada ingrediente a la lista de la compra
    recipe.ingredients.forEach(ing => {
      // db.addShopping firma: (text, note, supermarket, addedBy)
      db.addShopping(ing.name, ing.qty || '', ing.supermarket || '', importedBy);
    });

    await sendPushNotification(
      getOtherUser(importedBy),
      '🍽️ Ingredientes Importados',
      `${importedBy} ha añadido los ingredientes de "${recipe.name}" a la lista de compra`
    );

    res.json({ success: true, count: recipe.ingredients.length });
  } catch (error) {
    res.status(500).json({ error: 'Error al importar ingredientes' });
  }
});

// 11. DIARIO DE MASCOTAS
app.get('/api/pets', (req, res) => {
  try {
    res.json(db.getPetsData());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de mascotas' });
  }
});

app.post('/api/pets/:name/weight', async (req, res) => {
  try {
    const petName = req.params.name;
    const { weight, addedBy } = req.body;
    if (!weight || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const updatedPet = db.addPetWeight(petName, weight);

    await sendPushNotification(
      getOtherUser(addedBy),
      `🐹 Peso de ${petName}`,
      `${addedBy} ha registrado el peso de ${petName}: ${weight} kg`
    );

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir peso de mascota' });
  }
});

app.post('/api/pets/:name/medical', async (req, res) => {
  try {
    const petName = req.params.name;
    const { title, note, addedBy } = req.body;
    if (!title || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const updatedPet = db.addPetMedical(petName, title, note);

    await sendPushNotification(
      getOtherUser(addedBy),
      `🏥 Historial Médico: ${petName}`,
      `${addedBy} ha añadido: "${title}" para ${petName}`
    );

    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir historial médico de mascota' });
  }
});

// 12. BITÁCORA DE MANTENIMIENTO
app.get('/api/maintenance', (req, res) => {
  try {
    res.json(db.getMaintenanceLogs());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mantenimiento' });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const { title, description, addedBy } = req.body;
    if (!title || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const log = db.addMaintenanceLog(title, description, addedBy);

    await sendPushNotification(
      getOtherUser(addedBy),
      '🔧 Bitácora de la Casa',
      `${addedBy} ha registrado: ${title}`
    );

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir registro de mantenimiento' });
  }
});

// --- APARTADO GARANTÍAS Y MANTENIMIENTO VEHÍCULOS ---
app.get('/api/warranties', (req, res) => {
  try {
    res.json(db.getWarranties());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener garantías' });
  }
});

app.post('/api/warranties', async (req, res) => {
  try {
    const { name, purchaseDate, expirationDate, imagesBase64, addedBy } = req.body;
    if (!name || !purchaseDate || !expirationDate || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const warranty = db.addWarranty(name, purchaseDate, expirationDate, imagesBase64, addedBy);

    await sendPushNotification(
      getOtherUser(addedBy),
      '📄 Nueva Garantía',
      `${addedBy} ha guardado la garantía de: ${name}`
    );

    res.status(201).json(warranty);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar garantía' });
  }
});

app.delete('/api/warranties/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.deleteWarranty(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar garantía' });
  }
});

app.get('/api/maintenance-books', (req, res) => {
  try {
    res.json(db.getMaintenanceBooks());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener libros de mantenimiento' });
  }
});

app.post('/api/maintenance-books/:vehicle/entries', async (req, res) => {
  try {
    const vehicle = req.params.vehicle;
    const { date, km, type, description, imagesBase64, addedBy } = req.body;
    if (!date || !type || !addedBy) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const entry = db.addMaintenanceEntry(vehicle, date, km, type, description, imagesBase64, addedBy);

    const typeLabel = type === 'revision' ? 'Revisión' : type === 'reparacion' ? 'Reparación' : 'Mantenimiento';
    const kmLabel = km ? ` (${km} km)` : '';
    await sendPushNotification(
      getOtherUser(addedBy),
      `🔧 Mantenimiento de ${vehicle}`,
      `${addedBy} ha registrado: ${typeLabel}${kmLabel}`
    );

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar mantenimiento de vehículo' });
  }
});

app.delete('/api/maintenance-books/:vehicle/entries/:id', (req, res) => {
  try {
    const vehicle = req.params.vehicle;
    const id = parseInt(req.params.id);
    db.deleteMaintenanceEntry(vehicle, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar mantenimiento de vehículo' });
  }
});

// --- 13. INTEGRACIÓN CON ALEXA (WEBHOOK DE LA SKILL) ---

// Helper para construir la respuesta estándar de Alexa
function makeAlexaResponse(speechText, shouldEndSession = true) {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: speechText
      },
      shouldEndSession
    }
  };
}

// Parser de comandos naturales en castellano
function parseNaturalCommand(text) {
  if (!text) return null;

  // Texto limpio para matching (sin tildes, en minúsculas)
  const cleanMatch = text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Determinar si es Tarea o Compra
  let category = 'shopping'; // por defecto
  
  const taskKeywords = [
    'tarea', 'tareas', 'deber', 'tengo que', 'hacer', 'limpiar', 'fregar', 'barrer', 
    'reparar', 'arreglar', 'ordenar', 'organizar', 'recuerdame', 'recuerdame que',
    'planchar', 'cocinar', 'lavar', 'tirar'
  ];
  
  const shoppingKeywords = [
    'comprar', 'compra', 'supermercado', 'lista de compra', 'lista de compras', 'compras'
  ];

  const hasTaskKeyword = taskKeywords.some(kw => cleanMatch.includes(kw));
  const hasShoppingKeyword = shoppingKeywords.some(kw => cleanMatch.includes(kw));

  if (hasTaskKeyword && !hasShoppingKeyword) {
    category = 'task';
  } else {
    category = 'shopping';
  }

  let parsedText = text.trim();
  let supermarket = '';

  // Si es compra, buscar y extraer el supermercado
  if (category === 'shopping') {
    const knownSupermarkets = [
      'mercadona', 'lidl', 'primaprix', 'ahorramas', 'carrefour', 'dia', 'alcampo', 'aldi', 'eroski'
    ];
    
    for (const superm of knownSupermarkets) {
      // Coincidencia con palabras completas del supermercado y opcionalmente prefijos como "en", "de", "del"
      const regex = new RegExp(`\\b(en|de|del)?\\s*${superm}\\b`, 'i');
      if (regex.test(parsedText)) {
        supermarket = superm.toUpperCase();
        parsedText = parsedText.replace(regex, '').trim();
        break;
      }
    }
  }

  // Eliminar palabras de control al final (ej: "a comprar", "en casa", "a tareas")
  const trailingRegexes = [
    /\s+en\s+casa\s*$/i,
    /\s+a\s+comprar\s*$/i,
    /\s+a\s+la\s+compra\s*$/i,
    /\s+a\s+la\s+lista\s+de\s+compras?\s*$/i,
    /\s+a\s+las?\s+tareas?\s*$/i,
    /\s+a\s+la\s+lista\s+de\s+tareas?\s*$/i,
    /\s+a\s+compra\s*$/i,
    /\s+a\s+tareas?\s*$/i
  ];

  for (const regex of trailingRegexes) {
    parsedText = parsedText.replace(regex, '').trim();
  }

  // Eliminar palabras de control al principio (ej: "añade", "recuerdame", "alexa dile a casita hub que")
  const leadingRegexes = [
    /^\s*alexa\s+dile\s+a\s+casita\s+hub\s+que\s+(añada|añade|agrega|pon|compre|compra)\s+/i,
    /^\s*dile\s+a\s+casita\s+hub\s+que\s+(añada|añade|agrega|pon|compre|compra)\s+/i,
    /^\s*alexa\s+dile\s+a\s+casita\s+hub\s+que\s+/i,
    /^\s*dile\s+a\s+casita\s+hub\s+que\s+/i,
    /^\s*alexa\s+/i,
    /^\s*casita\s+hub\s+/i,
    /^\s*añade\s+a\s+la\s+lista\s+de\s+compras?\s+de\s*/i,
    /^\s*añade\s+a\s+la\s+lista\s+de\s+compras?\s+a\s*/i,
    /^\s*añade\s+a\s+la\s+lista\s+de\s+compras?\s*/i,
    /^\s*añade\s+a\s+la\s+lista\s+de\s+tareas?\s*/i,
    /^\s*añadir\s+a\s+la\s+lista\s+de\s+compras?\s*/i,
    /^\s*añadir\s+a\s+la\s+lista\s+de\s+tareas?\s*/i,
    /^\s*(añade|añadir|agrega|agregar|pon|poner|compra|comprar)\s+que\s+/i,
    /^\s*(añade|añadir|agrega|agregar|pon|poner|compra|comprar)\s+a\s+comprar\s+/i,
    /^\s*(añade|añadir|agrega|agregar|pon|poner|compra|comprar)\s+a\s+tareas\s+/i,
    /^\s*(añade|añadir|agrega|agregar|pon|poner|compra|comprar)\s+/i,
    /^\s*(recuerdame|recuérdame)\s+que\s+/i,
    /^\s*(recuerdame|recuérdame)\s+/i,
    /^\s*(tengo que)\s+/i
  ];

  for (const regex of leadingRegexes) {
    parsedText = parsedText.replace(regex, '').trim();
  }

  // Eliminar preposiciones y artículos sobrantes al inicio (ej. si queda "de tomates" -> "tomates")
  parsedText = parsedText.replace(/^\s*(de|del|el|la|los|las|un|una|unos|unas)\s+/i, '').trim();

  // Capitalizar primera letra
  if (parsedText) {
    parsedText = parsedText.charAt(0).toUpperCase() + parsedText.slice(1);
  }

  return {
    category,
    parsedText,
    supermarket
  };
}

app.post('/api/alexa', async (req, res) => {
  try {
    const { request, session } = req.body;
    if (!request) {
      return res.status(400).json({ error: 'Formato de petición inválido' });
    }

    // 1. Verificación de Seguridad (Skill Application ID)
    const alexaSkillId = process.env.ALEXA_SKILL_ID || db.getAlexaConfig().skillId;
    if (alexaSkillId && session?.application?.applicationId && session.application.applicationId !== alexaSkillId) {
      console.warn(`[Alexa] Petición rechazada: Application ID inválido (${session.application.applicationId})`);
      return res.status(403).json({ error: 'Unauthorized Alexa Skill Application ID' });
    }

    const requestType = request.type;

    // Manejar LaunchRequest (Cuando se abre la Skill sin comando)
    if (requestType === 'LaunchRequest') {
      return res.json(makeAlexaResponse(
        '¡Hola! Bienvenido a Casita Hub. Dime qué quieres añadir a la lista de compra o a tus tareas.',
        false
      ));
    }

    // Manejar SessionEndedRequest
    if (requestType === 'SessionEndedRequest') {
      return res.json({ version: '1.0', response: { shouldEndSession: true } });
    }

    // Manejar IntentRequest
    if (requestType === 'IntentRequest') {
      const intentName = request.intent.name;

      // 1. Añadir artículo de compra
      if (intentName === 'AddShoppingItemIntent') {
        const itemSlot = request.intent.slots?.item?.value;
        const supermarketSlot = request.intent.slots?.supermarket?.value;

        if (!itemSlot) {
          return res.json(makeAlexaResponse('No he podido identificar el producto. ¿Qué quieres comprar?', false));
        }

        const supermarket = supermarketSlot ? supermarketSlot.toUpperCase() : '';
        const itemText = itemSlot.charAt(0).toUpperCase() + itemSlot.slice(1);
        
        db.addShopping(itemText, '', supermarket, 'Alexa');

        // Notificación Push a ambos usuarios
        const supermText = supermarket ? ` en ${supermarket}` : '';
        const pushTitle = '🛒 Compra (Alexa)';
        const pushBody = `Alexa ha añadido "${itemText}" a la lista de compra${supermText}`;
        await Promise.all([
          sendPushNotification('Ismael', pushTitle, pushBody),
          sendPushNotification('Sandra', pushTitle, pushBody)
        ]);

        return res.json(makeAlexaResponse(`He añadido ${itemSlot} a la lista de compra${supermText}.`));
      }

      // 2. Añadir tarea
      if (intentName === 'AddTaskIntent') {
        const taskSlot = request.intent.slots?.task?.value;

        if (!taskSlot) {
          return res.json(makeAlexaResponse('No he podido identificar la tarea. ¿Qué tarea quieres añadir?', false));
        }

        const taskText = taskSlot.charAt(0).toUpperCase() + taskSlot.slice(1);
        
        db.addTask(taskText, 'domestica', 'Alexa');

        // Notificación Push a ambos usuarios
        const pushTitle = '📋 Tarea (Alexa)';
        const pushBody = `Alexa ha añadido la tarea: "${taskText}"`;
        await Promise.all([
          sendPushNotification('Ismael', pushTitle, pushBody),
          sendPushNotification('Sandra', pushTitle, pushBody)
        ]);

        return res.json(makeAlexaResponse(`He añadido la tarea "${taskSlot}" a Casita Hub.`));
      }

      // 3. Comando Natural / Procesamiento de Frase Completa
      if (intentName === 'NaturalCommandIntent') {
        const commandSlot = request.intent.slots?.command?.value || request.intent.slots?.phrase?.value;

        if (!commandSlot) {
          return res.json(makeAlexaResponse('No he recibido ningún comando. ¿Qué puedo hacer por ti?', false));
        }

        const parsed = parseNaturalCommand(commandSlot);
        if (!parsed || !parsed.parsedText) {
          return res.json(makeAlexaResponse('No he podido entender el comando. Por favor, inténtalo de nuevo con otra frase.', false));
        }

        if (parsed.category === 'shopping') {
          const supermText = parsed.supermarket ? ` en ${parsed.supermarket}` : '';
          db.addShopping(parsed.parsedText, '', parsed.supermarket, 'Alexa');

          // Notificación Push
          const pushTitle = '🛒 Compra (Alexa)';
          const pushBody = `Alexa ha añadido "${parsed.parsedText}" a la lista de compra${supermText}`;
          await Promise.all([
            sendPushNotification('Ismael', pushTitle, pushBody),
            sendPushNotification('Sandra', pushTitle, pushBody)
          ]);

          return res.json(makeAlexaResponse(`Añadido ${parsed.parsedText} a la lista de compra${supermText}.`));
        } else {
          db.addTask(parsed.parsedText, 'domestica', 'Alexa');

          // Notificación Push
          const pushTitle = '📋 Tarea (Alexa)';
          const pushBody = `Alexa ha añadido la tarea: "${parsed.parsedText}"`;
          await Promise.all([
            sendPushNotification('Ismael', pushTitle, pushBody),
            sendPushNotification('Sandra', pushTitle, pushBody)
          ]);

          return res.json(makeAlexaResponse(`Añadida la tarea "${parsed.parsedText}" a Casita Hub.`));
        }
      }

      // 4. Intenciones Estándar de Alexa
      if (intentName === 'AMAZON.HelpIntent') {
        return res.json(makeAlexaResponse(
          'Puedes pedirme cosas como: "añade leche a comprar", "añade fregar el suelo a tareas", o "añade patatas de Mercadona". ¿Qué deseas hacer?',
          false
        ));
      }

      if (intentName === 'AMAZON.CancelIntent' || intentName === 'AMAZON.StopIntent') {
        return res.json(makeAlexaResponse('¡Hasta pronto!'));
      }
    }

    // Respuesta genérica por defecto
    return res.json(makeAlexaResponse('Lo siento, no he podido procesar esa petición.'));
  } catch (error) {
    console.error('[Alexa Error]', error);
    res.status(500).json({ error: 'Error interno en el webhook de Alexa' });
  }
});

// --- SERVIR FRONTEND EN PRODUCCIÓN ---
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('Sirviendo archivos estáticos del frontend desde:', distPath);
} else {
  console.log('Modo desarrollo: El servidor backend sólo responde a la API en /api/*');
}

// --- ARRANCAR SERVIDOR ---
async function startServer() {
  try {
    // 1. Sincronizar base de datos desde MongoDB Atlas antes de cualquier operación
    await syncFromMongoDB();
    
    // 2. Configurar claves VAPID para notificaciones push una vez cargada la base de datos
    vapidKeys = db.getVapidKeys();
    if (!vapidKeys) {
      vapidKeys = webpush.generateVAPIDKeys();
      db.saveVapidKeys(vapidKeys);
      console.log('Nuevas claves VAPID generadas y guardadas en la base de datos.');
    }
    webpush.setVapidDetails(
      'mailto:casitahub@example.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    console.log('🔑 Claves VAPID configuradas con éxito.');
  } catch (err) {
    console.error('Error al sincronizar base de datos antes de arrancar:', err);
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de Hogar Compartido corriendo en http://localhost:${PORT}`);
  });
}
startServer();
