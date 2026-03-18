"use client";

import { Drawer } from "@chakra-ui/react";
import { SidebarContent } from "./sidebarContent";

interface SidebarDrawerProps {
	open: boolean;
	onClose: () => void;
	onOpen: () => void;
}

export function SidebarDrawer({ open, onClose, onOpen }: SidebarDrawerProps) {
	return (
		<Drawer.Root
			placement="start"
			open={open}
			skipAnimationOnMount={true}
			onOpenChange={(e) => (e.open ? onOpen() : onClose())}
		>
			<Drawer.Content animation={"none"}>
				<SidebarContent onclose={onClose} />
			</Drawer.Content>
		</Drawer.Root>
	);
}
