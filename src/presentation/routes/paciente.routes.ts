import { Router } from "express";
import { PacienteController } from "../controllers/PacienteController";

const pacienteRoutes = Router();
const controller = new PacienteController();

pacienteRoutes.post("/", controller.create.bind(controller));
pacienteRoutes.get("/", controller.list.bind(controller));
pacienteRoutes.put("/:id", controller.update.bind(controller));

export { pacienteRoutes };
