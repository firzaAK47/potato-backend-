import api from "./api";

export const placeOrder = async (deliveryAddress) => {
  const response = await api.post("/orders", { deliveryAddress });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my");
  return response.data;
};