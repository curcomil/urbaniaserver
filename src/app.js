import express, { json } from "express";
import cors from "cors";

const app = express(); // Aquí invocas la función

app.use(
  cors({
    credentials: true,
    origin: "", // Añade aquí tu localhost o el dominio permitido
  })
);

app.use("/api", json()); // Asegúrate de usar json middleware para manejar JSON en las peticiones

export default app;
