import mongoose from "mongoose";

const obraSchema = new mongoose.Schema({
  nombre_del_proyecto: { type: String, required: true, unique: true },
  m2_construccion: { type: Number, required: true },
  m2_vendibles: { type: Number, required: true },
  direccion: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    colonia: { type: String, required: true },
    codigo_postal: { type: String, required: true },
    delegacion_municipio: { type: String, required: true },
    estado: { type: String, required: true },
  },
  numero_de_etapas: { type: Number, required: true },
  numero_de_edificios: { type: Number, required: true },
  numero_de_niveles: { type: Number, required: true },
  fecha_de_inicio: { type: Date, required: true },
  fecha_de_fin: { type: Date, required: true },
});

const Obra = mongoose.model("Obra", obraSchema);
export default Obra;
