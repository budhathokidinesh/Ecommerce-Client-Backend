// import Product from "../models/Product/ProductSchema.js";
import Order from "../models/Order/OrderSchema.js";

//this order for users
export const fetchOrderHistory = async (req, res) => {
  try {
    const { _id: userId, isGuest, guestId } = req.userInfo;
    const query = isGuest
      ? { isGuest: true, "guestInfo.guestId": guestId }
      : { buyer: userId };

    const orders = await Order.find(query)
      .populate("items.productId", "title thumbnail price")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured while fetching order history",
    });
  }
};
