import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: false,
    },
    reviewTitle: { type: String, required: false },
    productFitting: { type: String, required: false },
    productComforatability: { type: String, required: false },
  },

  { timestamps: true }
);

const reviewCollection = mongoose.model("Review", reviewSchema);
export default reviewCollection;
