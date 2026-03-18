"use client";

import { HaircutProps, UpdateHaircutProps } from "@/@types";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import {
	Flex,
	Heading,
	Input,
	Button,
	Text,
	Center,
	Switch,
	SwitchCheckedChangeDetails,
} from "@chakra-ui/react";
import Link from "next/link";
import { setupAPIClient } from "@/services/api";
import { useRouter } from "next/navigation";

interface HaircutDetailsProps {
	subscription: string;
	haircut: HaircutProps;
}

export default function HaircutDetailsClient({
	haircut,
	subscription,
}: HaircutDetailsProps) {
	const route = useRouter();
	const [name, setName] = useState(haircut?.name);
	const [statusSwitch, setStatusSwitch] = useState(haircut?.status);
	const [price, setPrice] = useState<string | number>(haircut?.price);
	console.log(haircut, statusSwitch);
	async function handleUpdate() {
		if (!haircut.id) return;
		const priceNumber = Number(price);
		if (isNaN(priceNumber) || priceNumber <= 0) {
			return;
		}
		const data: UpdateHaircutProps = {
			haircut_id: haircut.id,
			name,
			price: priceNumber,
			status: statusSwitch,
		};
		const response = await handleUpdateHaircut(data);
		if (response) {
			return route.push("/haircut");
		}
	}
	const isPremiun = subscription === "active";
	async function handleHaircutStatus({ checked }: SwitchCheckedChangeDetails) {
		setStatusSwitch(checked);
	}
	return (
		<Sidebar>
			<Flex py={6} direction="column" w="100%" alignItems="flex-start" gap={6}>
				<Flex
					w="100%"
					justifyContent="space-between"
					alignItems="center"
					maxW={700}
				>
					<Flex w="80%" gap={4} alignItems="center">
						<Link href="/haircut">
							<Flex
								background="barber.400"
								px={4}
								py={2}
								borderRadius={8}
								color="white"
								_hover={{ scale: 1.01 }}
							>
								<Text>Voltar</Text>
							</Flex>
						</Link>
						<Heading fontSize="2xl" fontWeight="bold" color="orange.900">
							Editar modelo
						</Heading>
					</Flex>
				</Flex>
				<Flex
					background="barber.400"
					w="100%"
					p={6}
					gap={4}
					direction="column"
					borderRadius={8}
					color="white"
					maxW={700}
				>
					<Center>
						<Heading size="md">Dados do corte</Heading>
					</Center>
					<Input
						placeholder="Nome do corte"
						background="barber.900"
						variant="subtle"
						size="lg"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={!isPremiun}
					/>
					<Input
						placeholder="Preço do corte ex: 50.00"
						background="barber.900"
						variant="subtle"
						size="lg"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						disabled={!isPremiun}
					/>
					<Flex alignItems={"center"} gap={2} color={"white"}>
						<Text userSelect={"none"}>Desativar corte</Text>
						<Switch.Root
							size={"lg"}
							defaultChecked={statusSwitch}
							colorScheme={"inherit"}
							colorPalette="red"
							value={statusSwitch === true ? "true" : "false"}
							onCheckedChange={(e) => handleHaircutStatus(e)}
							disabled={!isPremiun}
						>
							<Switch.HiddenInput />
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label />
						</Switch.Root>
					</Flex>
					<Button
						background="button.cta"
						color="barber.400"
						size="lg"
						onClick={handleUpdate}
						_hover={{
							background: "#fba931ee",
							color: "barber.1000",
							scale: 1.004,
						}}
						disabled={!isPremiun}
					>
						Salvar
					</Button>
					{!isPremiun && (
						<Flex justifyContent="center" alignItems="center">
							<Text>
								<Link href="/haircut/new">
									<Text as="span" color="green.400" fontWeight="bold">
										Seja premium
									</Text>
								</Link>{" "}
								e tenha todos acessos liberados!
							</Text>
						</Flex>
					)}
				</Flex>
			</Flex>
		</Sidebar>
	);
}

// Depois criar um serviço para atualizar o corte
async function handleUpdateHaircut(data: UpdateHaircutProps) {
	if (!data.haircut_id) return false;
	try {
		const apiClient = setupAPIClient();
		await apiClient.put("/haircut", data);
		return true;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}
}
