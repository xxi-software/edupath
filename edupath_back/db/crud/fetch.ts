// db/crud/fetch.ts
import User, { type IUser } from "../models/User";

const SENSITIVE_FIELDS =
  "-password -resetPasswordToken -resetPasswordExpires -verificationToken";

type SafeUser = Omit<
  IUser,
  | "password"
  | "comparePassword"
  | "resetPasswordToken"
  | "resetPasswordExpires"
  | "verificationToken"
>;

export async function fetchUserById(id: string): Promise<SafeUser | null> {
  return await User.findById(id)
    .select(SENSITIVE_FIELDS)
    .lean<SafeUser>()
    .exec();
}

export async function fetchUserByEmail(
  email: string
): Promise<SafeUser | null> {
  return await User.findOne({ email })
    .select(SENSITIVE_FIELDS)
    .lean<SafeUser>()
    .exec();
}
