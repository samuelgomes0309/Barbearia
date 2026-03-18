"use client";
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import logoImg from "../../../public/images/logo.svg";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Login() {
	const { signIn } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	async function handleLogin() {
		await signIn({ email, password });
	}
	return (
		<Flex
			background={"barber.900"}
			height={"100dvh"}
			justify={"center"}
			align={"center"}
		>
			<Flex
				flexDirection={"column"}
				gap={6}
				width={640}
				padding={14}
				rounded={8}
			>
				<Center padding={4}>
					<Image
						src={logoImg}
						alt="Logo BarberPro"
						quality={100}
						objectFit="fill"
					/>
				</Center>
				<Input
					placeholder="Digite seu email"
					_placeholder={{ color: "gray" }}
					background={"barber.400"}
					variant={"subtle"}
					type="email"
					size={"lg"}
					color={"white"}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="*********"
					background={"barber.400"}
					variant={"subtle"}
					type="password"
					color={"white"}
					size={"lg"}
					_placeholder={{ color: "gray" }}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					background={"button.cta"}
					_hover={{ background: "#fba931ee", color: "barber.1000" }}
					color={"barber.400"}
					size={"lg"}
					onClick={handleLogin}
				>
					Acessar
				</Button>
				<Center>
					<Link href={"/register"}>
						<Text color={"button.gray"}>
							Não possui uma conta? <strong>Cadastre-se</strong>
						</Text>
					</Link>
				</Center>
			</Flex>
		</Flex>
	);
}
