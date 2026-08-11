import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import Navbar from "../components/Navbar";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar/>
      <div className="bg-white shadow-sm p-4">
        <Link to="/" className="text-orange-600 text-sm font-medium">
          ← Back to Restaurants
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {item.food?.name || "Item"} × {item.quantity}
                  </p>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;