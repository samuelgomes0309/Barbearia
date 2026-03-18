import { Request, Response } from "express";
import { SessionUserService } from "../../services/user/SessionUserService";

class SessionUserController {
	async handle(req: Request, res: Response) {
		const { email, password } = req.body;
		const sessionUserService = new SessionUserService();
		const session = await sessionUserService.execute({ email, password });
		return res.json(session);
	}
}

export { SessionUserController };
