import express from "express";
import {
  getAllObras,
  getObraById,
  new_proyect,
  getObrasByUser,
} from "../controllers/obra.controller.js";
import { auth, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta para obtener todas las obras (protegida, solo para Director y Coordinación)
router.get(
  "/allObras",
  auth,
  verifyRole(["Director", "Coordinador", "Control", "Obra"]),
  getAllObras
);

// Ruta para obtener una obra por ID (protegida, accesible para todos los perfiles autenticados)
router.get("/obras/:id", auth, getObraById);

// Ruta para crear una nueva obra (protegida, solo para Director y Coordinación)
router.post("/nueva", auth, new_proyect);

// Ruta para obtener las obras asignadas al usuario (protegida)
router.get("/mis-obras", auth, getObrasByUser);

export default router;
