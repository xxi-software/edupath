import { Router } from "express";
import Group from "../../db/models/Group";

const routerGroup = Router();

routerGroup.post("/createGroup", async (req, res) => {
  try {
    const { title, teacherId, description, difficulty, assignedStudents, completedBy, experience, mainTheme, points, status, subtopicThemes, dueDate } = req.body;
    console.log("BODY RECIBIDO", req.body);
    const group = new Group({
      title,
      teacherId,
      description,
      difficulty,
      completedBy,
      assignedStudents,
      experience,
      mainTheme,
      points,
      status,
      subtopicThemes,
      dueDate
    });
    await group.save();
    res.status(201).json({
      status: 200,
      message: "Grupo creado exitosamente"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

routerGroup.get("/getGroups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

routerGroup.delete("/deleteGroup", async (req, res) => {
  try {
    const { id } = req.body;
    await Group.findByIdAndDelete(id);
    res.status(200).json({ message: "Grupo eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default routerGroup;
