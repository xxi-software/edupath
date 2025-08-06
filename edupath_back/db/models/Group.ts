import mongoose from "mongoose";

interface IGroup extends mongoose.Document {
  name: string;
  teacher: mongoose.Types.ObjectId; // User ID of the teacher
  students: mongoose.Types.ObjectId[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new mongoose.Schema<IGroup>({
  name: {
    type: String,
    required: [true, "El nombre del grupo es obligatorio"],
    trim: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El profesor es obligatorio"],
  }, // User ID of the teacher
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Group = mongoose.model<IGroup>("Group", groupSchema);
export default Group;
