"use client";
import { HaircutProps } from "@/@types";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { IoIosPricetag } from "react-icons/io";

interface CardHaircutProps {
	haircut: HaircutProps;
}

export default function CardHaircut({ haircut }: CardHaircutProps) {
	return (
		<Flex
			background={"barber.400"}
			w={"100%"}
			p={6}
			gap={4}
			direction={"column"}
			borderRadius={8}
			color={"white"}
			maxW={700}
			mb={4}
		>
			<Link href={`/haircut/${haircut.id}`}>
				<Flex alignItems={"center"} justifyContent={"space-between"} w={"100%"}>
					<Flex alignItems={"center"} gap={2} justifyContent={"center"}>
						<Box as={IoIosPricetag} fontSize={25} color={"orange.900"} />
						<Text fontSize={"xl"} fontWeight={"bold"}>
							{haircut.name}
						</Text>
					</Flex>
					<Text> R$ {haircut.price.toFixed(2)}</Text>
				</Flex>
			</Link>
		</Flex>
	);
}
