import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);