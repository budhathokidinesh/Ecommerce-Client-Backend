import express from "express";
import {
  getProductsByCategoryIdController,
  getProductByIdController,
  getAllProductsController,
  getAllFilterProductsController,
  getSingleProductsController,
} from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.get("/category/:categoryId", getProductsByCategoryIdController);
productRouter.get("/Id/:_id", getProductByIdController);
productRouter.get("/", getAllProductsController);
productRouter.get("/filterProduct", getAllFilterProductsController);
productRouter.get("/bySlug/:slug", getSingleProductsController);

export default productRouter;
