import Restaurant from "../models/Restaurant.model.js";

// @route  GET /api/restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/restaurants/:id
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/restaurants  [admin only]
export const createRestaurant = async (req, res) => {
  try {
    const { name, description, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ success: false, message: "Name and address are required" });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/restaurants/:id  [admin only]
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/restaurants/:id  [admin only]
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    res.status(200).json({ success: true, message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};