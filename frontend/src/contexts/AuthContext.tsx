"use client";
import { SignInProps, SignUpProps, UpdateUserProps, UserProps } from "@/@types";
import { api } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextData {
	user: UserProps;
	isAuthenticated: boolean;
	signIn: ({ email, password }: SignInProps) => Promise<void>;
	signUp: ({ email, name, password }: SignUpProps) => Promise<void>;
	signOut: () => Promise<void>;
	updateUser?: ({ name, address }: UpdateUserProps) => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps>(null);
	const isAuthenticated = !!user;
	const router = useRouter();
	async function signOut() {
		destroyCookie(null, "@barberpro.token", { path: "/" });
		setUser(null);
		router.push("/login");
	}
	useEffect(() => {
		const { "@barberpro.token": token } = parseCookies();
		if (token) {
			api
				.get("/me")
				.then((response) => {
					const { id, name, email, address, subscriptions } = response.data;
					setUser({
						id,
						name,
						email,
						address,
						subscriptions,
					});
				})
				.catch(() => {
					signOut();
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	async function signIn({ email, password }: SignInProps) {
		if (!email || !password) {
			alert("Preencha todos os campos");
			return;
		}
		try {
			const response = await api.post("/sessions", {
				email,
				password,
			});
			const { id, name, token, address, subscriptions } = response.data;
			setUser({
				id,
				name,
				email,
				address,
				subscriptions,
			});
			// 60 *60 * 24 *30 = 30 dias
			setCookie(null, "@barberpro.token", token, {
				maxAge: 60 * 60 * 24 * 30,
				path: "/",
			});
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			router.push("/dashboard");
		} catch (error) {
			console.log("Erro ao acessar", error);
		}
	}
	async function signUp({ email, name, password }: SignUpProps) {
		if (!email || !name || !password) {
			alert("Preencha todos os campos");
			return;
		}
		try {
			await api.post("/users", {
				name,
				email,
				password,
			});
			router.push("/login");
		} catch (error) {
			console.log("Erro ao cadastrar o usuario", error);
		}
	}
	async function updateUser({ name, address }: UpdateUserProps) {
		// Para o futuro quero validar se o name ou endereço houve alguma mudança antes de fazer a requisição
		if (name.trim() === "" || address.trim() === "") {
			return;
		}
		try {
			await api.put("/users", {
				name: name,
				address: address,
			});
		} catch (error) {
			console.log("Erro ao atualizar o usuario", error);
		}
	}
	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, signIn, signUp, signOut, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}
