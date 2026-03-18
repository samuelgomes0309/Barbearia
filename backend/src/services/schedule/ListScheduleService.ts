import prismaClient from "../../prisma";

interface ScheduleRequest {
	user_id: string;
}

class ListScheduleService {
	async execute({ user_id }: ScheduleRequest) {
		const schedules = await prismaClient.service.findMany({
			where: {
				user_id,
			},
			select: {
				id: true,
				customer: true,
				haircut: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		});
		return schedules;
	}
}

export { ListScheduleService };
