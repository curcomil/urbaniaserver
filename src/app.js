import express, { json } from "express";
import cors from "cors";
const app = express;

app.use(
  cors({
    credentials: true,
    origin: "", // Añade aquí tu localhost
  })
);

app.use("/api");

export default app;
