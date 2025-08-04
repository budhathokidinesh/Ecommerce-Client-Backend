import express from "express";
import {
  activateUser,
  forgotPassword,
  getUser,
  insertNewUser,
  loginUser,
  logoutUser,
  resetPassword,
} from "../controllers/authController.js";
import {
  loginDataValidation,
  newUserDataValidation,
  userActivationDataValidation,
} from "../middleware/validations/authDataValidation.js";
import {
  userAuthMiddleware,
  renewAccessJWTMiddleware,
} from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", newUserDataValidation, insertNewUser);
router.patch("/activate-user", userActivationDataValidation, activateUser);
router.post("/login", loginDataValidation, loginUser);
router.get("/user-info", userAuthMiddleware, getUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", userAuthMiddleware, logoutUser);
router.get("/renew", renewAccessJWTMiddleware);

export default router;
