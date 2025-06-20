import api from "./api";

export const placeNewOrder = async (orderData) => {
  const res = await api.post(`/order/new-order`, orderData);
  return res.data;
};

export const getUserOrders = async (userId) => {
  const res = await api.post("/order/get-user-orders", { userId });
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.post("/order/get-all-orders");
  return res.data;
};

export const confirmUerOrder = async (orderId, status) => {
  const res = await api.put("/order/confirm-order", { orderId, status });
  return res.data;
}

export const rejectUserOrder = async (orderId) => {
   const res = await api.put("/order/reject-order", { orderId });
  return res.data;
}













export const totalOrdercount = (orders) => {
  return orders.length;
};

export const totalReturnedOrders = (orders) => {
  console.log(orders);
};

export const totaldraftedOrders = (orders) => {
  console.log(orders)
};

export const totalActiveOrders = (orders) => {
  console.log(orders);
};

export const totalCanceledOrders = (orders) => {
  console.log(orders);
};