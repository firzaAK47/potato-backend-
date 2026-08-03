import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import foodRoutes from "./routes/food.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT ||  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));