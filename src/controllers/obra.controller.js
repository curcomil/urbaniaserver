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

export const getMayoresRetrasos = async (req, res) => {
  const { obraId } = req.params;

  try {
    const obra = await Obra.findById(obraId);
    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    const extractPartidasInfo = (obra) => {
      const partidas = [];

      obra.Etapas.forEach((etapa) => {
        etapa.Partidas.forEach((partida) => {
          const fechaPlanFin = partida.Fechas?.Plan?.Fin
            ? new Date(partida.Fechas.Plan.Fin)
            : null;
          const fechaEjecucionFin = partida.Fechas?.Ejecucion?.Fin
            ? new Date(partida.Fechas.Ejecucion.Fin)
            : null;

          let diferenciaDias = null;
          if (fechaPlanFin && fechaEjecucionFin) {
            diferenciaDias =
              (fechaEjecucionFin - fechaPlanFin) / (1000 * 60 * 60 * 24); // Diferencia en días
          }

          partidas.push({
            Nombre: partida.Nombre || "Sin nombre",
            Etapa: etapa.Nombre || "Sin etapa",
            Fechas: {
              Plan: partida.Fechas?.Plan || { Inicio: null, Fin: null },
              Ejecucion: partida.Fechas?.Ejecucion || {
                Inicio: null,
                Fin: null,
              },
            },
            DiferenciaDias: diferenciaDias,
          });
        });
      });

      // Filtrar solo partidas con diferencia calculada y ordenar por mayor retraso
      return partidas
        .filter((p) => p.DiferenciaDias !== null)
        .sort((a, b) => b.DiferenciaDias - a.DiferenciaDias)
        .slice(0, 3);
    };

    const mayoresRetrasos = extractPartidasInfo(obra);
    res.json(mayoresRetrasos);
  } catch (error) {
    console.error("Error al calcular los mayores retrasos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
