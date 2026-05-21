import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  dob?: string;
  coins: number;
  total_played: number;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    dob: { type: String },
    coins: { type: Number, default: 100 },
    total_played: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
