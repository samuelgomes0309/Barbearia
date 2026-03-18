"use client";

import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItemProps } from "@/@types";

export function NavItem({ children, icon, route }: NavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === route || pathname.startsWith(`${route}/`);
	return (
		<Link href={route} style={{ textDecoration: "none" }}>
			<Flex
				align="center"
				p={4}
				mx={4}
				borderRadius="lg"
				cursor="pointer"
				color={isActive ? "white" : "gray.500"}
				_hover={{
					bg: "barber.900",
					color: "white",
				}}
			>
				{icon && (
					<Box
						as={icon}
						mr={4}
						fontSize={16}
						_groupHover={{ color: "white" }}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
}
