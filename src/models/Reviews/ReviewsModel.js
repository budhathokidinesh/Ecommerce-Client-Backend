import reviewCollection from "./ReviewsSchema.js";
export const postReview = async (reviewObj) =>
  await reviewCollection(reviewObj).save();

export const getReviewByProductId = async (obj) => {
  return await reviewCollection.find(obj);
};

export const updateReview = async (filter, update) =>
  await reviewCollection.findByIdAndUpdate(filter, update, { new: true });
