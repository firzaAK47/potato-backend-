import { createContext, useState, useEffect } from "react";
import { getCart, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeFromCart as removeFromCartAPI } from "../services/cartService";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const addItem = async (foodId, quantity = 1) => {
    const data = await addToCartAPI(foodId, quantity);
    setCart(data.cart);
  };

  const updateItem = async (foodId, quantity) => {
    const data = await updateCartItemAPI(foodId, quantity);
    setCart(data.cart);
  };

  const removeItem = async (foodId) => {
    const data = await removeFromCartAPI(foodId);
    setCart(data.cart);
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateItem, removeItem, cartCount, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};