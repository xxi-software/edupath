import mongoose from "mongoose";

interface IQuestion extends mongoose.Document {
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  points: number;
  xp: number;
  hints: string[];
}

interface ILesson extends mongoose.Document {
  title: string;
  description: string;
  assignmentId: string;
  order: number;
  estimatedDuration: number;
  difficulty: number;
  prerequisiteIds: string[];
  content: {
    theory: string;
    examples: string[];
    visualAids: string[];
  };
  questions: IQuestion[];
  rewards: {
    points: number;
    xp: number;
    badges: string[];
  };
  adaptiveSettings: {
    minAccuracy: number;
    adaptiveDifficulty: boolean;
    retryAllowed: boolean;
    maxRetries: number;
  };
  unlocked: boolean;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  type: { type: String, enum: ['multiple-choice', 'fill-blank'], required: true },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  difficulty: { type: Number, min: 1, max: 5, required: true },
  points: { type: Number, required: true },
  xp: { type: Number, required: true },
  hints: [String]
});

const lessonSchema = new mongoose.Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignmentId: { type: String, required: true },
  order: { type: Number, required: true },
  estimatedDuration: { type: Number, required: true },
  difficulty: { type: Number, min: 1, max: 5, required: true },
  prerequisiteIds: [String],
  content: {
    theory: { type: String, required: true },
    examples: [String],
    visualAids: [String]
  },
  questions: [questionSchema],
  rewards: {
    points: { type: Number, required: true },
    xp: { type: Number, required: true },
    badges: [String]
  },
  adaptiveSettings: {
    minAccuracy: { type: Number, required: true },
    adaptiveDifficulty: { type: Boolean, required: true },
    retryAllowed: { type: Boolean, required: true },
    maxRetries: { type: Number, required: true }
  },
  unlocked: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
export default Lesson;