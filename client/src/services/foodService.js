import api from "./api";

export const getFoodsByRestaurant = async (restaurantId) => {
  const response = await api.get(`/foods?restaurant=${restaurantId}`);
  return response.data;
};