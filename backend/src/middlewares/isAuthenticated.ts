import { NextFunction, Request, Response } from "express";
import authConfig from "../config/auth.config";
import jwt from "jsonwebtoken";

interface TokenPayload {
	sub: string;
}

export function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const [, token] = authorization.split(" ");
	try {
		const { sub } = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;
		req.user_id = sub;
		return next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized" });
	}
}
