import { Router } from "express";
import { history, leaderboard } from "../controllers/statsController.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/leaderboard", requireAuth, leaderboard);
router.get("/history", requireAuth, history);
export default router;
//# sourceMappingURL=statsRoutes.js.map