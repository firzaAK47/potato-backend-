import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;