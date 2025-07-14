import Order from "../models/Order/OrderSchema.js";
import Product from "../models/Product/ProductSchema.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signiture"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("webhook signiture verified is failed: ", error.message);
    return res.status(400).send(`Webhook Error: `);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const cart = JSON.parse(session.metadata.cart || "[]");
    const userId = session.metadata.userId || null;
    const guestId = session.metadata.guestId || null;
    const guestInfo = JSON.parse(session.metadata.guestInfo || "{}");
    try {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart) {
        const product = await Product.findById(item.productId);
        if (!product) {
          console.warn(`FOod item not found: ${item.foodId}`);
          continue;
        }
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product: product.id,
          quantity: item.quantity,
          price: food.price,
        });
      }
      await Order.create({
        items: orderItems,
        totalAmount,
        payment: {
          method: "Stripe",
          status: "Paid",
          transitionId: session.payment_intent,
        },
        buyer: userId || null,
        guestId: guestId || null,
        guestInfo: guestInfo || null,
        status: "Order Placed",
      });
      console.log("Order created successfully ");
      return res.status(200).json({ received: true });
    } catch (error) {
      console.log("Error saving order:", error);
      return res.status(500).send("Failed to process order");
    }
  }
  res.status(200).json({ received: true });
};
