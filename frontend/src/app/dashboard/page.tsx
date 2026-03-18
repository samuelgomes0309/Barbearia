import { cookies } from "next/headers";
import { setupAPIClient } from "@/services/api";
import { AppointmentProps } from "@/@types";
import DashboardClient from "./components/dashboardClient";

export default async function Dashboard() {
	const token = (await cookies()).get("@barberpro.token")?.value;
	let appointments: AppointmentProps[] = [];
	if (token) {
		const apiClient = setupAPIClient({ token });
		const response = await apiClient.get<AppointmentProps[]>("/schedules");
		appointments = response.data;
	}
	return <DashboardClient appointments={appointments} />;
}
