import { stripe } from "./stripe";
import prismaClient from "../prisma";

export async function saveSubscription(
	subscriptionId: string,
	customerId: string,
	createAction: boolean = false,
	deleteAction: boolean = false
) {
	if (createAction && deleteAction) {
		throw new Error(
			"Cannot create and delete a subscription at the same time."
		);
	}
	const findUser = await prismaClient.user.findFirst({
		where: {
			subscription_id: customerId,
		},
		include: {
			subscriptions: true,
		},
	});
	if (!findUser) {
		throw new Error("User not found!");
	}
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const subscriptionData = {
		id: subscription.id,
		user_id: findUser.id,
		status: subscription.status,
		priceId: subscription.items.data[0].price.id,
	};
	if (createAction) {
		// Codigo para criar a assinatura
		try {
			await prismaClient.subscription.create({
				data: subscriptionData,
			});
		} catch (error) {
			console.log("Error creating subscription:", error);
		}
		return;
	} else {
		// Codigo para deletar a assinatura
		if (deleteAction) {
			try {
				await prismaClient.subscription.deleteMany({
					where: {
						id: subscriptionId,
					},
				});
			} catch (error) {
				console.log("Error deleting subscription:", error);
			}
			return;
		}
		// Codigo para atualizar a assinatura
		try {
			await prismaClient.subscription.update({
				where: {
					id: subscriptionId,
				},
				data: {
					status: subscription.status,
					priceId: subscription.items.data[0].price.id,
				},
			});
		} catch (error) {
			console.log("Error updating subscription:", error);
		}
	}
}
