import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const me: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logout: (_req: Request, res: Response) => Promise<void>;
