import Product from "../models/Product/ProductSchema.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//this is for placing the order
export const orderController = async (req, res) => {
  const { cart, paymentMethod, guestId, guestInfo } = req.body;
  const userId = req.user?.id;
  if (!cart || cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart can not be empty",
    });
  }
  if (!userId && !guestId) {
    return res.status(401).json({
      success: false,
      message: "unauthorized user or guest ID required",
    });
  }
  try {
    const stripeLineItems = [];
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Food item not found: ${item.productId}`,
        });
      }
      stripeLineItems.push({
        price_data: {
          currency: "aud",
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: userId ? userId.toString() : "",
        guestId: guestId || "",
        guestInfo: guestInfo ? JSON.stringify(guestInfo) : "",
        cart: JSON.stringify(cart),
      },
    });
    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: "Stripe session created",
    });
  } catch (error) {
    console.log("Order error: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Order processing failed",
    });
  }
};
