import Stripe from "stripe";
import prismaClient from "../../prisma";

interface SubscribeRequest {
	user_id: string;
}

class SubscribeService {
	async execute({ user_id }: SubscribeRequest) {
		const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
			apiVersion: "2025-12-15.clover",
			appInfo: {
				name: "barber-api",
				version: "1.0.0",
			},
		});
		const findUser = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
		});
		if (!findUser) {
			throw new Error("USER NOT FOUND.");
		}
		let customerId = findUser.subscription_id;
		if (!customerId) {
			const customer = await stripe.customers.create({
				email: findUser.email,
			});
			await prismaClient.user.update({
				where: {
					id: user_id,
				},
				data: {
					subscription_id: customer.id,
				},
			});
			customerId = customer.id;
		}
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ["card"],
			billing_address_collection: "required",
			line_items: [
				{
					price: process.env.STRIPE_PRICE!,
					quantity: 1,
				},
			],
			mode: "subscription",
			allow_promotion_codes: true,
			success_url: process.env.STRIPE_SUCCESS_URL!,
			cancel_url: process.env.STRIPE_CANCEL_URL!,
		});
		return {
			url: session.url,
		};
	}
}

export { SubscribeService };
