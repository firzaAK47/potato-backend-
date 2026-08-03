import Cart from "../models/Cart.model.js";

// @route  GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.food");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId) {
      return res.status(400).json({ success: false, message: "foodId is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.food.toString() === foodId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ food: foodId, quantity: quantity || 1 });
    }

    await cart.save();
    await cart.populate("items.food");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/cart/:foodId
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { foodId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Valid quantity is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.food.toString() === foodId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.food");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/cart/:foodId
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);
    await cart.save();
    await cart.populate("items.food");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};