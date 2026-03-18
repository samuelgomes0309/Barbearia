"use client";

import { Box, useDisclosure } from "@chakra-ui/react";
import { SidebarContent } from "./sidebarContent";
import { SidebarDrawer } from "./sidebarDrawer";
import { MobileNav } from "./mobileNav";

export default function Sidebar({ children }: { children: React.ReactNode }) {
	const { open, onOpen, onClose } = useDisclosure();
	return (
		<Box minHeight="100vh" bg="barber.900">
			{/* Desktop */}
			<SidebarContent
				onclose={onClose}
				display={{ base: "none", md: "block" }}
			/>
			{/* Mobile */}
			<SidebarDrawer open={open} onOpen={onOpen} onClose={onClose} />
			<MobileNav onopen={onOpen} display={{ base: "flex", md: "none" }} />
			<Box ml={{ base: 0, md: 60 }} p={4}>
				{children}
			</Box>
		</Box>
	);
}
