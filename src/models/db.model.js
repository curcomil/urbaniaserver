import mongoose from "mongoose";

const dbSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Sotanos: { type: Number, required: true },
  Niveles: { type: Number, required: true },
  Edificios: { type: Number, required: true },
  Fechas: {
    Plan: {
      Inicio: { type: Date, required: true },
      Fin: { type: Date, required: true },
    },
    Ejecucion: {
      Inicio: { type: Date },
      Fin: { type: Date },
    },
  },
  Etapas: [
    {
      Partidas: [
        {
          Nombre: { type: String },
          Subpartidas: { type: Array, default: [] },
          Fechas: {
            Plan: {
              Inicio: { type: Date },
              Fin: { type: Date },
            },
            Ejecucion: {
              Inicio: { type: Date },
              Fin: { type: Date },
            },
          },
        },
      ],
      Edificios: [
        {
          Nombre: { type: String },
          Partidas: [
            {
              Nombre: { type: String },
              Subpartidas: { type: Array, default: [] },
              Fechas: {
                Plan: {
                  Inicio: { type: Date },
                  Fin: { type: Date },
                },
                Ejecucion: {
                  Inicio: { type: Date },
                  Fin: { type: Date },
                },
              },
            },
          ],
          Fechas: {
            Plan: {
              Inicio: { type: Date },
              Fin: { type: Date },
            },
            Ejecucion: {
              Inicio: { type: Date },
              Fin: { type: Date },
            },
          },
        },
      ],
    },
  ],
});

const Obra = mongoose.model("Obra", dbSchema);
export default Obra;
