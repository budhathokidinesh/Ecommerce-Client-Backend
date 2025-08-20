import express from "express";
import { fetchOrderHistory } from "../controllers/orderController.js";
import { userAuthMiddleware } from "../middleware/authMiddleware.js";
import { sendReceiptEmail } from "../controllers/sendReceiptEmailController.js";

const router = express.Router();
//this is for creating the order
router.get("/history", userAuthMiddleware, fetchOrderHistory);
router.post("/send-receipt-email", userAuthMiddleware, sendReceiptEmail);

export default router;
