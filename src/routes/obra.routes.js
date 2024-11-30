import express from "express";
import {
  getAllObras,
  getObraById,
  new_proyect,
  deletePartida,
  deleteSubpartida,
  updateSubpartidaFecha,
  updatePartidaFecha,
} from "../controllers/obra.controller.js";

const router = express.Router();

// Ruta para obtener todas las obras
router.get("/allObras", getAllObras);

// Ruta para obtener una obra por ID
router.get("/obras/:id", getObraById);

// Ruta para crear una nueva obra
router.post("/nueva", new_proyect);

//Ruta para eliminar una partida
router.delete("/deletePartida", deletePartida);

//Ruta para eliminar una subpartida
router.delete("/deleteSubpartida", deleteSubpartida);

//Ruta para fechas de una subpartida
router.post("/fechaSubpartida", updateSubpartidaFecha);

//Ruta para fechas de una partida
router.post("/fechaPartida", updatePartidaFecha);

export default router;
