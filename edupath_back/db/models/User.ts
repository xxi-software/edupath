import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  specialization?: string;
  institution?: string;
  profilePicture?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  groups?: mongoose.Types.ObjectId[]; // Array of group IDs
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  specialization: { type: String, default: "" },
  institution: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date, default: null },
  verificationToken: { type: String, default: "" },
  groups: { type: [mongoose.Schema.Types.ObjectId], ref: "Group", default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUser>("User", userSchema, "users");
export default User;