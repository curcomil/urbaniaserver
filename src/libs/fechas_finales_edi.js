import Obra from "../models/db.model.js";

export const fechas_finales_edi = async (req, res) => {
  try {
    const { obra_id } = req.body;
    const obra = await Obra.findById(obra_id);

    if (!obra) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Recorremos las etapas y sus partidas
    obra.Edificios.forEach((etapa) => {
      etapa.Partidas.forEach((partida) => {
        // Verificamos si la partida tiene subpartidas
        if (partida.Subpartidas?.length > 0) {
          // Obtenemos fechas mínima y máxima usando map y Math.min/max
          const fechaMenor = new Date(
            Math.min(
              ...partida.Subpartidas.map((item) =>
                new Date(item.Fechas.Plan.Inicio).getTime()
              )
            )
          );

          const fechaMayor = new Date(
            Math.max(
              ...partida.Subpartidas.map((item) =>
                new Date(item.Fechas.Plan.Fin).getTime()
              )
            )
          );

          // Actualizamos las fechas de la partida
          partida.Fechas.Plan.Inicio = fechaMenor;
          partida.Fechas.Plan.Fin = fechaMayor;
        }
      });
    });

    await obra.save();

    res.status(200).json({ message: "Fechas actualizadas correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar las fechas", error });
  }
};
