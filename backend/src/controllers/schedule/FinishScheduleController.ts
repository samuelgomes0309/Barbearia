import { Request, Response } from "express";
import { FinishScheduleService } from "../../services/schedule/FinishScheduleService";

class FinishScheduleController {
	async handle(req: Request, res: Response) {
		const schedule_id = req.params.schedule_id as string;
		const user_id = req.user_id;
		const finishScheduleService = new FinishScheduleService();
		const schedule = await finishScheduleService.execute({
			schedule_id,
			user_id,
		});
		return res.json(schedule);
	}
}

export { FinishScheduleController };
