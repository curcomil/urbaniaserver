import Obra from "../models/db.model.js";
import { crearProyecto } from "../libs/new_proyect_funtion.js";
import mongoose from "mongoose";
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
    const user = req.user; // Extrae el usuario autenticado del middleware

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    let obras = [];

    // Si el perfil es Director o Coordinador, retorna todas las obras
    if (user.perfil === "Director" || user.perfil === "Coordinador") {
      obras = await Obra.find({});
      return res.json(obras);
    }

    // Si el perfil es Obra o Control, filtra las obras asignadas
    if (user.perfil === "Obra" || user.perfil === "Control") {
      // Validar si `vista_de_obra` es un arreglo válido
      if (
        !user.vista_de_obra ||
        !Array.isArray(user.vista_de_obra) ||
        user.vista_de_obra.length === 0
      ) {
        return res.status(403).json({ message: "No tienes obras asignadas" });
      }

      try {
        // Convertimos los IDs a ObjectId si es necesario
        const obrasAsignadas = user.vista_de_obra.map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        // Buscar las obras asignadas al usuario
        obras = await Obra.find({ _id: { $in: obrasAsignadas } });
      } catch (conversionError) {
        console.error(
          "Error al convertir los IDs de las obras:",
          conversionError
        );
        return res.status(400).json({ message: "IDs de obras no válidos" });
      }

      return res.json(obras);
    }

    // Para perfiles no autorizados
    return res
      .status(403)
      .json({ message: "No tienes permiso para acceder a esta información" });
  } catch (error) {
    console.error("Error al obtener obras:", error);
    return res.status(500).json({ message: "Error al obtener obras" });
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

//Delete partida
export const deletePartida = async (req, res) => {
  try {
    const { id, obra, index } = req.body;

    // Buscar la obra
    const obra_delete = await Obra.findById(obra);
    if (!obra_delete) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Validar el índice de la etapa
    if (!obra_delete.Etapas[index]) {
      return res.status(400).json({ message: "Índice de etapa inválido" });
    }

    // Eliminar la partida usando pull
    const result = await Obra.findOneAndUpdate(
      { _id: obra, "Etapas.Partidas._id": id },
      {
        $pull: {
          [`Etapas.${index}.Partidas`]: { _id: id },
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    console.log("Partida eliminada correctamente");
    return res.status(200).json({
      message: "Partida eliminada correctamente",
      obra: result,
    });
  } catch (error) {
    console.error("Error eliminando la partida:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Delete subpartida
export const deleteSubpartida = async (req, res) => {
  try {
    const { subpartida, partida, obra, index } = req.body;

    // Buscar la obra por ID
    const obra_find = await Obra.findById(obra);
    if (!obra_find) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Validar que el índice de la etapa sea válido
    if (!obra_find.Etapas[index]) {
      return res.status(400).json({ message: "Índice de etapa inválido" });
    }

    // Obtener la etapa correspondiente
    const etapa = obra_find.Etapas[index];

    // Buscar la partida por id dentro de la etapa
    const partida_find = etapa.Partidas.find((p) => p.Nombre === partida);
    if (!partida_find) {
      return res
        .status(404)
        .json({ message: "Partida no encontrada en la etapa especificada" });
    }

    // Buscar y eliminar la subpartida por nombre dentro de la partida
    const subpartida_index = partida_find.Subpartidas.findIndex(
      (s) => s.Nombre === subpartida
    );
    if (subpartida_index === -1) {
      return res.status(404).json({
        message: "Subpartida no encontrada en la partida especificada",
      });
    }

    // Eliminar la subpartida del array
    partida_find.Subpartidas.splice(subpartida_index, 1);

    // Guardar los cambios en la base de datos
    await obra_find.save();

    // Respuesta exitosa
    res.status(200).json({ message: "Subpartida eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la subpartida", error });
  }
};

export const updateSubpartidaFecha = async (req, res) => {
  try {
    const { subpartida, partida, obra, index, fecha, tipo } = req.body;

    console.log("La fecha que llegó es:", fecha);

    // Validar que el tipo sea "Inicio" o "Fin"
    if (!["Inicio", "Fin"].includes(tipo)) {
      return res.status(400).json({
        message: "El tipo debe ser 'Inicio' o 'Fin'",
      });
    }

    // Buscar la obra por ID
    const obra_find = await Obra.findById(obra);
    if (!obra_find) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Validar que el índice de la etapa sea válido
    if (!obra_find.Etapas[index]) {
      return res.status(400).json({ message: "Índice de etapa inválido" });
    }

    // Obtener la etapa correspondiente
    const etapa = obra_find.Etapas[index];

    // Buscar la partida por id dentro de la etapa
    const partida_find = etapa.Partidas.find((p) => p.Nombre === partida);
    if (!partida_find) {
      return res.status(404).json({
        message: "Partida no encontrada en la etapa especificada",
      });
    }

    // Buscar la subpartida por nombre dentro de la partida
    const subpartida_find = partida_find.Subpartidas.find(
      (s) => s.Nombre === subpartida
    );
    if (!subpartida_find) {
      return res.status(404).json({
        message: "Subpartida no encontrada en la partida especificada",
      });
    }

    // Asegurar que exista el campo Fechas.Plan
    if (!subpartida_find.Fechas) {
      subpartida_find.Fechas = {};
    }
    if (!subpartida_find.Fechas.Plan) {
      subpartida_find.Fechas.Plan = {};
    }

    // Actualizar solo el campo específico sin borrar el otro
    subpartida_find.Fechas.Plan[tipo] = fecha;

    // Guardar los cambios en la base de datos
    await obra_find.save();

    // Respuesta exitosa
    res.status(200).json({
      message: `Fecha '${tipo}' actualizada con éxito`,
      subpartida: subpartida_find,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la fecha",
      error: error.message,
    });
  }
};

export const updatePartidaFecha = async (req, res) => {
  try {
    const { partida, obra, index, fecha, tipo } = req.body;

    console.log("La fecha que llegó es:", fecha);

    // Validar que el tipo sea "Inicio" o "Fin"
    if (!["Inicio", "Fin"].includes(tipo)) {
      return res.status(400).json({
        message: "El tipo debe ser 'Inicio' o 'Fin'",
      });
    }

    // Buscar la obra por ID
    const obra_find = await Obra.findById(obra);
    if (!obra_find) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Validar que el índice de la etapa sea válido
    if (!obra_find.Etapas[index]) {
      return res.status(400).json({ message: "Índice de etapa inválido" });
    }

    // Obtener la etapa correspondiente
    const etapa = obra_find.Etapas[index];

    // Buscar la partida por nombre dentro de la etapa
    const partida_find = etapa.Partidas.find((p) => p.Nombre === partida);
    if (!partida_find) {
      return res.status(404).json({
        message: "Partida no encontrada en la etapa especificada",
      });
    }

    // Asegurar que exista el campo Fechas.Plan
    if (!partida_find.Fechas) {
      partida_find.Fechas = {};
    }
    if (!partida_find.Fechas.Plan) {
      partida_find.Fechas.Plan = {};
    }

    // Actualizar solo el campo específico sin borrar el otro
    partida_find.Fechas.Plan[tipo] = fecha;

    // Guardar los cambios en la base de datos
    await obra_find.save();

    // Respuesta exitosa
    res.status(200).json({
      message: `Fecha '${tipo}' actualizada con éxito`,
      partida: partida_find,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar la fecha",
      error: error.message,
    });
  }
};

export const getObrasByUser = async (req, res) => {
  try {
    const { id } = req.user; // El ID del usuario actual
    const user = await User.findById(id).populate("vista_de_obra");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let obras;

    // Si el perfil es "Director" o "Coordinación", devuelve todas las obras
    if (["Director", "Coordinación"].includes(user.perfil)) {
      obras = await Obra.find();
    } else {
      // Para otros roles, devuelve solo las obras asignadas
      obras = user.vista_de_obra;
    }

    return res.json(obras);
  } catch (error) {
    console.error("Error al obtener las obras:", error);
    return res.status(500).json({ message: "Error al obtener las obras" });
  }
};
