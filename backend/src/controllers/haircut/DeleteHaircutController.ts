import { Request, Response } from "express";
import { DeleteHaircutService } from "../../services/haircut/DeleteHaircutService";

class DeleteHaircutController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const { haircut_id } = req.params;
		const deleteHaircutService = new DeleteHaircutService();
		const haircut = await deleteHaircutService.execute({ haircut_id, user_id });
		return res.json(haircut);
	}
}

export { DeleteHaircutController };
