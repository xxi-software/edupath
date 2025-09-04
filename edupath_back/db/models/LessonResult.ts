import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

export type LessonStatus = "passed" | "failed" | "partial";

export interface IAnswerDetail {
  questionId: string;
  isCorrect: boolean;
  points: number;
  givenAnswer?: string;
  expectedAnswer?: string;
}

export interface ILessonResult extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  pointsEarned: number;
  attempt: number;
  status: LessonStatus;
  detail?: {
    accuracy?: number;
    answers?: IAnswerDetail[];
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const lessonResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    pointsEarned: { type: Number, required: true },
    attempt: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["passed", "failed", "partial"],
      required: true,
    },
    detail: {
      accuracy: { type: Number },
      answers: [
        {
          questionId: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
          points: { type: Number, required: true },
          givenAnswer: { type: String },
          expectedAnswer: { type: String },
        },
      ],
      notes: { type: String },
    },
  },
  {
    timestamps: true,
    collection: "lesson_results",
  }
);

lessonResultSchema.index({ userId: 1, lessonId: 1, attempt: -1 }, { unique: true, name: "unique_user_lesson_attempt" });

const LessonResult = mongoose.model("LessonResult", lessonResultSchema);

export default LessonResult;
