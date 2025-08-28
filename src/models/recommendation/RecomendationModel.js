import recomendationCollection from "./RecomendationSchema.js";

export const createRecomendationModel = async (obj) =>
  await recomendationCollection(obj).save();
// export const getRecomendationModel = async (p) =>
//   await recomendationCollection.aggregate(p).exec();
export const checkRecomendationModel = async (obj) =>
  await recomendationCollection.findOne(obj);

export const updatetRecomendationModel = async (filter, update) =>
  await recomendationCollection.findOneAndUpdate(filter, update, { new: true });

export const getRecomendationModel = async (obj) =>
  await recomendationCollection
    .find(obj, { __v: 0, createdAt: 0, _id: 0, updatedAt: 0, interactionId: 0 })
    .lean();
