import express from "express";
import { json } from "express";
import { pacienteRoutes } from "./presentation/routes/paciente.routes";
import "reflect-metadata";
import "./shared/container";

const app = express();

app.use(json());
app.use("/pacientes", pacienteRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({ message: err.errors });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

export { app };
