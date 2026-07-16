import { MongoClient } from 'mongodb';

async function test() {
  const uri = "mongodb+srv://sacmartinez94_db_user:Ds5H6AGEIF9qoULn@casita.b7weuet.mongodb.net/?appName=CASITA";
  const client = new MongoClient(uri);
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await client.connect();
    const db = client.db('casitahub');
    const collection = db.collection('app_state');
    const doc = await collection.findOne({ key: 'global_state' });
    if (doc) {
      console.log('✅ Documento encontrado!');
      console.log('Claves en el documento:', Object.keys(doc));
      console.log('Número de artículos en shopping:', doc.shopping ? doc.shopping.length : 'no existe');
      console.log('Número de tareas en tasks:', doc.tasks ? doc.tasks.length : 'no existe');
      console.log('Mascotas registradas:', doc.pets ? Object.keys(doc.pets) : 'no existe');
    } else {
      console.log('❌ No se encontró ningún documento con key: global_state');
    }
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  } finally {
    await client.close();
  }
}

test();
