import express from "express";
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", getUsers); // Ruta para obtener todos los usuarios
router.get("/users/:id", getUserById); // Ruta para obtener un usuario por ID
router.put("/users/:id", updateUserById); // Ruta para actualizar un usuario por ID
router.delete("/users/:id", deleteUserById); // Ruta para eliminar un usuario por ID

export default router;
