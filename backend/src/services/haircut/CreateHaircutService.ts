import prismaClient from "../../prisma";

interface HaircutRequest {
	name: string;
	price: number | string;
	user_id: string;
}

class CreateHaircutService {
	async execute({ name, price, user_id }: HaircutRequest) {
		if (!name) {
			throw new Error("INVALID NAME/PRICE.");
		}
		const priceNumber = Number(price);
		if (!price || isNaN(priceNumber) || priceNumber <= 0) {
			throw new Error("INVALID NAME/PRICE.");
		}
		const user = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
			include: { subscriptions: true },
		});
		const isPro = user?.subscriptions?.status === "active";
		const haircutCount = await prismaClient.haircut.count({
			where: {
				user_id: user_id,
			},
		});
		if (!isPro && haircutCount >= 3) {
			throw new Error(
				"FREE PLAN LIMIT REACHED. UPGRADE TO PRO TO CREATE MORE HAIRCUTS."
			);
		}
		const haircut = await prismaClient.haircut.create({
			data: {
				name: name,
				price: priceNumber,
				user_id: user_id,
			},
		});
		return haircut;
	}
}

export { CreateHaircutService };
