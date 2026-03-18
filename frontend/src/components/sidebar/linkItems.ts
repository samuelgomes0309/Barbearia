import { FiClipboard, FiScissors, FiSettings } from "react-icons/fi";
import { SidebarItemProps } from "@/@types";

export const linkItems: SidebarItemProps[] = [
	{ name: "Agenda", icon: FiScissors, route: "/dashboard" },
	{ name: "Cortes", icon: FiClipboard, route: "/haircut" },
	{ name: "Minha conta", icon: FiSettings, route: "/profile" },
];
