// db/connection.ts
import mongoose from 'mongoose';

let client: mongoose.Connection;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URL_CLUSTER as string;
  if (!uri) {
    throw new Error("MONGODB_URL_CLUSTER no está definido en el archivo .env");
  }

  try {
    // La conexión se realiza solo cuando se llama a esta función
    await mongoose.connect(uri);
    client = mongoose.connection;
    console.log("Conectado a la base de datos.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error; // Propaga el error
  }
}

export function getDb() {
  if (!client) {
    throw new Error("La base de datos no está conectada.");
  }
  return client;
}