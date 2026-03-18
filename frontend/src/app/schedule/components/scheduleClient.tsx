"use client";
import { HaircutProps, NewAppointmentProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import { setupAPIClient } from "@/services/api";
import {
	Button,
	createListCollection,
	Flex,
	Heading,
	Input,
	Portal,
	Select,
	Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ScheduleClientProps {
	haircuts: HaircutProps[];
}

export default function ScheduleClient({ haircuts }: ScheduleClientProps) {
	const router = useRouter();
	const haircutCollection = createListCollection({
		items: haircuts.map((haircut) => ({
			id: haircut.id,
			label: haircut.name,
			value: haircut.id,
		})),
	});
	const [costumer, setCostumer] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedHaircut, setSelectedHaircut] = useState<string[]>([]);
	async function handleRegister() {
		if (costumer.length === 0 || selectedHaircut.length === 0) {
			return;
		}
		setLoading(true);
		const response = await handleCreateSchedule({
			customer: costumer,
			haircut_id: selectedHaircut[0],
		});
		setLoading(false);
		if (response) {
			router.push("/dashboard");
		}
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
						<Link href="/dashboard">
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
							Novo agendamento
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
					<Input
						placeholder="Nome do cliente"
						background="barber.900"
						variant="subtle"
						size="lg"
						_placeholder={{ color: "gray" }}
						value={costumer}
						borderRadius={8}
						onChange={(e) => setCostumer(e.target.value)}
						disabled={loading}
					/>
					<Select.Root
						collection={haircutCollection}
						size="lg"
						disabled={loading}
						value={selectedHaircut}
						onValueChange={(e) => setSelectedHaircut(e.value)}
					>
						<Select.HiddenSelect />
						<Select.Control
							bg="barber.900"
							borderColor={"transparent"}
							borderRadius={8}
							color={selectedHaircut.length === 0 ? "white" : "gray"}
						>
							<Select.Trigger px={4} py={3} borderWidth={0}>
								<Select.ValueText
									placeholder="Selecione algum corte"
									color={selectedHaircut.length === 0 ? "gray" : "white"}
								/>
							</Select.Trigger>
							<Select.IndicatorGroup>
								<Select.Indicator color="gray.400" />
							</Select.IndicatorGroup>
						</Select.Control>
						<Portal>
							<Select.Positioner>
								<Select.Content
									bg="barber.900"
									borderWidth={1}
									boxShadow="none"
									borderColor={"gray/45"}
									p={0.5}
								>
									{haircutCollection.items.map((item) => (
										<Select.Item
											key={item.id}
											item={item}
											color="white"
											transition={"all"}
											animationDuration={"0.2s"}
											_hover={{ bg: "barber.400" }}
											_selected={{
												bg: "barber.400",
											}}
										>
											<Select.ItemText>{item.label}</Select.ItemText>
										</Select.Item>
									))}
								</Select.Content>
							</Select.Positioner>
						</Portal>
					</Select.Root>
					<Button
						disabled={loading}
						background="button.cta"
						color="barber.400"
						size="lg"
						_hover={{
							background: "#fba931ee",
							color: "barber.1000",
							scale: 1.004,
						}}
						onClick={handleRegister}
					>
						Registrar
					</Button>
				</Flex>
			</Flex>
		</Sidebar>
	);
}

//Criar um component de serviço para criar o agendamento
async function handleCreateSchedule(data: NewAppointmentProps) {
	if (!data) return false;
	try {
		const apiClient = setupAPIClient();
		await apiClient.post("/schedule", data);
		return true;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}
}
