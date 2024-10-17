import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String },
  apellido: { type: String },
  perfil: { type: String },
  vista_de_obra: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

// Asegúrate de exportar el modelo
const User = mongoose.model("User", userSchema);
export default User;
