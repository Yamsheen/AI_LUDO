import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    dob: { type: String },
    coins: { type: Number, default: 100 },
    total_played: { type: Number, default: 0 },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=User.js.map