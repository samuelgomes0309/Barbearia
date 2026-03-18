import prismaClient from "../../prisma";

interface ScheduleRequest {
	user_id: string;
	customer: string;
	haircut_id: string;
}

class CreateScheduleService {
	async execute({ customer, haircut_id, user_id }: ScheduleRequest) {
		if (!customer || !haircut_id) {
			throw new Error("INVALID DATA.");
		}
		const schedule = await prismaClient.service.create({
			data: {
				customer,
				haircut_id,
				user_id,
			},
		});
		return schedule;
	}
}

export { CreateScheduleService };
