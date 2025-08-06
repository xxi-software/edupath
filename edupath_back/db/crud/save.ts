import mongoose from "mongoose";
import User, { type IUser } from "../models/User";

export async function saveUser(name: string, email: string, password: string, role: "student" | "teacher"): Promise<IUser> {
  if (!name || !email || !password || !role) {
    throw new Error("Name, email, password, and role are required");
  }
  if (!["student", "teacher"].includes(role)) {
    throw new Error("Role must be either 'student' or 'teacher'");
  }
  // Create a new user instance and save it to the database
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    console.log("User saved successfully:", user);
    return user;
  } catch (error) {
    console.error("Error saving user:", error);
    throw new Error("Error saving user");
  }
}