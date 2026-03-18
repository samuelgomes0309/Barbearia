import prismaClient from "../../prisma";
import bcrypt from "bcrypt";

interface UserRequest {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	async execute({ email, name, password }: UserRequest) {
		if (!email || !name || !password) {
			throw new Error("DATA NOT FILLED IN.");
		}
		const userAlreadyExists = await prismaClient.user.findUnique({
			where: {
				email: email,
			},
		});
		if (userAlreadyExists) {
			throw new Error("USER/EMAIL ALREADY EXISTS.");
		}
		const passwordHash = await bcrypt.hash(password, 8);
		const user = await prismaClient.user.create({
			data: {
				name,
				email,
				password: passwordHash,
			},
			select: {
				id: true,
				name: true,
				email: true,
				address: true,
			},
		});
		return user;
	}
}

export { CreateUserService };
