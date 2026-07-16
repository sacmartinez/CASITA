import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: Por favor, define la variable de entorno MONGODB_URI.');
    console.log('Ejemplo de ejecución: MONGODB_URI="mongodb+srv://..." node migrate.js');
    process.exit(1);
  }

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Error: No se encontró el archivo db.json local para migrar.');
    process.exit(1);
  }

  try {
    console.log('📖 Leyendo base de datos local (db.json)...');
    const localContent = fs.readFileSync(DB_PATH, 'utf-8');
    const localData = JSON.parse(localContent);

    console.log('🔌 Conectando a MongoDB Atlas...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('casitahub');
    const collection = db.collection('app_state');

    console.log('📤 Subiendo datos de Casita Hub a la colección app_state...');
    await collection.updateOne(
      { key: 'global_state' },
      { $set: { ...localData } },
      { upsert: true }
    );

    console.log('🎉 ¡Migración completada con éxito! Tus datos locales de db.json ya están en la nube.');
    await client.close();
  } catch (err) {
    console.error('❌ Error durante la migración:', err);
  }
}

migrate();
