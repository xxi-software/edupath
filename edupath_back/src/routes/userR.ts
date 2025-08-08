import express, { type Request, type Response } from "express";
import { saveUser } from "../../db/crud/save";
import jwt from "jsonwebtoken";
import User from "../../db/models/User";
import { fetchUserByEmail } from "../../db/crud/fetch";

const router = express.Router();

router.post("/createUser", async (req: Request, res: Response) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
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
    const user = await fetchUserByEmail(email);
    const token = jwt.sign({ userId: result._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    if (result) {
      return res.status(201).send({
        message: "User created successfully",
        token,
        user,
      });
    }
    // Para depurar, puedes imprimir los datos recibidos
  } catch (error) {
    console.error("Error in createUser route:", error);
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }
    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Fetch a lean, sanitized user object without sensitive fields
    const safeUser = await fetchUserByEmail(email);
    return res.status(200).send({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error in login route:", error);
    return res.status(500).send("Internal server error");
  }
});

export default router;
