import { StringValue } from "ms";
import "dotenv/config";

if (!process.env.JWT_SECRET_KEY) {
	throw new Error("JWT_SECRET_KEY NOT FOUND IN .ENV FILE.");
}

export default {
	jwt: {
		secret: process.env.JWT_SECRET_KEY!,
		expiresIn: "30d" as StringValue,
	},
};
