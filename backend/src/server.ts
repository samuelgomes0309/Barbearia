import "dotenv/config";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import "colors";
import cors from "cors";
import { WebHooksController } from "./controllers/subscription/WebHooksController";

const app = express();

app.use((req, res, next) => {
	if (req.originalUrl === "/webhooks") {
		next();
	} else {
		express.json()(req, res, next);
	}
});

app.use(cors());

app.use(router);

const PORT = process.env.PORT ?? 3333;
const date = new Date().toLocaleDateString("pt-br");

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof Error) {
		return res.status(400).json({
			error: error.message,
		});
	}
	return res.status(500).json({
		status: "error",
		message: "Internal server error.",
	});
});

app.listen(PORT, () => {
	console.log(
		`[${[date]}]`.yellow +
			" -- ".magenta +
			"Servidor online na porta ".green +
			`${[PORT]}`.blue +
			".".green
	);
});
