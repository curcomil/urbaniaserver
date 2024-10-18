import express from "express";
import {
  createObra,
  getAllObras,
  getObraById,
} from "../controllers/obra.controller.js";

const router = express.Router();

// Ruta para crear una nueva obra
router.post("/newObras", createObra);

// Ruta para obtener todas las obras
router.get("/allObras", getAllObras);

// Ruta para obtener una obra por ID
router.get("/obras/:id", getObraById);

export default router;
