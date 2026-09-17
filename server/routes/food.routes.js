import express from "express";
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/", protect, adminOnly, upload.single("image"), createFood);
router.put("/:id", protect, adminOnly, upload.single("image"), updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;