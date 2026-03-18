"use client";
import { AppointmentProps } from "@/@types";
import Sidebar from "@/components/sidebar";
import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import CardAppointment from "./cardAppointment";
import { useState } from "react";
import ModalAppointment from "./modalAppointment";

interface DashboardClientProps {
	appointments: AppointmentProps[];
}

export default function DashboardClient({
	appointments,
}: DashboardClientProps) {
	// const isMobile = useMediaQuery(["(max-width: 700px)"]);
	const [appointmentList, setAppointmentList] =
		useState<AppointmentProps[]>(appointments);
	const [selectedAppointment, setSelectedAppointment] =
		useState<AppointmentProps | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	function handleOpenModal(appointment: AppointmentProps) {
		if (appointment) {
			setSelectedAppointment(appointment);
			setModalVisible(true);
		}
	}
	return (
		<>
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
						flexDirection={"column"}
						alignItems={"flex-start"}
						justifyContent={"flex-start"}
					>
						<Flex gap={4} justifyContent={"center"} alignItems={"center"}>
							<Heading fontSize="2xl" fontWeight="bold" color={"white"}>
								Agenda
							</Heading>
							<Link href="/schedule">
								<Flex
									background={"barber.400"}
									px={4}
									py={2}
									borderRadius={8}
									color={"white"}
									_hover={{ scale: 1.01 }}
								>
									<Text>Registrar</Text>
								</Flex>
							</Link>
						</Flex>
					</Flex>
					{appointmentList.length > 0 &&
						appointmentList?.map((appointment) => (
							<CardAppointment
								key={appointment.id}
								appointment={appointment}
								selected={handleOpenModal}
							/>
						))}
					{appointmentList.length === 0 && (
						<Center w={"100%"} maxW={700} mt={10}>
							<Text color={"white"} fontSize={"lg"} fontWeight={"bold"}>
								Nenhum agendamento em aberto.
							</Text>
						</Center>
					)}
				</Flex>
			</Sidebar>
			{modalVisible && selectedAppointment && (
				<>
					<ModalAppointment
						appointment={selectedAppointment}
						setModalVisible={setModalVisible}
						setList={setAppointmentList}
					/>
				</>
			)}
		</>
	);
}
