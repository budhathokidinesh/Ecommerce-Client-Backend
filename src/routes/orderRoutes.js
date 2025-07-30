import express from "express";
import { fetchOrderHistory } from "../controllers/orderController.js";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
//this is for creating the order
router.get("/history", userAuthMiddleware, fetchOrderHistory);

export default router;
