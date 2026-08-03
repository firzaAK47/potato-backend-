import Order from "../models/Order.model.js";
import Cart from "../models/Cart.model.js";

// @route  POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: "Delivery address is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      quantity: item.quantity,
      price: item.food.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
    });

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.food", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.food", "name image");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/orders  [admin only]
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/orders/:id/status  [admin only]
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};