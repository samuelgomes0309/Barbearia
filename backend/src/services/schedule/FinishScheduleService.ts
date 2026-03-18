import prismaClient from "../../prisma";

interface ScheduleRequest {
	schedule_id: string;
	user_id: string;
}

class FinishScheduleService {
	async execute({ schedule_id, user_id }: ScheduleRequest) {
		if (!schedule_id) {
			throw new Error("INVALID SCHEDULE DATA.");
		}
		const result = await prismaClient.service.deleteMany({
			where: {
				user_id,
				id: schedule_id,
			},
		});
		if (result.count === 0) {
			throw new Error("SCHEDULE NOT FOUND OR NOT AUTHORIZED.");
		}
		return {
			message: "Schedule finish successfully",
		};
	}
}

export { FinishScheduleService };
