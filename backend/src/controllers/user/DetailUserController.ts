import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const detailUserservice = new DetailUserService();
		const details = await detailUserservice.execute({ user_id });
		return res.json(details);
	}
}

export { DetailUserController };
