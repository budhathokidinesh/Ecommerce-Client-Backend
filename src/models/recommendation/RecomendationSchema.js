import mongoose from "mongoose";

const RecomendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    interactionId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: { type: String, enum: ["view", "purchase", "cart", "rating"] },
  },
  { timestamps: true }
);
const recomendationCollection = new mongoose.model(
  "Recomendation",
  RecomendationSchema
);

export default recomendationCollection;
