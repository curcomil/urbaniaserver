import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
  editUser,
  getUserProfile,
  getAllUsers,
  deleteuser,
  getUserById,
  toggleLockUser,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middlewares.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { auth, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.put("/update/:id", editUser);
router.post("/logout", logout);
router.get("/profile", getUserProfile);
router.get("/allUsers", getAllUsers);
router.delete("/deleteUser/:id", deleteuser);
router.get("/user/:userId", getUserById);
router.patch(
  "/users/:userId/lock",
  auth,
  verifyRole(["Coordinador"]),
  toggleLockUser
);

export default router;
