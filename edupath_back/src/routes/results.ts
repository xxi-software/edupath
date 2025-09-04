import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import Lesson from "../../db/models/Lesson";
import Group from "../../db/models/Group";
import User from "../../db/models/User";
import LessonResult from "../../db/models/LessonResult";
import { authenticateToken } from "../middleware/auth";

const router = Router();

type LessonStatus = "passed" | "failed" | "partial";

interface AnswerInput {
  questionId: string;
  answer: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "student" | "teacher";
  };
}

/**
 * computeScore()
 * - Calcula puntosEarned sumando puntos de preguntas correctas
 * - accuracy = correctas / total
 * - status:
 *    - passed  si accuracy >= minAccuracy
 *    - failed  si accuracy === 0
 *    - partial si 0 < accuracy < minAccuracy
 */
function computeScore(lesson: any, answers: AnswerInput[]) {
  const questions: any[] = Array.isArray(lesson?.questions) ? lesson.questions : [];

  // Construye índice por _id de las preguntas
  const qById = new Map<string, any>();
  for (const q of questions) {
    const key = (q._id?.toString?.() ?? q.id ?? q.question) as string;
    if (key) qById.set(key, q);
  }

  let correct = 0;
  let total = 0;
  let pointsEarned = 0;

  const answersDetail = [] as {
    questionId: string;
    isCorrect: boolean;
    points: number;
    givenAnswer?: string;
    expectedAnswer?: string;
  }[];

  for (const a of answers ?? []) {
    const q = qById.get(a.questionId);
    if (!q) continue;

    total += 1;

    const expected = q.correctAnswer;
    const isCorrect = String(a.answer).trim() === String(expected).trim();
    const pts = isCorrect ? (q.points ?? 0) : 0;

    if (isCorrect) {
      correct += 1;
      pointsEarned += pts;
    }

    answersDetail.push({
      questionId: a.questionId,
      isCorrect,
      points: pts,
      givenAnswer: a.answer,
      expectedAnswer: expected,
    });
  }

  // Si no se enviaron respuestas pero hay preguntas, se considera accuracy 0
  if (total === 0 && questions.length > 0) {
    total = questions.length;
  }

  const accuracy = total > 0 ? correct / total : 0;

  // minAccuracy en esquema es Number; asumimos [0..1]. Si viene como 0..100, normalizamos.
  let minAccuracy = Number(lesson?.adaptiveSettings?.minAccuracy ?? 0);
  if (minAccuracy > 1) {
    minAccuracy = minAccuracy / 100;
  }

  let status: LessonStatus = "failed";
  if (accuracy >= minAccuracy) {
    status = "passed";
  } else if (accuracy > 0) {
    status = "partial";
  }

  return { pointsEarned, accuracy, answersDetail, status };
}

/**
 * POST /api/results/submit
 * Body:
 * - groupId: string
 * - lessonId: string
 * - answers: { questionId, answer }[]
 * 
 * Reglas "mejor puntaje":
 * - Se guarda el intento en LessonResult.
 * - Se compara con el mejor previo del usuario para esa lección:
 *    - Si pointsEarned > oldBest:
 *        - bestByLesson[lessonId] = pointsEarned
 *        - totalBestPoints += (pointsEarned - oldBest)
 *        - groupPoints[groupId] += (pointsEarned - oldBest)
 */
