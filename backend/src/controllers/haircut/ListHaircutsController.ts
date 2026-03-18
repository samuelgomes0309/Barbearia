import { Request, Response } from "express";
import { ListHaircutsService } from "../../services/haircut/ListHaircutService";

class ListHaircutsController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const { status } = req.query;
		const listHaircutsService = new ListHaircutsService();
		const haircuts = await listHaircutsService.execute({
			user_id,
			status: status === undefined ? true : status === "true",
		});
		return res.json(haircuts);
	}
}

export { ListHaircutsController };
