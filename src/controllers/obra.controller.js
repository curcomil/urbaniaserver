import Obra from "../models/db.model.js";
import { crearProyecto } from "../libs/new_proyect_funtion.js";

export const new_proyect = async (req, res) => {
  try {
    const { etapas, edificios, niveles, sotanos, nombre } = req.body;
    const obra_nueva = crearProyecto(
      etapas,
      edificios,
      niveles,
      sotanos,
      nombre
    );
    const nuevaObra = new Obra(obra_nueva);
    const save = await nuevaObra.save();
    res.status(201).json({
      message: "Nueva obra creada",
      obra: save,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la obra", error });
  }
};

// Obtener todas las obras
export const getAllObras = async (req, res) => {
  try {
    const obras = await Obra.find();
    res.status(200).json(obras);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las obras", error });
  }
};

// Obtener una obra por ID
export const getObraById = async (req, res) => {
  try {
    const { id } = req.params;
    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }
    res.status(200).json(obra);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la obra", error });
  }
};
