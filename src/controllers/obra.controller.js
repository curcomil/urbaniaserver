import Obra from "../models/obra.model.js"; // Asegúrate de que la ruta al modelo sea correcta

// Crear una nueva obra
export const createObra = async (req, res) => {
  try {
    const {
      nombre_del_proyecto,
      m2_construccion,
      m2_vendibles,
      direccion,
      numero_de_etapas,
      numero_de_edificios,
      numero_de_niveles,
      fecha_de_inicio,
      fecha_de_fin,
    } = req.body;

    // Crear nueva obra
    const nuevaObra = new Obra({
      nombre_del_proyecto,
      m2_construccion,
      m2_vendibles,
      direccion,
      numero_de_etapas,
      numero_de_edificios,
      numero_de_niveles,
      fecha_de_inicio,
      fecha_de_fin,
    });

    // Guardar la obra en la base de datos
    const obraGuardada = await nuevaObra.save();
    res.status(201).json(obraGuardada);
  } catch (error) {
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
