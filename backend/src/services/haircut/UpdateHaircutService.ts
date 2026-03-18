import prismaClient from "../../prisma";

interface HaircutRequest {
	user_id: string;
	name?: string;
	price?: string | number;
	status?: boolean;
	haircut_id: string;
}

interface HaircutDataIsPro {
	name?: string;
	price?: number;
	status?: boolean;
}

// Refatorar esse serviço depois, deixando ele com 2 metodos, um para usuario que tem assinatura e outro para aqueles que não possuem assinatura.

class UpdateHaircutService {
	async execute({ user_id, haircut_id, name, price, status }: HaircutRequest) {
		if (!haircut_id) {
			throw new Error("INVALID DATA.");
		}
		const user = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
			include: { subscriptions: true },
		});
		if (!user) {
			throw new Error("USER NOT FOUND.");
		}
		const isPro = user?.subscriptions?.status === "active";
		const where = {
			id: haircut_id,
			user_id,
		};
		if (isPro) {
			const data: HaircutDataIsPro = {};
			const priceNumber = Number(price);
			if (priceNumber !== undefined) {
				if (isNaN(priceNumber) || priceNumber <= 0) {
					throw new Error("INVALID PRICE.");
				}
				data.price = priceNumber;
			}
			if (!name?.trim()) {
				data.name = name;
			}
			if (status !== undefined) {
				data.status = status;
			}
			const updateIsPro = await prismaClient.haircut.update({
				where,
				data,
			});
			return updateIsPro;
		}
		const updateNotIsPro = await prismaClient.haircut.update({
			where,
			data: {
				status: status,
			},
		});
		return updateNotIsPro;
	}
}
export { UpdateHaircutService };
