import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellidos: {
      type: String,
      required: true,
      trim: true,
    },
    foto: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "El correo no es válido"],
    },
    cargo: {
      type: String,
      required: true,
      enum: ["Administrador", "Gerente", "Empleado", "Otro"],
      default: "Empleado",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
