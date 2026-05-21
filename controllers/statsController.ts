import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import Game from "../models/Game.js";
import User from "../models/User.js";

export const leaderboard = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find({})
    .select("username coins total_played")
    .sort({ coins: -1, total_played: 1 });
  res.json({ users });
};

export const history = async (req: AuthRequest, res: Response): Promise<void> => {
  const games = await Game.find({ "players.user_id": req.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ games });
};
