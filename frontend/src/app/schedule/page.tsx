import { HaircutProps } from "@/@types";
import { setupAPIClient } from "@/services/api";
import { cookies } from "next/headers";
import ScheduleClient from "./components/scheduleClient";

export default async function Schedule() {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let haircuts: HaircutProps[] = [];
	if (token) {
		const apiClient = setupAPIClient({ token });
		const response = await apiClient.get<HaircutProps[]>("/haircuts", {
			params: { status: true },
		});
		haircuts = response.data;
	}
	return <ScheduleClient haircuts={haircuts} />;
}
