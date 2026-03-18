import axios from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

interface SetupAPIClientProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context?: any;
	token?: string;
}

export function setupAPIClient({
	context = undefined,
	token,
}: SetupAPIClientProps = {}) {
	// Se não recebeu token, pega do cookie (server)
	const cookies = parseCookies(context);
	const authToken = token || cookies["@barberpro.token"];
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				if (typeof window !== "undefined") {
					return Promise.reject(new AuthTokenError());
				}
			}
			return Promise.reject(error);
		}
	);
	return api;
}
