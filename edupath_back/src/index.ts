import express, {type Request, type Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from '../db/connection';
import router from './routes/userR';
import cors from 'cors';

const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URL_CLUSTER;
if (!url) {
  throw new Error("No se ha proporcionado la URL de MongoDB en las variables de entorno");
}

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('edupath_back API is running');
});

app.use('/api/users', router);

async function startServer() {
  try {
    // 1. Conecta a la base de datos primero y espera a que la conexión termine.
    // Esto es lo que faltaba.
    await connectToDatabase();

    // 2. Una vez que la base de datos esté conectada, inicia el servidor de Express.
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Sale del proceso si la conexión falla.
  }
}

startServer();
