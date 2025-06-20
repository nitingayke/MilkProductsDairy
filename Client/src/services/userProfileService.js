import api from "./api"; 

export const getSavedAddresses = async (userId) => {
  const res = await api.post("/user-profile/get-addresses", { userId });
  return res.data;
};

export const getUserOrders = async (userId) => {
  const res = await api.post("/user/get-orders", {userId})
  return res?.data;
}

export const getWishlistedProducts = async (userId) => {
  const res = await api.post("/user/get-wishlisted", {userId});
  return res?.data
}
