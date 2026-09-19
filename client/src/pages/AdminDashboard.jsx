import { useState, useEffect } from "react";
import {
  createRestaurant,
  getRestaurants,
  deleteRestaurant,
} from "../services/restaurantService";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { createFood, deleteFood } from "../services/foodService";
import { getCategories } from "../services/categoryService";

function AdminDashboard() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
const [foodName, setFoodName] = useState("");
const [foodDesc, setFoodDesc] = useState("");
const [foodPrice, setFoodPrice] = useState("");
const [foodRestaurant, setFoodRestaurant] = useState("");
const [foodCategory, setFoodCategory] = useState("");
const [foodImage, setFoodImage] = useState(null);
const [foodLoading, setFoodLoading] = useState(false);
const [foodMessage, setFoodMessage] = useState("");

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data.restaurants);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  const fetchCategories = async () => {
  try {
    const data = await getCategories();
    setCategories(data.categories);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await deleteRestaurant(id);
      fetchRestaurants();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-md mx-auto p-6 mt-10 text-center">
          <p className="text-gray-500">You don't have access to this page.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("address", address);
      if (image) formData.append("image", image);

      await createRestaurant(formData);

      setMessage("Restaurant added successfully!");
      fetchRestaurants();
      setName("");
      setDescription("");
      setAddress("");
      setImage(null);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add restaurant.");
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSubmit = async (e) => {
  e.preventDefault();
  setFoodMessage("");
  setFoodLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", foodName);
    formData.append("description", foodDesc);
    formData.append("price", foodPrice);
    formData.append("restaurant", foodRestaurant);
    formData.append("category", foodCategory);
    if (foodImage) formData.append("image", foodImage);

    await createFood(formData);

    setFoodMessage("Food item added successfully!");
    setFoodName("");
    setFoodDesc("");
    setFoodPrice("");
    setFoodImage(null);
    e.target.reset();
  } catch (err) {
    setFoodMessage(err.response?.data?.message || "Failed to add food item.");
  } finally {
    setFoodLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Add New Restaurant
          </h2>

          {message && (
            <div className="bg-green-100 text-green-700 text-sm p-3 rounded-lg mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Spice Junction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Short description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. MG Road, Ernakulam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Restaurant"}
            </button>
          </form>
        </div>

        {/* Restaurant List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Manage Restaurants</h2>
          <div className="space-y-2">
            {restaurants.map((r) => (
              <div key={r._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.address}</p>
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
                {/* Add Food Item */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Add Food Item</h2>

          {foodMessage && (
            <div className="bg-blue-100 text-blue-700 text-sm p-3 rounded-lg mb-4">
              {foodMessage}
            </div>
          )}

          <form onSubmit={handleFoodSubmit} className="space-y-4">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              placeholder="Food name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              value={foodDesc}
              onChange={(e) => setFoodDesc(e.target.value)}
              rows={2}
              placeholder="Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="number"
              value={foodPrice}
              onChange={(e) => setFoodPrice(e.target.value)}
              required
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={foodRestaurant}
              onChange={(e) => setFoodRestaurant(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Restaurant</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>

            <select
              value={foodCategory}
              onChange={(e) => setFoodCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoodImage(e.target.files[0])}
              className="w-full text-sm text-gray-600"
            />

            <button
              type="submit"
              disabled={foodLoading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
            >
              {foodLoading ? "Adding..." : "Add Food Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;