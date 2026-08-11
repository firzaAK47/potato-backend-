import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRestaurantById } from "../services/restaurantService";
import { getFoodsByRestaurant } from "../services/foodService";
import { useCart } from "../hooks/useCart";
import Navbar from "../components/Navbar";

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        const foodData = await getFoodsByRestaurant(id);
        setRestaurant(restaurantData.restaurant);
        setFoods(foodData.foods);
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async (foodId) => {
    setAddingId(foodId);
    try {
      await addItem(foodId, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="bg-white shadow-sm p-4">
        <Link to="/" className="text-orange-600 text-sm font-medium">
          ← Back to Restaurants
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
          <p className="text-gray-500">{restaurant?.address}</p>
          <p className="text-sm text-gray-400 mt-2">{restaurant?.description}</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>

        {foods.length === 0 ? (
          <p className="text-gray-500">No food items available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{food.name}</h3>
                  <p className="text-sm text-gray-500">{food.description}</p>
                  <p className="text-orange-600 font-semibold mt-1">₹{food.price}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(food._id)}
                  disabled={addingId === food._id}
                  className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-700 transition disabled:opacity-50"
                >
                  {addingId === food._id ? "Adding..." : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;