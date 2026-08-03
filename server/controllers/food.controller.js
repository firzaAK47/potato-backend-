import Food from "../models/Food.model.js";

// @route  GET /api/foods?restaurant=<id>
export const getFoods = async (req, res) => {
  try {
    const filter = {};
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.category) filter.category = req.query.category;

    const foods = await Food.find(filter)
      .populate("restaurant", "name")
      .populate("category", "name");

    res.status(200).json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/foods/:id
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("restaurant", "name")
      .populate("category", "name");

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/foods  [admin only]
export const createFood = async (req, res) => {
  try {
    const { name, description, price, restaurant, category } = req.body;

    if (!name || !price || !restaurant || !category) {
      return res.status(400).json({
        success: false,
        message: "name, price, restaurant, and category are required",
      });
    }

    const food = await Food.create({ name, description, price, restaurant, category });
    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/foods/:id  [admin only]
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/foods/:id  [admin only]
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }
    res.status(200).json({ success: true, message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};