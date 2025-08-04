import reviewCollection from "./ReviewsSchema.js";
export const postReview = async (reviewObj) =>
  await reviewCollection(reviewObj).save();

export const getReviewById = async (productId) =>
  await reviewCollection.find(productId);
export const updateReview = async (filter, update) =>
  await reviewCollection.findByIdAndUpdate(filter, update, { new: true });
