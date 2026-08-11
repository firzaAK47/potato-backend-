import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRestaurants } from "../services/restaurantService";
import Navbar from "../components/Navbar";
function Home() {
  const { user, logout } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.restaurants);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Potato 🍟</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <Link to="/cart" className="text-sm text-orange-600 font-medium">
            Cart 🛒
          </Link>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div> */}
      <Navbar/>

      {/* Restaurant List */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Restaurants Near You
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-gray-500">No restaurants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-500">{restaurant.address}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
