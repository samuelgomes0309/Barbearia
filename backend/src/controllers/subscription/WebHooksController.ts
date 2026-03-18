import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../../utils/stripe";
import { saveSubscription } from "../../utils/manageSubscription";

class WebHooksController {
	async handle(req: Request, res: Response) {
		let event: Stripe.Event = req.body;
		const signature = req.headers["stripe-signature"] as string;
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET!
			);
		} catch (error) {
			console.log("Error processing webhook:", error);
			return res.status(400).send(`Webhook Error: ${error}`);
		}
		switch (event.type) {
			case "customer.subscription.deleted":
				const payment = event.data.object as Stripe.Subscription;
				await saveSubscription(
					payment.id,
					payment.customer.toString(),
					false,
					true
				);
				break;
			case "customer.subscription.updated":
				const paymentIntent = event.data.object as Stripe.Subscription;
				await saveSubscription(
					paymentIntent.id,
					paymentIntent.customer.toString(),
					false,
					false
				);
				break;
			case "checkout.session.completed":
				const checkoutSession = event.data.object as Stripe.Checkout.Session;
				if (checkoutSession.subscription) {
					await saveSubscription(
						checkoutSession.subscription.toString(),
						checkoutSession.customer!.toString(),
						true,
						false
					);
				}
				break;
			default:
				// console.log(`Unhandled event type ${event.type}`);
				break;
		}
	}
}

export { WebHooksController };
