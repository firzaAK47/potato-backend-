import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../services/restaurantService";
import Navbar from "../components/Navbar";

function Home() {
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
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Restaurants Near You</h2>
        <p className="text-sm text-gray-500 mb-6">Order food from your favourite places</p>

        {loading ? (
          <p className="text-gray-500">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-gray-500">No restaurants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                <div className="w-full h-40 overflow-hidden">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                  {restaurant.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {restaurant.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;