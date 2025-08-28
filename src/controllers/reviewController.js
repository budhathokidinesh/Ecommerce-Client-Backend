import { responseClient } from "../middleware/responseClient.js";
import { updateProductsRating } from "../models/Product/ProductModel.js";
import {
  getReviewByProductId,
  postReview,
  updateReview,
} from "../models/Reviews/ReviewsModel.js";

export const postReviewController = async (req, res, next) => {
  try {
    const review = await postReview(req.body);
    if (review?._id) {
      // update the product review

      const totalreview = await getReviewByProductId({
        productId: review?.productId,
      });

      if (Array.isArray(totalreview)) {
        const averageRating =
          totalreview.reduce((acc, item) => acc + item.rating, 0) /
          totalreview.length;
        const rating = parseFloat(averageRating.toFixed(1));
        const product = await updateProductsRating(
          { _id: review.productId },
          { reviews: rating }
        );
        if (!product?._id) {
          throw new Error("could not update the product rating");
        }
      }
    }

    review?._id
      ? responseClient({
          req,
          res,
          message: "Thank you,your review has submitted succefully😊 ",
        })
      : responseClient({
          req,
          res,
          statusCode: 400,
          message:
            "something went wrong, review could not be created.Try again later!",
        });
  } catch (error) {
    next(error);
  }
};
export const getProductReviewController = async (req, res, next) => {
  console.log(req.params);
  console.log(req.params.productId);
  try {
    const productReviewList = await getReviewByProductId({
      productId: req.params.productId,
      status: "approved",
    });

    return Array.isArray(productReviewList) && productReviewList.length
      ? responseClient({
          req,
          res,
          message: "here is product review",
          payload: productReviewList,
        })
      : responseClient({
          req,
          res,
          message: "this product has no review",
          payload: [],
        });
  } catch (error) {
    next(error);
  }
};
