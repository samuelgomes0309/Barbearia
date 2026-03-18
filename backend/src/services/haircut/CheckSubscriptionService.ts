import prismaClient from "../../prisma";

interface SubscritpionRequest {
	user_id: string;
}

class CheckSubscriptionService {
	async execute({ user_id }: SubscritpionRequest) {
		const status = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
			select: {
				subscriptions: {
					select: {
						id: true,
						status: true,
					},
				},
			},
		});
		return status;
	}
}

export { CheckSubscriptionService };
