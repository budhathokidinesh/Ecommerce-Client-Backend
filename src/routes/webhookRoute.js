import express from "express";
import { stripeWebhookHandler } from "../controllers/stripeWebhookController.js";

const router = express.Router();
router.post(
  "/",
  express.raw({
    type: "application/json",
  }),
  stripeWebhookHandler
);

export default router;
