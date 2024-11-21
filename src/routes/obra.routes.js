import express from "express";
import {
  getAllObras,
  getObraById,
  new_proyect,
  getObrasByUser,
} from "../controllers/obra.controller.js";
import { verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta para obtener todas las obras
router.get("/allObras", getAllObras);

// Ruta para obtener una obra por ID
router.get("/obras/:id", getObraById);

// Ruta para crear una nueva obra
router.post("/nueva", new_proyect);

router.get("/obras", verifyRole(["Director", "Coordinación"]), getObrasByUser);

export default router;
