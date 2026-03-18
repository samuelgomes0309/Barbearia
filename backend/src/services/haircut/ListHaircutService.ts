import prismaClient from "../../prisma";

interface HaircutRequest {
	user_id: string;
	status: boolean;
}

class ListHaircutsService {
	async execute({ user_id, status }: HaircutRequest) {
		const haircuts = await prismaClient.haircut.findMany({
			where: {
				user_id: user_id,
				status: status,
			},
			orderBy: {
				name: "asc",
			},
		});
		return haircuts;
	}
}

export { ListHaircutsService };
