import api from "./api"

export const placeNewOrder = async (orderData) => {
  const res = await api.post(`/order/add`, orderData);
  return res.data;
};

export const getUserOrders = async (userId) => {
  // console.log(userId)
  const res = await api.post("/order/get-orders", { userId });
  return res.data;
}