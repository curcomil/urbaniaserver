import User from "../models/user.model.js"; // Asegúrate de importar el modelo correctamente

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Trae todos los usuarios
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Editar un usuario por ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, foto, correo, cargo } = req.body; // Obtén los campos del body

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { nombre, apellidos, foto, correo, cargo }, // Campos a actualizar
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};

// Eliminar un usuario por ID
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};
