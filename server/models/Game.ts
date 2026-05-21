import mongoose, { Schema } from "mongoose";

export type GameStatus = "waiting" | "playing" | "finished";
export type PlayerColor = "red" | "blue" | "green" | "yellow";

export interface IGamePlayer {
  user_id: Schema.Types.ObjectId;
  username: string;
  color: PlayerColor;
  rank?: number;
  coins_earned: number;
}

export interface IGame extends mongoose.Document {
  total_players: number;
  players: IGamePlayer[];
  status: GameStatus;
  started_at?: Date;
  finished_at?: Date;
}

const gamePlayerSchema = new Schema<IGamePlayer>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    color: {
      type: String,
      enum: ["red", "blue", "green", "yellow"],
      required: true,
    },
    rank: { type: Number },
    coins_earned: { type: Number, default: 0 },
  },
  { _id: false },
);

const gameSchema = new Schema<IGame>(
  {
    total_players: { type: Number, required: true },
    players: { type: [gamePlayerSchema], default: [] },
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    started_at: { type: Date },
    finished_at: { type: Date },
  },
  { timestamps: true },
);

const Game = mongoose.model<IGame>("Game", gameSchema);
export default Game;
