import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String },
  apellido: { type: String },
  puesto: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

// Asegúrate de exportar el modelo
const User = mongoose.model("User", userSchema);
export default User;
