// import api from "./api";

// export const getFoodsByRestaurant = async (restaurantId) => {
//   const response = await api.get(`/foods?restaurant=${restaurantId}`);
//   return response.data;
// };

import api from "./api";

export const getFoodsByRestaurant = async (restaurantId) => {
  const response = await api.get(`/foods?restaurant=${restaurantId}`);
  return response.data;
};

export const createFood = async (formData) => {
  const response = await api.post("/foods", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await api.delete(`/foods/${id}`);
  return response.data;
};