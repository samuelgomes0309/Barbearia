import prismaClient from "../../prisma";
import { stripe } from "../../utils/stripe";

interface CreatePortalRequest {
	user_id: string;
}

class CreatePortalService {
	async execute({ user_id }: CreatePortalRequest) {
		const findUser = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
		});
		if (!findUser) {
			throw new Error("USER NOT FOUND.");
		}
		const sessionId = findUser.subscription_id;
		if (!sessionId) {
			throw new Error("USER DOES NOT HAVE A SUBSCRIPTION.");
		}
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: sessionId,
			return_url: process.env.STRIPE_SUCCESS_URL!,
		});
		return { url: portalSession.url };
	}
}

export { CreatePortalService };
