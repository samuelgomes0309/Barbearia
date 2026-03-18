"use client";

import { Center, Flex, IconButton, Text } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { MobielNavProps } from "@/@types";

export function MobileNav({ onopen, ...rest }: MobielNavProps) {
	return (
		<Flex
			px={4}
			height={20}
			alignItems="center"
			bg="barber.400"
			borderBottomWidth="1px"
			borderBottomColor="gray.500"
			justifyContent="flex-start"
			{...rest}
		>
			<IconButton
				variant="outline"
				onClick={onopen}
				aria-label="Abrir menu"
				color="white"
			>
				<FiMenu />
			</IconButton>
			<Center w="full">
				<Flex userSelect="none">
					<Text
						fontSize="2xl"
						fontFamily="monospace"
						fontWeight="bold"
						color="white"
					>
						Barber
					</Text>
					<Text
						fontSize="2xl"
						fontFamily="monospace"
						fontWeight="bold"
						color="button.cta"
					>
						PRO
					</Text>
				</Flex>
			</Center>
		</Flex>
	);
}
