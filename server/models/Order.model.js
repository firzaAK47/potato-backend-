import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // price at order time
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);