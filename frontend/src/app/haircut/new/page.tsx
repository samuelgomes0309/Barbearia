import { cookies } from "next/headers";
import { setupAPIClient } from "@/services/api";
import NewHaircutClient from "./components/newHaircutClient";
import { HaircutCountProps, UserProps } from "@/@types";

export default async function NewHaircut() {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let count;
	let subscription = "";
	if (token) {
		const apiClient = setupAPIClient({ token });
		const [countData, meData] = await Promise.all([
			apiClient
				.get<HaircutCountProps>("/haircut/count")
				.then((res) => res.data),
			apiClient.get<UserProps>("/me").then((res) => res.data),
		]);
		count = countData.Actives.count;
		subscription = meData.subscriptions?.status ?? null;
	}
	return <NewHaircutClient count={count} subscription={subscription} />;
}
