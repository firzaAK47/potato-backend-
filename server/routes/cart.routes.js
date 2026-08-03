import express from "express";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:foodId", protect, updateCartItem);
router.delete("/:foodId", protect, removeFromCart);

export default router;