// controllers/order/sendReceiptEmailController.js
import Order from "../models/Order/OrderSchema.js";
import User from "../models/User/UserSchema.js";
import { emailTransporter } from "../services/email/transport.js";

export const sendReceiptEmail = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId)
      .populate("items.productId", "title price thumbnail")
      .populate("buyer", "email fName");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const userEmail = order.buyer?.email || order.guestInfo?.email;
    const userName = order.buyer?.fName || order.guestInfo?.fName;

    if (!userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User email not found" });
    }

    // Generate a simple HTML receipt
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #2c3e50;">Thank you for your order, ${userName}!</h2>
    <p style="color: #555;">We appreciate you. Here's a summary of your purchase:</p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 16px;"><strong>Order ID:</strong> ${order._id}</p>
    <p style="font-size: 16px;"><strong>Order Date:</strong> ${new Date(
      order.createdAt
    ).toLocaleDateString()}</p>

    <h3 style="margin-top: 30px; color: #2c3e50;">Order Summary</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr style="background-color: #ececec;">
          <th align="left" style="padding: 10px; border-bottom: 1px solid #ddd;">Product</th>
          <th align="center" style="padding: 10px; border-bottom: 1px solid #ddd;">Qty</th>
          <th align="right" style="padding: 10px; border-bottom: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${
              item.productId.title
            }</td>
            <td align="center" style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${
              item.quantity
            }</td>
            <td align="right" style="padding: 10px; border-bottom: 1px solid #f0f0f0;">$${item.price.toFixed(
              2
            )}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <h4 style="text-align: right; margin-top: 20px; color: #2c3e50;">
      Total: $${order.totalAmount.toFixed(2)}
    </h4>

    <p style="margin-top: 40px; font-size: 14px; color: #999;">
      If you have any questions or need support, feel free to reply to this email.
    </p>
    <p style="font-size: 14px; color: #999;">– The GroupProject Store Team</p>
  </div>
`;

    const transport = emailTransporter();
    const info = await transport.sendMail({
      from: '"Group Project" <physmarika@gmail.com>',
      to: userEmail,
      subject: "Your Order Receipt",
      html,
    });

    return res.status(200).json({
      success: true,
      message: "Receipt email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending receipt email:", error);
    res.status(500).json({ success: false, message: "Error sending receipt" });
  }
};
