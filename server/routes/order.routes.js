import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/all", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;