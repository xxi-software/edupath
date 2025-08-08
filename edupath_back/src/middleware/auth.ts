import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "student" | "teacher";
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  // Obtener el token del encabezado de la solicitud
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Verificar el token
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: "student" | "teacher";
    };
    // Asignar el usuario decodificado a la solicitud
    req.user = decoded as { userId: string; role: "student" | "teacher" };
    // Continuar con la siguiente función middleware
    next();
  } catch (error) {
    // Si el token no es válido, devolver un error 401
    return res.status(401).json({ message: "Unauthorized" });
  }
};
