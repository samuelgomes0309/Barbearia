import { Request, Response } from "express";
import { CountHaircutService } from "../../services/haircut/CountHaircutService";

class CountHaircutController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const countHaircutService = new CountHaircutService();
		const haircuts = await countHaircutService.execute({ user_id });
		return res.json(haircuts);
	}
}

export { CountHaircutController };
