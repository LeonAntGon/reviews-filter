import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor define la variable de ambiente MONGODB_URI'
  );
}

if (!MONGODB_DB) {
  throw new Error(
    'Por favor define la variable de ambiente MONGODB_DB'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        dbName: MONGODB_DB,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ Nueva conexión a MongoDB establecida');
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
}

// Monitoreo de la conexión
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB conectado exitosamente');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error en la conexión de MongoDB:', err);
  cached.promise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB desconectado');
  cached.conn = null;
  cached.promise = null;
});

// Manejo de reconexión
mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconectado');
});

// Cierre limpio en terminación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB desconectado a través de la terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar la conexión de MongoDB:', err);
    process.exit(1);
  }
});

export default dbConnect;