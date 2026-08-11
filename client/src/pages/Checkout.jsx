import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { placeOrder } from "../services/orderService";

function Checkout() {
  const { cart, fetchCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const items = cart.items || [];
  const total = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    setLoading(true);
    try {
      await placeOrder(address);
      await fetchCart(); // refresh cart (it will be empty now)
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-4">
        <Link to="/cart" className="text-orange-600 text-sm font-medium">
          ← Back to Cart
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
          {items.map((item) => (
            <div key={item.food._id} className="flex justify-between text-sm text-gray-600 py-1">
              <span>{item.food.name} × {item.quantity}</span>
              <span>₹{item.food.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Delivery Address Form */}
        <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Delivery Address</h2>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            placeholder="Enter your full delivery address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? "Placing order..." : `Place Order — ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;