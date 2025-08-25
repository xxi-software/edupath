import mongoose from "mongoose";

interface IGroup extends mongoose.Document {
  name: string;
  teacher: mongoose.Types.ObjectId; // User ID of the teacher
  students: mongoose.Types.ObjectId[]; // Array of user IDs
  description: string;
  difficulty: "easy" | "medium" | "hard";
  assignedStudents: mongoose.Types.ObjectId[]; // Array of user IDs who are assigned to the group
  completeBy: mongoose.Types.ObjectId[]; // Array of user IDs who have completed the group
  experience: number;
  mainTheme: string;
  point: number;
  status: "published" | "draft";
  subtopicsThemes: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

const groupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: [true, "El nombre del grupo es obligatorio"],
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El profesor es obligatorio"],
  }, // User ID of the teacher
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who are assigned to the group
  completeBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who have completed the group
  experience: { type: Number, required: true },
  mainTheme: { type: String, required: true },
  point: { type: Number, required: true },
  status: { type: String, enum: ["published", "draft"], required: true },
  subtopicsThemes: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
});

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group;
