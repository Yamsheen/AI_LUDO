import User from "../models/User.js";
import { signToken } from "../utils/token.js";
const buildCookieOptions = () => ({
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
export const signup = async (req, res) => {
    const { username, password, confirmPassword, dob } = req.body;
    if (!username || !password || !confirmPassword) {
        res.status(400).json({ message: "username, password, confirmPassword required" });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ message: "password and confirmPassword must match" });
        return;
    }
    const existing = await User.findOne({ username });
    if (existing) {
        res.status(409).json({ message: "Username already exists" });
        return;
    }
    const user = await User.create({ username, password, dob, coins: 100 });
    const token = signToken({ userId: String(user._id) });
    res.cookie("token", token, buildCookieOptions());
    res.status(201).json({
        user: {
            id: user._id,
            username: user.username,
            dob: user.dob,
            coins: user.coins,
            total_played: user.total_played,
        },
    });
};
export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password required" });
        return;
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const token = signToken({ userId: String(user._id) });
    res.cookie("token", token, buildCookieOptions());
    res.json({
        user: {
            id: user._id,
            username: user.username,
            dob: user.dob,
            coins: user.coins,
            total_played: user.total_played,
        },
    });
};
export const me = async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    res.json({ user });
};
export const updateProfile = async (req, res) => {
    const { username, password, dob } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (username && username !== user.username) {
        const exists = await User.findOne({ username });
        if (exists) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }
        user.username = username;
    }
    if (password) {
        user.password = password;
    }
    if (dob !== undefined) {
        user.dob = dob;
    }
    await user.save();
    res.json({
        user: {
            id: user._id,
            username: user.username,
            dob: user.dob,
            coins: user.coins,
            total_played: user.total_played,
        },
    });
};
export const logout = async (_req, res) => {
    res.clearCookie("token");
    res.json({ ok: true });
};
//# sourceMappingURL=authController.js.map