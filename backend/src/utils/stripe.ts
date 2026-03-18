import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
	apiVersion: "2025-12-15.clover",
	appInfo: {
		name: "barber-api",
		version: "1.0.0",
	},
});
