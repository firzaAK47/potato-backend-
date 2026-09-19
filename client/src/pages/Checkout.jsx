import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { placeOrder } from "../services/orderService";
import Navbar from "../components/Navbar";

function Checkout() {
  const { cart, fetchCart } = useCart();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [stage, setStage] = useState("form"); // form | paying | success
  const navigate = useNavigate();

  const items = (cart.items || []).filter((item) => item.food);
  const total = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Please enter a delivery address");
      return;
    }

    setStage("paying");

    try {
      // Simulate payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 2200));

      await placeOrder(address);
      await fetchCart();

      setStage("success");
      setTimeout(() => navigate("/orders"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setStage("form");
    }
  };

  if (items.length === 0 && stage === "form") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-md mx-auto p-6 mt-10">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- PAYING SCREEN -----
  if (stage === "paying") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white text-lg font-medium">Processing your payment...</p>
          <p className="text-gray-400 text-sm mt-2">₹{total} • Please don't close this window</p>
        </div>
      </div>
    );
  }

  // ----- SUCCESS SCREEN -----
  if (stage === "success") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center animate-[fadeIn_0.4s_ease-out]">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.4s_ease-out]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Payment Successful!</h2>
          <p className="text-gray-400 text-sm">₹{total} paid • Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  // ----- FORM SCREEN -----
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-white shadow-sm p-4">
        <Link to="/cart" className="text-orange-600 text-sm font-medium">
          ← Back to Cart
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

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

          <div className="border border-gray-200 rounded-lg p-3 mb-4 flex items-center gap-3 bg-gray-50">
            <div className="w-9 h-9 bg-indigo-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
              💳
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Pay via Card / UPI</p>
              <p className="text-xs text-gray-400">Secure checkout</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Pay ₹{total}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;