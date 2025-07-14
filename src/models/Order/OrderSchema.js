import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      method: { type: String, default: "Card" },
      transitionId: {
        type: String,
      },
      status: {
        type: String,
        default: "Paid",
      },
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      required: false,
    },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    orderStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Dispatched",
        "On The Way",
        "Delivered",
      ],
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
