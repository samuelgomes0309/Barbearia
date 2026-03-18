import prismaClient from "../../prisma";

interface UserRequest {
	user_id: string;
}

class DetailUserService {
	async execute({ user_id }: UserRequest) {
		const user = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
				subscriptions: {
					select: {
						id: true,
						status: true,
					},
				},
			},
		});
		if (!user) {
			throw new Error("INVALID USER.");
		}
		return user;
	}
}

export { DetailUserService };
