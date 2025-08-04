import express from "express";

import {
  getProductReviewController,
  postReviewController,
} from "../controllers/reviewController.js";
export const reviewRouter = express.Router();
reviewRouter.post("/postReview", postReviewController);
reviewRouter.get("/getProductReview/:productId", getProductReviewController);

export default reviewRouter;
