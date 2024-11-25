import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

// Middleware de autenticación
export const auth = async (req, res, next) => {
  const token = req.cookies.token; // Obtén el token de las cookies

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    // Decodifica el token
    const decoded = jwt.verify(token, TOKEN_SECRET);

    // Busca al usuario por ID
    const user = await User.findById(decoded.id);

    // Verifica si el usuario existe
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Asigna el usuario autenticado a `req.user`
    req.user = user;

    console.log("Usuario autenticado:", req.user); // Registro para depuración
    next(); // Continúa con el siguiente middleware
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Middleware para verificar roles
export const verifyRole = (roles) => {
  return (req, res, next) => {
    // Verifica que el usuario autenticado tenga el rol adecuado
    const { perfil } = req.user; // Asume que `req.user` contiene la información del usuario

    // Verifica si el perfil del usuario está incluido en los roles permitidos
    if (!roles.includes(perfil)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta ruta" });
    }

    next(); // Continúa con el siguiente middleware
  };
};
