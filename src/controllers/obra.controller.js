import Obra from "../models/db.model.js";
import { crearProyecto } from "../libs/new_proyect_funtion.js";

export const new_proyect = async (req, res) => {
  try {
    const {
      numero_de_etapas,
      numero_de_edificios,
      agregar_nivel,
      agregar_sotano,
      nombre_del_proyecto,
      fecha_de_inicio,
      fecha_de_fin,
      m2_vendibles,
      m2_construccion,
      direccion,
    } = req.body;
    const obra_nueva = crearProyecto(
      numero_de_etapas,
      numero_de_edificios,
      agregar_nivel,
      agregar_sotano,
      nombre_del_proyecto,
      fecha_de_inicio,
      fecha_de_fin,
      m2_vendibles,
      m2_construccion,
      direccion
    );
    const nuevaObra = new Obra(obra_nueva);
    const save = await nuevaObra.save();
    console.log("Nueva obra creada");

    res.status(201).json({
      message: "Nueva obra creada",
      obra: save._id,
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
