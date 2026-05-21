export type JwtPayload = {
    userId: string;
};
export declare const signToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=token.d.ts.map