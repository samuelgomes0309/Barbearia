import prismaClient from "../../prisma";

interface HaircutRequest {
	haircut_id: string;
	user_id: string;
}

class DeleteHaircutService {
	async execute({ haircut_id, user_id }: HaircutRequest) {
		if (!haircut_id) {
			throw new Error("INVALID DATA.");
		}
		const user = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
			include: {
				subscriptions: true,
			},
		});
		if (!user || user.subscriptions?.status !== "active") {
			throw new Error("NOT AUTHORIZED.");
		}
		const haircut = await prismaClient.haircut.deleteMany({
			where: {
				id: haircut_id,
				user_id: user_id,
			},
		});
		if (haircut.count === 0) {
			throw new Error("HAIRCUT NOT FOUND.");
		}
		return {
			message: "Haircut deleted successfully",
		};
	}
}

export { DeleteHaircutService };
