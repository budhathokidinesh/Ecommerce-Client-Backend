import express from "express";
import {
  createRecomendationController,
  getRecomendationController,
} from "../controllers/recomendationController.js";

const recomendationRouter = express.Router();
recomendationRouter.post("/", createRecomendationController);
recomendationRouter.get("/", getRecomendationController);

export default recomendationRouter;
