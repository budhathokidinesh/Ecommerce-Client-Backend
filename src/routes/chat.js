import express from "express";
import { OpenAI } from "openai";
import Order from "../models/Order/OrderSchema.js";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.VITE_GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// System prompt
const SYSTEM_PROMPT = {
  role: "system",
  content: `You are an AI expert representing FitAura which is an E-Commerce platform. Answer politely. Always ask if the user needs further help. Give answers about products, orders, and this platform. Do not give information about other users. The platform is made by five founders: Dinesh, Mahesh, Shekhar, Kovid, and Satish. If someone asks to talk to customer support, tell them that customer support is busy and will call back when available.
  
  Website Link: http://dinesh-frontend-bucket.s3-website-ap-southeast-2.amazonaws.com/

Examples:
Q: Do you have free shipping?
A: Yes, we offer free shipping on orders above $50 within Australia.

Q: How long does delivery take?
A: Delivery usually takes 3–5 business days for standard shipping and 1–2 days for express.

Q: Can I track my order?
A: Absolutely! Once your order is shipped, you'll receive a tracking link via email or visit our tracking page.

Q: What payment methods do you accept?
A: We accept Visa, MasterCard, PayPal, Apple Pay, and Google Pay.

Q: Do you have discounts for first-time buyers?
A: Yes! First-time buyers can get 10% off by using the code WELCOME10 at checkout.

Q: What is your return policy?
A: We accept returns within 30 days of purchase, provided the items are unused and in original packaging.

Q: Can I change my delivery address after ordering?
A: Yes, as long as your order hasn’t been shipped yet. Please contact our support team as soon as possible.

Q: Do you sell gift cards?
A: Yes! We offer digital gift cards in amounts of $25, $50, and $100.

Q: How do I know if a product is in stock?
A: On the product page, you’ll see the stock status. If it’s out of stock, you can sign up for an email notification.

Q: Do you offer bulk discounts?
A: Yes! We offer discounts for large orders. Please reach out to our sales team for a custom quote.

Q: Do you have products information and other questions about our platform?
A: visit http://dinesh-frontend-bucket.s3-website-ap-southeast-2.amazonaws.com/ and search there and give information about website


`,
};

router.post("/chat", async (req, res) => {
  const { messages, userId } = req.body;

  try {
    // Fetch all orders for the user
    const orders = await Order.find({ buyer: userId })
      .populate("items.productId", "title price thumbnail")
      .sort({ createdAt: -1 });

    let userOrdersText = "You currently have no orders.";
    if (orders.length > 0) {
      userOrdersText = orders
        .map((order, i) => {
          const itemsText = order.items
            .map(
              (item, idx) =>
                `${idx + 1}. ${item.productId.title} - Quantity: ${
                  item.quantity
                }, Price: $${item.productId.price}`
            )
            .join("\n");

          return `Order ${i + 1}:
- Placed on: ${order.createdAt.toDateString()}
- Status: ${order.orderStatus}
- Items:
${itemsText}
- Total amount: $${order.totalAmount}
- Shipping address: ${order.shippingAddresses}`;
        })
        .join("\n\n");
    }

    // Combine system prompt + user order info in a single system message
    const FINAL_SYSTEM_PROMPT = {
      role: "system",
      content:
        SYSTEM_PROMPT.content +
        "\n\nUse the following information about the user to answer their questions:\n" +
        userOrdersText +
        "\nAlways be polite, helpful, and only mention this user's orders.",
    };

    const allMessages = [FINAL_SYSTEM_PROMPT, ...messages];

    const response = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: allMessages,
    });

    res.json({ message: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

export default router;
