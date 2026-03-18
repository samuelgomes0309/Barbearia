import { HaircutProps, UserProps } from "@/@types";
import { setupAPIClient } from "@/services/api";
import { cookies } from "next/headers";
import HaircutDetailsClient from "./components/haircutDetailsClient";

interface HaircutDetailsProps {
	params: {
		id: string;
	};
}

export default async function HaircutDetails({ params }: HaircutDetailsProps) {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let haircut: HaircutProps;
	let subscription = "";
	const { id } = await params;
	if (token) {
		const apiClient = setupAPIClient({ token });
		const [haircutData, meData] = await Promise.all([
			apiClient.get<HaircutProps>(`/haircut/${id}`).then((res) => res.data),
			apiClient.get<UserProps>("/me").then((res) => res.data),
		]);
		haircut = haircutData;
		subscription = meData.subscriptions?.status ?? null;
	}
	return <HaircutDetailsClient subscription={subscription} haircut={haircut} />;
}
