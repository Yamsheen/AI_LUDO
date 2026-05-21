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
declare const Game: mongoose.Model<IGame, {}, {}, {}, mongoose.Document<unknown, {}, IGame, {}, {}> & IGame & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Game;
//# sourceMappingURL=Game.d.ts.map