router.post(
  "/submit",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const session = await mongoose.startSession();
    try {
      const { groupId: groupIdStr, lessonId: lessonIdStr, answers } = req.body as {
        groupId: string;
        lessonId: string;
        answers: AnswerInput[];
      };

      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!groupIdStr || !lessonIdStr) {
        return res
          .status(400)
          .json({ message: "groupId y lessonId son requeridos" });
      }

      const userId = new mongoose.Types.ObjectId(req.user.userId);
      const groupId = new mongoose.Types.ObjectId(groupIdStr);
      const lessonId = new mongoose.Types.ObjectId(lessonIdStr);

      let responsePayload: any;

      await session.withTransaction(async () => {
        // 1) Validaciones de pertenencia
        const group = await Group.findById(groupId).session(session);
        if (!group) {
          throw new Error("Grupo no encontrado");
        }

        // Verificar que el usuario está asignado al grupo (si aplica)
        if (
          Array.isArray(group.assignedStudents) &&
          !group.assignedStudents.some((sid: any) => sid.equals(userId))
        ) {
          throw new Error("El usuario no pertenece al grupo");
        }

        // (Opcional) si agregas group.lessons, validar que lessonId ∈ group.lessons
        if (Array.isArray((group as any).lessons) && (group as any).lessons.length > 0) {
          const inGroup = (group as any).lessons.some((lid: any) => lid.equals(lessonId));
          if (!inGroup) {
            throw new Error("La lección no está asignada a este grupo");
          }
        }

        // 2) Cargar lección y calcular puntaje
        const lesson = await Lesson.findById(lessonId).session(session);
        if (!lesson) {
          throw new Error("Lección no encontrada");
        }

        const { pointsEarned, accuracy, answersDetail, status } = computeScore(
          lesson,
          answers ?? []
        );

        // 3) Obtener attempt
        const last = await LessonResult.findOne({
          userId,
          groupId,
          lessonId,
        })
          .sort({ attempt: -1 })
          .session(session);

        const attempt = last ? last.attempt + 1 : 1;

        // 4) Crear el intento (LessonResult)
        const createdArr = await LessonResult.create(
          [
            {
              userId,
              groupId,
              lessonId,
              pointsEarned,
              attempt,
              status,
              detail: {
                accuracy,
                answers: answersDetail,
              },
            },
          ],
          { session }
        );
        const result = createdArr[0];

        // 5) Actualizar contadores de "mejor puntaje" en User
        const user = await User.findById(userId)
          .select("totalBestPoints bestByLesson groupPoints")
          .session(session);
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // Mongoose Map get() o fallback a objeto plain
        const bestMap: Map<string, number> | any = (user as any).bestByLesson;
        const oldBest =
          typeof bestMap?.get === "function"
            ? bestMap.get(lessonId.toString()) ?? 0
            : bestMap?.[lessonId.toString()] ?? 0;

        let delta = 0;
        if (pointsEarned > oldBest) {
          delta = pointsEarned - oldBest;

          await User.updateOne(
            { _id: userId },
            {
              $set: {
                [`bestByLesson.${lessonId.toString()}`]: pointsEarned,
              },
              $inc: {
                totalBestPoints: delta,
                [`groupPoints.${groupId.toString()}`]: delta,
              },
            },
            { session }
          );
        }

        // 6) Traer acumuladores actualizados
        const updatedUser = await User.findById(userId)
          .select("totalBestPoints bestByLesson groupPoints")
          .session(session);

        const totalBestPoints = updatedUser?.get("totalBestPoints") ?? 0;
        const bestByLessonMap = updatedUser?.get("bestByLesson");
        const bestForLesson =
          typeof bestByLessonMap?.get === "function"
            ? bestByLessonMap.get(lessonId.toString()) ?? Math.max(pointsEarned, oldBest)
            : bestByLessonMap?.[lessonId.toString()] ?? Math.max(pointsEarned, oldBest);

        const groupPointsMap = updatedUser?.get("groupPoints");
        const groupPointsVal =
          typeof groupPointsMap?.get === "function"
            ? groupPointsMap.get(groupId.toString()) ?? delta
            : groupPointsMap?.[groupId.toString()] ?? delta;

        responsePayload = {
          resultId: result._id,
          attempt,
          pointsEarned,
          status,
          detail: {
            accuracy,
            totalQuestions: lesson.questions?.length ?? answersDetail.length,
            correctAnswers: answersDetail.filter((x) => x.isCorrect).length,
          },
          totals: {
            totalBestPoints,
            bestByLesson: bestForLesson,
            groupPoints: groupPointsVal,
          },
        };
      });

      return res.status(201).json(responsePayload);
    } catch (err: any) {
      // Si hay error, intenta detectar error de índice único
      if (String(err?.message || "").includes("duplicate key")) {
        return res.status(409).json({ message: "Intento duplicado" });
      }
      return res.status(400).json({ message: err?.message ?? "Error al registrar resultado" });
    } finally {
      session.endSession();
    }
  }
);

export default router;