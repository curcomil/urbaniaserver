import mongoose from "mongoose";

const SubpartidaSchema = new mongoose.Schema({
  Nombre: { type: String },
  Etapa: { type: Number },
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
});

const dbSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Datos: {
    M2_Construccion: { type: Number },
    M2_Vendibles: { type: Number },
    Direccion: {},
  },
  Sotanos: { type: Number, required: true },
  Niveles: { type: Number, required: true },
  Edificios: [
    {
      Nombre: { type: String },
      Partidas: [
        {
          Nombre: { type: String },
          Subpartidas: {
            type: [SubpartidaSchema],
            default: [],
          },
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
      Etapa: { type: Number, default: 0 },
    },
  ],
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
          Subpartidas: {
            type: [SubpartidaSchema],
            default: [],
          },
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
