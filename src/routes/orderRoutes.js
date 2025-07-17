import express from "express";
import { orderController } from "../controllers/orderController.js";

const router = express.Router();
//this is for creating the order
router.post("/placeOrder", orderController);

export default router;
