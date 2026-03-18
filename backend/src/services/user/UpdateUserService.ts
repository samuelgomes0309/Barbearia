import { Prisma } from "../../generated/prisma";
import prismaClient from "../../prisma";

interface UserRequest {
	user_id: string;
	address?: string;
	name?: string;
}

class UpdateUserService {
	async execute({ address, user_id, name }: UserRequest) {
		if (!address && !name) {
			throw new Error("NO DATA PROVIDED FOR UPDATE.");
		}
		try {
			const user = await prismaClient.user.update({
				where: {
					id: user_id,
				},
				data: {
					...(address && { address }),
					...(name && { name }),
				},
				select: {
					id: true,
					name: true,
					email: true,
					address: true,
				},
			});
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2025") {
					throw new Error("USER NOT FOUND.");
				}
			}
			throw new Error("ERROR UPDATING USER.");
		}
	}
}

export { UpdateUserService };
