import { Box, CloseButton, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { linkItems } from "./linkItems";
import { NavItem } from "./navItem";
import { SidebarProps } from "@/@types";

export function SidebarContent({ onclose, ...rest }: SidebarProps) {
	return (
		<Box
			background={"barber.400"}
			width={{ base: "full", md: 60 }}
			position="fixed"
			height="full"
			py={4}
			{...rest}
		>
			<Flex
				height={20}
				alignItems="center"
				justifyContent="space-between"
				px={4}
			>
				<Link href="/dashboard">
					<Text fontSize="2xl" fontWeight="bold" color="white">
						Barber
						<Text as="span" color="button.cta">
							PRO
						</Text>
					</Text>
				</Link>
				<CloseButton
					display={{ base: "flex", md: "none" }}
					onClick={onclose}
					color="white"
				/>
			</Flex>
			{linkItems.map((item) => (
				<NavItem key={item.name} {...item}>
					{item.name}
				</NavItem>
			))}
		</Box>
	);
}
