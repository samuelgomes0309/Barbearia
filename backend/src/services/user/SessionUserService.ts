import prismaClient from "../../prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import authConfig from "../../config/auth.config";

interface UserRequest {
	email: string;
	password: string;
}

class SessionUserService {
	async execute({ email, password }: UserRequest) {
		if (!email || !password) {
			throw new Error("INVALID EMAIL/PASSWORD.");
		}
		const user = await prismaClient.user.findUnique({
			where: {
				email: email,
			},
			include: {
				subscriptions: true,
			},
		});
		if (!user) {
			throw new Error("INVALID EMAIL/PASSWORD.");
		}
		const passwordMatch = await bcrypt.compare(password, user?.password);
		if (!passwordMatch) {
			throw new Error("INVALID EMAIL/PASSWORD.");
		}
		const options: SignOptions = {
			subject: user?.id,
			expiresIn: authConfig.jwt.expiresIn,
		};
		const token = jwt.sign(
			{
				email: user?.email,
				name: user?.name,
			},
			authConfig.jwt.secret,
			options
		);
		return {
			id: user?.id,
			name: user?.name,
			email: user?.email,
			address: user?.address,
			token: token,
			subscriptions: user.subscriptions
				? {
						id: user.subscriptions.id,
						status: user.subscriptions.status,
					}
				: null,
		};
	}
}

export { SessionUserService };
