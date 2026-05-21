import { NextFunction, Request, Response } from "express";
export type AuthRequest = Request & {
    userId?: string;
};
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map