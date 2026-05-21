import jwt from "jsonwebtoken";
const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing in config.env");
    }
    return secret;
};
export const signToken = (payload) => jwt.sign(payload, getSecret(), { expiresIn: "7d" });
export const verifyToken = (token) => jwt.verify(token, getSecret());
//# sourceMappingURL=token.js.map