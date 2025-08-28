import {
  checkRecomendationModel,
  createRecomendationModel,
  getRecomendationModel,
  updatetRecomendationModel,
} from "../models/recommendation/RecomendationModel.js";
import { responseClient } from "../middleware/responseClient.js";
import mongoose from "mongoose";
import {
  getProductCategoryByProductId,
  getRecomendedProductBasedOnCategory,
  getRecomendedProductBasedOnMainCategory,
} from "../models/Product/ProductModel.js";
export const createRecomendationController = async (req, res, next) => {
  try {
    // check if same interation is already in db
    const recomendation = await checkRecomendationModel(req.body);

    if (recomendation) {
      //  update recomendation
      await updatetRecomendationModel(req.body, {
        $set: { updatedAt: Date.now() },
      });
      return responseClient({
        message: " updated",
        req,
        res,
      });
    } else {
      // add
      await createRecomendationModel(req.body);
      return responseClient({
        message: " added",
        req,
        res,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get reccomedation controller start here
const INTERACTION_WEIGHTS = {
  view: 0.2,
  cart: 0.5,
  purchase: 1,
  rating: 0.7,
};

const LAMBDA = 0.1;

export const getRecomendationController = async (req, res, next) => {
  console.log(req.params, "params");
  try {
    const { userId, interactionId } = req.query;
    // step 1 get all the interaction based on userId and itneration ID
    const match = userId ? userId : interactionId;
    const interactions = await getRecomendationModel(
      userId ? { userId: match } : { interactionId: match }
    );
    const interactionWithWeightatge =
      interactions.length && Array.isArray(interactions)
        ? interactions.map((interaction) => {
            let weight;
            if (interaction.type == "view") {
              weight = 1;
            } else if (interaction.type == "cart") {
              weight = 2;
            } else if (interaction.type == "purchase") {
              weight = 3;
            }

            return { ...interaction, weight };
          })
        : [];
    // sort the interaction beased on wieth
    if (interactionWithWeightatge.length > 0) {
      const sortedInteractions = interactionWithWeightatge.sort(
        (a, b) => b.weight - a.weight
      );

      const uniqueProductIds = [
        ...new Set(
          sortedInteractions.map(({ productId }) => productId.toString())
        ),
      ].map((idStr) => new mongoose.Types.ObjectId(idStr));

      console.log(uniqueProductIds.length, "productId lenght");
      const productCategory = await getProductCategoryByProductId(
        uniqueProductIds
      );
      const uniqueProductCategory = [
        ...new Set(
          productCategory.map((category) => category.categoryId.toString())
        ),
      ].map((idstr) => new mongoose.Types.ObjectId(idstr));
      console.log(uniqueProductCategory);
      const uniqueProductIdMainCategory = [
        ...new Set(productCategory.map((cat) => cat.mainCategory)),
      ];

      const recomendedProductByCategory =
        await getRecomendedProductBasedOnCategory(
          uniqueProductCategory,
          uniqueProductIds
        );

      const recomendedProductByManiCategory =
        await getRecomendedProductBasedOnMainCategory(
          uniqueProductIdMainCategory,
          uniqueProductIds
        );
      const finalRecomededProducts = [
        ...recomendedProductByCategory,
        ...recomendedProductByManiCategory,
      ];
      const uniqueProducts = [
        ...new Map(
          finalRecomededProducts.map((p) => [p._id.toString(), p])
        ).values(),
      ];
      return responseClient({
        req,
        res,
        payload: uniqueProducts.length > 0 ? uniqueProducts : [],
        message: "",
      });
    } else {
      return responseClient({
        req,
        res,
        payload: [],
        message: "no product interacted yet",
      });
    }
  } catch (error) {
    next(error);
  }
};
