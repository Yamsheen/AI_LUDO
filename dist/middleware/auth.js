import User from "../models/User.js";
import { verifyToken } from "../utils/token.js";
export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const payload = verifyToken(token);
        const user = await User.findById(payload.userId).select("_id");
        if (!user) {
            res.status(401).json({ message: "Invalid token user" });
            return;
        }
        req.userId = String(user._id);
        next();
    }
    catch (_error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.js.map