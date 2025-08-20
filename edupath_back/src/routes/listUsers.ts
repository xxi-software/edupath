import { Router } from "express";
import User from "../../db/models/User";

const listUsersRouter = Router();


listUsersRouter.get("/listStudents", async (req, res) => {
  try {
    const users = await User.find({role: 'student'}).select('-password'); // Exclude passwords
    if(!users){
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default listUsersRouter;