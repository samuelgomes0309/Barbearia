import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./components/profileClient";
import { setupAPIClient } from "@/services/api";

export default async function Profile() {
	const cookieStore = await cookies();
	const token = cookieStore.get("@barberpro.token")?.value;
	// Se não tiver token, redireciona
	if (!token) {
		redirect("/login");
	}
	let user;
	try {
		// Cria client da API já com token
		const apiClient = setupAPIClient({
			token,
		});
		const { data } = await apiClient.get("/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		user = data;
		// Renderiza o Client Component com dados do server
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		//  Token inválido ou erro na API
		// console.log("Erro ao carregar dados do usuário:", error);
		redirect("/dashboard");
	}
	return <ProfileClient user={user} />;
}
