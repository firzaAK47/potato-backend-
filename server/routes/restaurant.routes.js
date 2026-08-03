import express from "express";
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, adminOnly, createRestaurant);
router.put("/:id", protect, adminOnly, updateRestaurant);
router.delete("/:id", protect, adminOnly, deleteRestaurant);

export default router;