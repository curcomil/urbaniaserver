import express from "express";
import {
  getAllObras,
  getObraById,
  new_proyect,
} from "../controllers/obra.controller.js";

const router = express.Router();

// Ruta para obtener todas las obras
router.get("/allObras", getAllObras);

// Ruta para obtener una obra por ID
router.get("/obras/:id", getObraById);

// Ruta para crear una nueva obra
router.post("/nueva", new_proyect);

export default router;
