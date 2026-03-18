"use client";
import { UserProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useContext, useState } from "react";

interface ProfileClientProps {
	user: UserProps;
}

export default function ProfileClient({ user }: ProfileClientProps) {
	const { signOut, updateUser } = useContext(AuthContext);
	const [name, setName] = useState(user?.name || "");
	const [address, setAddress] = useState(user?.address || "");
	const statusSubscription =
		user?.subscriptions?.status === "active" ? true : false;
	async function handleLogout() {
		await signOut();
	}
	async function handleUpdate() {
		updateUser({ name, address });
	}
	return (
		<Sidebar>
			<Flex
				direction={"column"}
				gap={6}
				w={"100%"}
				py={6}
				justifyItems={"flex-start"}
				alignItems={"flex-start"}
			>
				<Heading fontSize="2xl" fontWeight="bold" color={"orange.900"}>
					Minha Conta
				</Heading>
				<Flex
					background={"barber.400"}
					w={"100%"}
					p={6}
					gap={4}
					direction={"column"}
					borderRadius={8}
					color={"white"}
					maxW={700}
				>
					<Text fontWeight={"bold"}>Nome da barbearia:</Text>
					<Input
						placeholder="Nome da barbearia"
						_placeholder={{ color: "gray" }}
						background={"barber.900"}
						variant={"subtle"}
						type="text"
						size={"lg"}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Text fontWeight={"bold"}>Endereço:</Text>
					<Input
						placeholder="Endereço da barbearia"
						_placeholder={{ color: "gray" }}
						background={"barber.900"}
						variant={"subtle"}
						type="text"
						size={"lg"}
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					<Text fontWeight={"bold"}>Plano atual</Text>
					<Flex
						w={"100%"}
						justify={"space-between"}
						align={"center"}
						border={"xs"}
						px={4}
						py={2}
						borderRadius={8}
						borderColor={statusSubscription ? "orange.900/40" : "green.800"}
						background={"barber.900"}
					>
						<Text
							color={statusSubscription ? "orange.900" : "green.400"}
							fontWeight={"medium"}
						>
							{statusSubscription ? "Plano Premium" : "Plano gratis"}
						</Text>
						<Link href={"/subscription"}>
							<Flex
								background={statusSubscription ? "button.cta/90" : "green.400"}
								_hover={{
									background: statusSubscription ? "#fba931ee" : "green.400/90",
									scale: 1.004,
								}}
								color={"barber.900"}
								justifyItems={"center"}
								alignItems={"center"}
								px={4}
								h={8}
								rounded={4}
								cursor={"pointer"}
							>
								Mudar plano
							</Flex>
						</Link>
					</Flex>
					<Button
						background={"button.cta"}
						_hover={{
							background: "#fba931ee",
							color: "barber.1000",
							scale: 1.004,
						}}
						color={"barber.400"}
						size={"lg"}
						onClick={handleUpdate}
					>
						Salvar
					</Button>
					<Button
						background={"barber.700"}
						borderColor={"button.danger"}
						_hover={{
							background: "#barber.400",
							color: "#ff4040",
							scale: 1.004,
						}}
						color={"button.danger"}
						size={"lg"}
						onClick={handleLogout}
					>
						Sair da conta
					</Button>
				</Flex>
			</Flex>
		</Sidebar>
	);
}
