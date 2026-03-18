// =====================
// USER / USUÁRIO
// =====================
export interface UserProps {
	id: string;
	name: string;
	email: string;
	address: string | null;
	subscriptions?: SubscriptionProps | null;
}

export interface UpdateUserProps {
	name: string;
	address: string;
}

// =====================
// AUTH / LOGIN
// =====================
export interface SignInProps {
	email: string;
	password: string;
}

export interface SignUpProps {
	name: string;
	email: string;
	password: string;
}

// =====================
// SUBSCRIPTION / ASSINATURA
// =====================
export interface SubscriptionProps {
	id: string;
	status: string;
}

// =====================
// SIDEBAR / NAVEGAÇÃO
// =====================
import { BoxProps, FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

export interface SidebarItemProps {
	name: string;
	icon: IconType;
	route: string;
}

export interface SidebarProps extends BoxProps {
	onclose: () => void;
}

export interface NavItemProps {
	icon: IconType;
	children: string;
	route: string;
}

export interface MobielNavProps extends FlexProps {
	onopen: () => void;
}

// =====================
// HAIRCUT / CORTES
// =====================
export interface HaircutProps {
	id: string;
	name: string;
	price: number;
	status: boolean;
	user_id: string;
}

export interface NewHaircutProps {
	name: string;
	price: number;
}

export interface UpdateHaircutProps {
	haircut_id: string;
	name: string;
	price: number;
	status: boolean;
}

export interface HaircutCountProps {
	Actives: { count: number };
	Inactive: { count: number };
}

// =====================
// APPOINTMENT / AGENDA
// =====================
export interface AppointmentProps {
	id: string;
	customer: string;
	haircut: HaircutProps;
}

export interface NewAppointmentProps {
	customer: string;
	haircut_id: string;
}
