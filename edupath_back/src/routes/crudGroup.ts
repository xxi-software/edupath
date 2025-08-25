import { Router } from "express";
import Group from "../../db/models/Group";

const routerGroup = Router();

routerGroup.post("/createGroup", async (req, res) => {
  try {
    const { title, teacherId, description, difficulty, assignedStudents, completeBy, experience, mainTheme, points, status, subtopicsThemes, dueDate } = req.body;

    const group = new Group({
      name: title,
      teacher: teacherId,
      description,
      difficulty,
      completeBy,
      assignedStudents,
      experience,
      mainTheme,
      point: points,
      status,
      subtopicsThemes,
      dueDate
    });
    await group.save();
    res.status(201).json({
      status: "success",
      message: "Grupo creado exitosamente"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

routerGroup.get("/getGroups", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({
      status: "success",
      data: groups
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default routerGroup;
