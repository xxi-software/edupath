import mongoose from "mongoose";

interface IGroup extends mongoose.Document {
  title: string;
  teacherId: mongoose.Types.ObjectId; // User ID of the teacher
  students: mongoose.Types.ObjectId[]; // Array of user IDs
  description: string;
  difficulty: "easy" | "medium" | "hard";
  assignedStudents: mongoose.Types.ObjectId[]; // Array of user IDs who are assigned to the group
  completedBy: mongoose.Types.ObjectId[]; // Array of user IDs who have completed the group
  experience: number;
  mainTheme: string;
  points: number;
  status: "published" | "draft";
  subtopicThemes: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

const groupSchema = new mongoose.Schema<IGroup>({
  title: {
    type: String,
    required: [true, "El título del grupo es obligatorio"],
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El ID del profesor es obligatorio"],
  }, // User ID of the teacher
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who are assigned to the group
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who have completed the group
  experience: { type: Number, required: true },
  mainTheme: { type: String, required: true },
  points: { type: Number, required: true },
  status: { type: String, enum: ["published", "draft"], required: true },
  subtopicThemes: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
});

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group;
