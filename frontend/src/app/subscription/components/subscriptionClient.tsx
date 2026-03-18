"use client";
import { SubscriptionProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import { setupAPIClient } from "@/services/api";
import {
	Button,
	Center,
	Flex,
	Heading,
	List,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";

interface SubscriptionClientProps {
	subscription: SubscriptionProps | null;
}

export default function SubscriptionClient({
	subscription,
}: SubscriptionClientProps) {
	const [isMobile] = useMediaQuery(["(max-width: 800px)"]);
	const isPremium = subscription?.status === "active";
	const planBasic = {
		header: "Plano grátis",
		items: ["Registrar cortes", "Criar apenas 3 cortes", "Editar seu perfil"],
	};
	const planPremium = {
		header: "Plano Premium",
		items: [
			"Registrar cortes ilimitados",
			"Criar modelos ilimitados",
			"Editar seu perfil",
			"Editar tipos de cortes",
			"Recebe todas atualizações",
		],
	};
	async function handleSubscribe() {
		if (isPremium) {
			return;
		}
		try {
			const apiClient = setupAPIClient();
			const response = await apiClient.post("/subscribe");
			const { url } = response.data;
			window.location.href = url;
		} catch (error) {
			console.log(error);
		}
	}
	async function handleCustomerPortal() {
		if (!isPremium) {
			return;
		}
		try {
			const apiClient = setupAPIClient();
			const response = await apiClient.post("/create-portal");
			const { url } = response.data;
			window.location.href = url;
		} catch (error) {
			console.log(error);
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
						<Heading fontSize="2xl" fontWeight="bold" color={"white"}>
							Planos
						</Heading>
					</Flex>
				</Flex>
				<Flex
					w="100%"
					gap={4}
					maxW={700}
					flexDirection={isMobile ? "column" : "row"}
				>
					<Flex
						background={"barber.400"}
						color={"white"}
						py={6}
						w={"100%"}
						borderRadius={8}
						direction="column"
						gap={4}
						px={10}
					>
						<Center>
							<Text fontSize={"2xl"} fontWeight={"bold"}>
								{planBasic.header}{" "}
							</Text>
						</Center>
						<List.Root>
							{planBasic.items.map((item, index) => (
								<List.Item
									mt={1}
									as="li"
									key={index}
									_marker={{ color: "white" }}
								>
									{item}
								</List.Item>
							))}
						</List.Root>
					</Flex>
					<Flex
						background={"barber.400"}
						color={"white"}
						w={"100%"}
						borderRadius={8}
						direction="column"
						gap={2}
						py={6}
						px={10}
					>
						<Center>
							<Text fontSize={"2xl"} fontWeight={"bold"} color={"green.500"}>
								{planPremium.header}{" "}
							</Text>
						</Center>
						<List.Root>
							{planPremium.items.map((item, index) => (
								<List.Item
									as="li"
									mt={1}
									key={index}
									_marker={{ color: "orange.900" }}
								>
									{item}
								</List.Item>
							))}
						</List.Root>
						<Center>
							<Text
								fontWeight={"bold"}
								color={"green.500"}
								my={2}
								fontSize={"xl"}
							>
								R$ 29,90 por mês
							</Text>
						</Center>
						{isPremium ? (
							<>
								<Flex
									background={"barber.900"}
									mt={6}
									h={12}
									justifyContent={"center"}
									alignItems={"center"}
									borderRadius={8}
								>
									<Text userSelect={"none"} color={"gray.300"}>
										Você já é premium
									</Text>
								</Flex>
								<Button
									background={"white"}
									_hover={{
										background: "#f4f4f4",
										color: "barber.1000",
										scale: 1.004,
									}}
									color={"barber.400"}
									size={"lg"}
									onClick={handleCustomerPortal}
								>
									Alterar assinatura
								</Button>
							</>
						) : (
							<>
								<Button
									mt={5}
									background={"button.cta"}
									_hover={{
										background: "#fba931ee",
										color: "barber.1000",
										scale: 1.004,
									}}
									color={"barber.400"}
									size={"lg"}
									onClick={handleSubscribe}
								>
									Virar Premium
								</Button>
							</>
						)}
					</Flex>
				</Flex>
			</Flex>
		</Sidebar>
	);
}
