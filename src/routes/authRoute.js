import express from "express";
import {
  activateUser,
  forgotPassword,
  getUser,
  insertNewUser,
  loginUser,
  logoutUser,
  resetPassword,
  getWishlistProducts,
  toggleWishlistController,
  addAddressController,
  changePasswordController,
  deleteAddressController,
  deleteUserController,
  editAddressController,
  updateUserController,
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
router.put("/user-info", userAuthMiddleware, updateUserController);
router.delete("/user-info", userAuthMiddleware, deleteUserController);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", userAuthMiddleware, logoutUser);
router.post("/wishlist", userAuthMiddleware, toggleWishlistController);
router.get("/wishlist", userAuthMiddleware, getWishlistProducts);
router.put("/change-password", userAuthMiddleware, changePasswordController);
router.post("/user-info/address", userAuthMiddleware, addAddressController);
router.put("/user-info/address", userAuthMiddleware, editAddressController);
router.delete(
  "/user-info/address/:addressId",
  userAuthMiddleware,
  deleteAddressController
);

router.get("/renew", renewAccessJWTMiddleware);

export default router;
