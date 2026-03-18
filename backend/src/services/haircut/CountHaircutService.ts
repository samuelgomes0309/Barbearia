import prismaClient from "../../prisma";

interface HaircutRequest {
	user_id: string;
}

class CountHaircutService {
	async execute({ user_id }: HaircutRequest) {
		// Buscar os ativos e inativos de uma vez só, se fizer o findmany e depois o filter, vai fazer duas consultas ao banco e isso é ineficiente, codigo do filter está mais abaixo
		// const haircuts = await prismaClient.haircut.findMany({
		// 	where: { user_id: user_id },
		// });
		// const Actives = {
		// 	count: haircuts.filter((haircuts) => haircuts.status === true).length,
		// };
		// const Inactives = {
		// 	count: haircuts.filter((haircuts) => haircuts.status === false).length,
		// };
		const [actives, inactives] = await Promise.all([
			prismaClient.haircut.count({
				where: { user_id: user_id, status: true },
			}),
			prismaClient.haircut.count({
				where: { user_id: user_id, status: false },
			}),
		]);
		return { Actives: { count: actives }, Inactives: { count: inactives } };
	}
}

export { CountHaircutService };
