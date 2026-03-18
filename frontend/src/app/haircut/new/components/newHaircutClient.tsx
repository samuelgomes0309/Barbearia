"use client";

import { NewHaircutProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import { setupAPIClient } from "@/services/api";
import { Button, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

interface newHaircutProps {
	subscription: string;
	count: number;
}

export default function NewHaircutClient({
	count,
	subscription,
}: newHaircutProps) {
	const [price, setPrice] = useState("");
	const [name, setName] = useState("");
	const isPremium = subscription === "active";
	const limitReached = !isPremium && count >= 3;
	const [haircutCount, setHaircutCount] = useState(count);
	async function handleCreate() {
		if (limitReached) {
			return;
		}
		if (!name || !price) {
			return;
		}
		const priceNumber = parseFloat(price);
		if (isNaN(priceNumber)) {
			return;
		}
		const response = await CreateNewHaircut({ name, price: priceNumber });
		if (response) {
			setName("");
			setPrice("");
			setHaircutCount((prev) => prev + 1);
		} else {
			alert("Erro ao criar o corte, tente novamente.");
		}
	}
	return (
		<Sidebar>
			<Flex
				py={6}
				direction={"column"}
				justifyItems={"flex-start"}
				w={"100%"}
				alignItems={"flex-start"}
				gap={6}
			>
				<Flex
					w={"100%"}
					justifyContent={"space-between"}
					alignItems={"center"}
					maxW={700}
				>
					<Flex w={"80%"} gap={4} alignItems={"center"}>
						<Link href="/haircut">
							<Flex
								background={"barber.400"}
								px={4}
								py={2}
								borderRadius={8}
								color={"white"}
								_hover={{ scale: 1.01 }}
							>
								<Text>Voltar</Text>
							</Flex>
						</Link>
						<Heading fontSize="2xl" fontWeight="bold" color={"orange.900"}>
							Modelos de cortes
						</Heading>
					</Flex>
				</Flex>
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
					<Center>
						<Heading>Cadastrar modelo</Heading>
					</Center>
					<Input
						placeholder="Nome do corte"
						_placeholder={{ color: "gray" }}
						background={"barber.900"}
						variant={"subtle"}
						type="text"
						size={"lg"}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						placeholder="Preço do corte ex: 50.00"
						_placeholder={{ color: "gray" }}
						background={"barber.900"}
						variant={"subtle"}
						type="text"
						size={"lg"}
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					<Button
						background={"button.cta"}
						_hover={{
							background: "#fba931ee",
							color: "barber.1000",
							scale: 1.004,
						}}
						color={"barber.400"}
						size={"lg"}
						disabled={limitReached}
						onClick={handleCreate}
					>
						Cadastrar
					</Button>
					{limitReached ? (
						<Flex justifyContent="center" alignItems="center">
							<Text>
								Você atingiu o seu limite de cortes,{" "}
								<Link href="/subscription">
									<Text as="span" color="green.400" fontWeight="bold">
										seja premium
									</Text>
								</Link>{" "}
								e tenha cortes ilimitados!
							</Text>
						</Flex>
					) : (
						<Center>
							<Text>Você possui {haircutCount} cortes cadastrados.</Text>
						</Center>
					)}
				</Flex>
			</Flex>
		</Sidebar>
	);
}

// Mudar essa função para ser executada fora deste componente, criar um serviço
async function CreateNewHaircut({ name, price }: NewHaircutProps) {
	if (!name || !price) {
		return;
	}
	try {
		const apiClient = setupAPIClient();
		await apiClient.post("/haircut", { name, price });
		return true;
	} catch (error) {
		console.log("Erro ao criar novo corte", error);
		return false;
	}
}
