"use client";
import { AppointmentProps } from "@/@types";
import { setupAPIClient } from "@/services/api";
import { Box, Button, CloseButton, Flex, Portal, Text } from "@chakra-ui/react";
import { FcMoneyTransfer } from "react-icons/fc";
import { IoMdPerson } from "react-icons/io";
import { RxScissors } from "react-icons/rx";

interface ModalAppointmentProps {
	appointment: AppointmentProps;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setList: React.Dispatch<React.SetStateAction<AppointmentProps[]>>;
}

export default function ModalAppointment({
	appointment,
	setModalVisible,
	setList,
}: ModalAppointmentProps) {
	function handleCloseModal(e: React.MouseEvent) {
		e.stopPropagation();
		setModalVisible(false);
	}
	const appointmentItem = [
		{
			icon: IoMdPerson,
			label: appointment.customer,
			color: "orange.900",
		},
		{
			icon: RxScissors,
			label: appointment.haircut.name,
			color: "white",
		},
		{
			icon: FcMoneyTransfer,
			label: `R$ ${appointment.haircut.price.toFixed(2)}`,
			color: "green.500",
		},
	];
	async function handleFinishSchedule() {
		if (!appointment.id) return;
		const response = await handleFinishAppointment(appointment.id);
		if (response) {
			setList((oldList) =>
				oldList.filter((item) => item.id !== appointment.id)
			);
			setModalVisible(false);
			return;
		}
	}
	return (
		<Portal>
			<Flex
				bg="blackAlpha.500"
				position={"fixed"}
				top={0}
				left={0}
				w="100vw"
				h="100vh"
				zIndex={1000}
				justifyContent="center"
				alignItems="center"
				onClick={handleCloseModal}
			>
				<Flex
					onClick={(e) => e.stopPropagation()}
					p={6}
					bg={"barber.400"}
					color={"white"}
					borderRadius={8}
					w={"100%"}
					maxW={500}
					flexDirection={"column"}
					gap={4}
				>
					<Flex mb={2} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize={"2xl"} fontWeight={"semibold"}>
							Próximo
						</Text>
						<CloseButton
							onClick={handleCloseModal}
							color={"#fff"}
							_hover={{
								color: "barber.900",
							}}
						/>
					</Flex>
					{appointmentItem.map((item, index) => (
						<Flex key={index} alignItems={"center"}>
							<Box as={item.icon} fontSize={30} color={item.color} mr={4} />
							<Text fontSize={"xl"} key={index}>
								{item.label}
							</Text>
						</Flex>
					))}
					<Flex
						w={"100%"}
						alignItems={"center"}
						justifyContent={"flex-end"}
						mt={10}
					>
						<Button
							background="button.cta"
							color="barber.400"
							size="lg"
							w={"50%"}
							_hover={{
								background: "#fba931ee",
								color: "barber.1000",
								scale: 1.004,
							}}
							onClick={handleFinishSchedule}
						>
							Finalizar serviço
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Portal>
	);
}

async function handleFinishAppointment(id: string) {
	if (!id) return;
	try {
		const apiClient = setupAPIClient();
		await apiClient.delete(`/schedule/${id}`);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
