"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

//Configuração personalizada do Chakra UI

export const config = defineConfig({
	theme: {
		tokens: {
			colors: {
				barber: {
					1000: { value: "#000" },
					900: { value: "#12131b" },
					700: { value: "#1a1b26" },
					400: { value: "#1b1c29" },
					100: { value: "#c6c6c6" },
				},
				button: {
					cta: { value: "#fba931" },
					default: { value: "#ffffff" },
					gray: { value: "#dfdfdf" },
					danger: { value: "#ff4040" },
				},
				orange: {
					900: { value: "#fba931" },
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
