import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      isActive(path) ? "text-orange-600" : "text-gray-600 hover:text-orange-600"
    }`;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-orange-600">
          Potato 🍟
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/cart" className={linkClass("/cart")}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          <Link to="/orders" className={linkClass("/orders")}>
            Orders
          </Link>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;