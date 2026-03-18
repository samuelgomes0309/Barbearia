import prismaClient from "../../prisma";

interface HaircutRequest {
	user_id: string;
	haircut_id: string;
}

class DetailHaircutService {
	async execute({ user_id, haircut_id }: HaircutRequest) {
		if (!haircut_id) {
			throw new Error("INVALID DATA.");
		}
		const haircut = await prismaClient.haircut.findFirst({
			where: {
				id: haircut_id,
				user_id: user_id,
			},
		});
		return haircut;
	}
}

export { DetailHaircutService };
