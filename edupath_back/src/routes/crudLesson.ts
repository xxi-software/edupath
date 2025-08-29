import { Router } from "express";
import Lesson from "../../db/models/Lesson";

const routerLesson = Router();

// Crear una nueva lección
routerLesson.post("/createLesson", async (req, res) => {
  try {
    const {
      title,
      description,
      assignmentId,
      order,
      estimatedDuration,
      difficulty,
      prerequisiteIds,
      content,
      questions,
      rewards,
      adaptiveSettings,
      unlocked,
      completed
    } = req.body;
    const lesson = new Lesson({
      title,
      description,
      assignmentId,
      order,
      estimatedDuration,
      difficulty,
      prerequisiteIds,
      content,
      questions,
      rewards,
      adaptiveSettings,
      unlocked,
      completed
    });
    await lesson.save();
    res.status(201).json({
      status: 200,
      message: "Lección creada exitosamente",
      lesson
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Obtener todas las lecciones por assignmentId
routerLesson.get("/getLessons/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const lessons = await Lesson.find({ assignmentId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Actualizar una lección
routerLesson.put("/updateLesson/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lección no encontrada" });
    }
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Eliminar una lección
routerLesson.delete("/deleteLesson/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLesson = await Lesson.findByIdAndDelete(id);
    if (!deletedLesson) {
      return res.status(404).json({ message: "Lección no encontrada" });
    }
    res.status(200).json({ message: "Lección eliminada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default routerLesson;