import mongoose, { Schema } from "mongoose";
const gamePlayerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    color: {
        type: String,
        enum: ["red", "blue", "green", "yellow"],
        required: true,
    },
    rank: { type: Number },
    coins_earned: { type: Number, default: 0 },
}, { _id: false });
const gameSchema = new Schema({
    total_players: { type: Number, required: true },
    players: { type: [gamePlayerSchema], default: [] },
    status: {
        type: String,
        enum: ["waiting", "playing", "finished"],
        default: "waiting",
    },
    started_at: { type: Date },
    finished_at: { type: Date },
}, { timestamps: true });
const Game = mongoose.model("Game", gameSchema);
export default Game;
//# sourceMappingURL=Game.js.map