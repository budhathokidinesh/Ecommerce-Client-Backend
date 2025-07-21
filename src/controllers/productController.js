import { responseClient } from "../middleware/responseClient.js";
import {
  getAllProducts,
  getAllProductsByPath,
  getProductById,
  getProductsByCategoryId,
} from "../models/Product/ProductModel.js";
// import { createRegexFilter } from "../utils/createRegexFilter.js";

//
export const getProductsByCategoryIdController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (categoryId) {
      // call model
      const products = await getProductsByCategoryId({ categoryId });
      if (Array.isArray(products)) {
        return responseClient({
          message: "here is the list of products based on selected category",
          res,
          payload: products,
          req,
        });
      }
    } else {
      return responseClient({
        message: "invalid id",
        res,
        statusCode: 400,
        req,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (_id) {
      // call model
      const product = await getProductById({ _id });
      if (product?._id) {
        return responseClient({
          message: "here is the product",
          res,
          req,
          payload: product,
        });
      } else {
        return responseClient({
          message: "no product found",
          res,
          req,
          statusCode: 400,
        });
      }
    } else {
      return responseClient({
        message: "you must send id",
        res,
        statusCode: 400,
        req,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllProductsController = async (req, res, next) => {
  try {
    // call model

    const producstList = await getAllProducts();
    if (producstList?.length && Array.isArray(producstList)) {
      return responseClient({
        message: "here is the product list",
        res,
        req,
        payload: producstList,
      });
    } else {
      return responseClient({
        message: "there is no product sorry!😂",
        res,
        statusCode: 400,
        req,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const getAllFilterProductsController = async (req, res, next) => {
  try {
    const { productPath, maxPrice, minPrice, colors, sale, brand } = req.query;

    const filter = {};

    // This is for productPath filtering
    if (productPath) {
      const path = productPath?.startsWith("/")
        ? productPath
        : `/${productPath}`;
      filter.productPath = {
        $regex: new RegExp(`^${path}`),
        $options: "i",
      };
    }

    // THis is for price range filtering
    if (minPrice !== undefined && maxPrice !== undefined) {
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    // This is for colors filtering
    if (colors) {
      const colorArray = Array.isArray(colors)
        ? colors
        : colors.includes(",")
        ? colors.split(",")
        : [colors];
      filter.colors = { $in: colorArray };
    }

    // This is for brand filtering
    if (brand) {
      const brandArray = Array.isArray(brand)
        ? brand
        : brand.includes(",")
        ? brand.split(",")
        : [brand];
      filter.brand = { $in: brandArray };
    }

    // This is for sale filtering based on discountPrice
    if (sale === "true") {
      filter.discountPrice = { $exists: true, $ne: null };
    }

    const products = await getAllProductsByPath(filter);
    console.log("FILTERED PRODUCTS:", products?.length);

    if (products?.length > 0) {
      return responseClient({
        message: "Filtered products",
        res,
        req,
        payload: products,
      });
    } else {
      return responseClient({
        message: "No products found",
        res,
        req,
        payload: [],
      });
    }
  } catch (error) {
    next(error);
  }
};
