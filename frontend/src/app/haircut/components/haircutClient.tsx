"use client";
import { HaircutProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import {
	Center,
	Flex,
	Heading,
	Switch,
	SwitchCheckedChangeDetails,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import CardHaircut from "./cardHaircut";
import { useState } from "react";
import { setupAPIClient } from "@/services/api";

interface HaircutClientProps {
	haircuts?: HaircutProps[];
}

export default function HaircutClient({ haircuts }: HaircutClientProps) {
	const [statusSwitch, setStatusSwitch] = useState(true);
	const [haircutList, setHaircutList] = useState<HaircutProps[] | undefined>(
		haircuts
	);
	const [isMobile] = useMediaQuery(["(max-width: 700px)"]);
	async function handleHaircuts({ checked }: SwitchCheckedChangeDetails) {
		setStatusSwitch(checked);
		const data = await handleSearchHaircuts(checked);
		if (data) {
			setHaircutList(data);
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
			>
				<Flex
					w={"100%"}
					maxW={700}
					mb={6}
					flexDirection={isMobile ? "column" : "row"}
					alignItems={isMobile ? "flex-start" : "center"}
					justifyContent={isMobile ? "flex-start" : "space-between"}
				>
					<Flex gap={4} flexDirection={isMobile ? "column" : "row"}>
						<Heading fontSize="2xl" fontWeight="bold" color={"orange.900"}>
							Modelos de cortes
						</Heading>
						<Link href="/haircut/new">
							<Flex
								background={"barber.400"}
								px={4}
								py={2}
								borderRadius={8}
								color={"white"}
								_hover={{ scale: 1.01 }}
							>
								<Text>Novo corte</Text>
							</Flex>
						</Link>
					</Flex>
					<Flex
						gap={2}
						color={"white"}
						justifyContent={isMobile ? "flex-end" : "center"}
						alignItems={isMobile ? "flex-end" : "center"}
						mt={isMobile ? "20px" : 0}
						width={isMobile ? "100%" : "auto"}
					>
						<Text>Ativos</Text>
						<Switch.Root
							size={"lg"}
							defaultChecked={true}
							colorScheme={"inherit"}
							colorPalette="green"
							value={statusSwitch ? "true" : "false"}
							onCheckedChange={(e) => handleHaircuts(e)}
						>
							<Switch.HiddenInput />
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label />
						</Switch.Root>
					</Flex>
				</Flex>
				{haircutList &&
					haircutList.length > 0 &&
					haircutList.map((haircut) => (
						<CardHaircut key={haircut.id} haircut={haircut} />
					))}
				{haircutList && haircutList.length === 0 && (
					<Center w={"100%"} maxW={700} mt={10}>
						<Text color={"white"} fontSize={"lg"} fontWeight={"bold"}>
							Nenhum corte encontrado!
						</Text>
					</Center>
				)}
			</Flex>
		</Sidebar>
	);
}

// Criar depois um component de serviço para buscar os cortes na api

async function handleSearchHaircuts(status: boolean) {
	try {
		const apiClient = setupAPIClient();
		const { data } = await apiClient.get<HaircutProps[]>("/haircuts", {
			params: { status: status },
		});
		return data;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}
}
