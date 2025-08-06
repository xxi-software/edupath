import express, { type Request, type Response } from "express";
import { saveUser } from "../../db/crud/save";

const router = express.Router();

router.post("/createUser", async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    console.log(name, email, password, confirmPassword, role);
    if (!name || !email || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .send("Name, email, password, confirmPassword, and role are required");
    }
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).send("Role must be either 'student' or 'teacher'");
    }
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }
    // Guardado en mongoDB
    const result = await saveUser(name, email, password, role);
    if (result) {
      return res.status(201).send("User created successfully");
    }
    // Para depurar, puedes imprimir los datos recibidos
  } catch (error) {
    console.error("Error in createUser route:", error);
    return res.status(500).send("Internal server error");
  }
});

export default router;
