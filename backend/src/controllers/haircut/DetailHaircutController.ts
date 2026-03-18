import { Request, Response } from "express";
import { DetailHaircutService } from "../../services/haircut/DetailHaircutService";

class DetailHaircutController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const { haircut_id } = req.params;
		const detailHaircutService = new DetailHaircutService();
		const haircut = await detailHaircutService.execute({
			haircut_id,
			user_id,
		});
		return res.json(haircut);
	}
}

export { DetailHaircutController };
