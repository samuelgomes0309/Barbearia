import { cookies } from "next/headers";
import SubscriptionClient from "./components/subscriptionClient";
import { setupAPIClient } from "@/services/api";
import { UserProps } from "@/@types";

export default async function Subscription() {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let hasSubscription;
	if (token) {
		const apiClient = setupAPIClient({ token });
		const response = await apiClient
			.get<UserProps>("/me")
			.then((res) => res.data);
		hasSubscription = response.subscriptions ?? null;
	}
	return <SubscriptionClient subscription={hasSubscription} />;
}
