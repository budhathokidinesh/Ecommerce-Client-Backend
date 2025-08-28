import productCollection from "./ProductSchema.js";

export const getProductsByCategoryId = async (filter) =>
  await productCollection.find(filter);

export const getProductById = async (filter) => {
  return await productCollection.findById(filter);
};

export const getProductBySlug = async (filter) => {
  return await productCollection.findOne(filter);
};

export const getAllProducts = async () => await productCollection.find();

export const getAllProductsByPath = async (filter) => {
  return await productCollection.find(filter);
};
export const updateProductsRating = async (filter, update) => {
  return await productCollection.findByIdAndUpdate(filter, update, {
    new: true,
  });
};
export const getAllRecommendedProduct = async () => {
  return await productCollection
    .find({})
    .sort({ updatedAt: -1 }) // newest first
    .limit(5)
    .exec();
};
export const getProductCategoryByProductId = async (productId) => {
  return productCollection
    .find({ _id: { $in: productId } })
    .select("categoryId mainCategory -_id");
};

export const getRecomendedProductBasedOnCategory = async (
  categoryIds,
  excludedProductIds
) => {
  return productCollection.find({
    categoryId: { $in: categoryIds }, // match categoryId
    _id: { $nin: excludedProductIds }, // exclude these product IDs
  });
};
export const getRecomendedProductBasedOnMainCategory = async (
  mainCategories,
  excludedProductIds
) => {
  return productCollection.find({
    mainCategory: { $in: mainCategories }, // match categoryId
    _id: { $nin: excludedProductIds }, // exclude these product IDs
  });
};
