import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useState } from "react";
import Navbar from "../components/Navbar";

function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const items = cart.items || [];

  const total = items.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const handleUpdateQuantity = async (foodId, quantity) => {
    if (quantity < 1) return;
    setUpdatingId(foodId);
    try {
      await updateItem(foodId, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (foodId) => {
    setUpdatingId(foodId);
    try {
      await removeItem(foodId);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="bg-white shadow-sm p-4">
        <Link to="/" className="text-orange-600 text-sm font-medium">
          ← Back to Restaurants
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart 🛒</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.food._id}
                  className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.food.name}</h3>
                    <p className="text-orange-600 font-medium">₹{item.food.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.food._id, item.quantity - 1)}
                        disabled={updatingId === item.food._id}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.food._id, item.quantity + 1)}
                        disabled={updatingId === item.food._id}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.food._id)}
                      disabled={updatingId === item.food._id}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="bg-white rounded-xl shadow-sm p-4 mt-6 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Total: ₹{total}
              </span>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;