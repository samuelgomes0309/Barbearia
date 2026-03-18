import express, { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { SessionUserController } from "./controllers/user/SessionUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { CreateHaircutController } from "./controllers/haircut/CreateHaircutController";
import { ListHaircutsController } from "./controllers/haircut/ListHaircutsController";
import { UpdateHaircutController } from "./controllers/haircut/UpdateHaircutController";
import { DeleteHaircutController } from "./controllers/haircut/DeleteHaircutController";
import { CheckSubscriptionController } from "./controllers/haircut/CheckSubscriptionController";
import { CountHaircutController } from "./controllers/haircut/CountHaircutController";
import { DetailHaircutController } from "./controllers/haircut/DetailHaircutController";
import { CreateScheduleController } from "./controllers/schedule/CreateScheduleController";
import { ListScheduleController } from "./controllers/schedule/ListScheduleController";
import { FinishScheduleController } from "./controllers/schedule/FinishScheduleController";
import { SubscribeController } from "./controllers/subscription/SubscribeController";
import { CreatePortalController } from "./controllers/subscription/CreatePortalController";
import { WebHooksController } from "./controllers/subscription/WebHooksController";

const router = Router();

// Routes users
router.post("/users", new CreateUserController().handle);
router.post("/sessions", new SessionUserController().handle);
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.put("/users", isAuthenticated, new UpdateUserController().handle);

// Routes haircuts
router.post("/haircuts", isAuthenticated, new CreateHaircutController().handle);
router.get("/haircuts", isAuthenticated, new ListHaircutsController().handle);
router.put("/haircuts", isAuthenticated, new UpdateHaircutController().handle);
router.delete(
	"/haircuts/:haircut_id",
	isAuthenticated,
	new DeleteHaircutController().handle
);
router.get(
	"/haircuts/check",
	isAuthenticated,
	new CheckSubscriptionController().handle
);
router.get(
	"/haircuts/count",
	isAuthenticated,
	new CountHaircutController().handle
);
router.get(
	"/haircuts/:haircut_id",
	isAuthenticated,
	new DetailHaircutController().handle
);

// Routes Schedules
router.post(
	"/schedules",
	isAuthenticated,
	new CreateScheduleController().handle
);
router.get("/schedules", isAuthenticated, new ListScheduleController().handle);
router.delete(
	"/schedules/:schedule_id",
	isAuthenticated,
	new FinishScheduleController().handle
);

// Rotas de assinatura
router.post("/subscribes", isAuthenticated, new SubscribeController().handle);
router.post(
	"/create-portal",
	isAuthenticated,
	new CreatePortalController().handle
);
router.post(
	"/webhooks",
	express.raw({ type: "application/json" }),
	new WebHooksController().handle
);
export { router };
