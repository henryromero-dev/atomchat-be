// Script de prueba para verificar la conexión a Firebase
require('dotenv').config();
const admin = require('firebase-admin');

async function testFirebaseConnection() {
  try {
    console.log('🔥 Iniciando prueba de conexión a Firebase...');
    
    // Configuración moderna del SDK
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'default-project',
    };
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      config.credential = admin.credential.applicationDefault();
      console.log('✅ Usando credenciales de archivo JSON');
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      config.credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      });
      console.log('✅ Usando credenciales de variables de entorno');
    } else {
      console.warn('⚠️  No se encontraron credenciales específicas. Usando configuración por defecto.');
      config.credential = admin.credential.applicationDefault();
    }
    
    // Inicializar Firebase con configuración moderna
    admin.initializeApp(config);
    const db = admin.firestore();
    
    // Configurar para emulador si está en desarrollo
    if (process.env.NODE_ENV === 'development' && process.env.FIRESTORE_EMULATOR_HOST) {
      db.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false
      });
      console.log('🔧 Usando emulador de Firestore');
    }
    
    // Probar conexión
    console.log('🔄 Probando conexión a Firestore...');
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Conexión exitosa a Firestore!');
    
    // Crear un documento de prueba
    await db.collection('test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Conexión exitosa desde Node.js con SDK moderno',
      sdkVersion: 'Firebase Admin SDK v12+'
    });
    console.log('✅ Documento de prueba creado exitosamente!');
    
    console.log('🎉 ¡Firebase está configurado correctamente con SDK moderno!');
    
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error.message);
    console.log('\n📝 Verifica:');
    console.log('1. Que el archivo .env esté configurado correctamente');
    console.log('2. Que las credenciales de Firebase sean válidas');
    console.log('3. Que Firestore esté habilitado en tu proyecto');
    console.log('4. Que estés usando Firebase Admin SDK v12+');
  }
}

testFirebaseConnection();
