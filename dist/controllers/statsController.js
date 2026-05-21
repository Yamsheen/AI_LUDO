import Game from "../models/Game.js";
import User from "../models/User.js";
export const leaderboard = async (_req, res) => {
    const users = await User.find({})
        .select("username coins total_played")
        .sort({ coins: -1, total_played: 1 });
    res.json({ users });
};
export const history = async (req, res) => {
    const games = await Game.find({ "players.user_id": req.userId })
        .sort({ createdAt: -1 })
        .lean();
    res.json({ games });
};
//# sourceMappingURL=statsController.js.map