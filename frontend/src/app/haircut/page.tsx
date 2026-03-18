import { cookies } from "next/headers";
import { setupAPIClient } from "@/services/api";
import HaircutClient from "./components/haircutClient";
import { HaircutProps } from "@/@types";

export default async function Haircut() {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let haircuts: HaircutProps[] = [];
	if (token) {
		const apiClient = setupAPIClient({ token });
		const response = await apiClient.get<HaircutProps[]>("/haircuts", {
			params: { status: true },
		});
		haircuts = response.data;
	}
	return <HaircutClient haircuts={haircuts} />;
}
