import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/products/get-products");
  return res.data;
};

export const productLike = async (productId, userId) => {
  const res = await api.put(`/products/like/${productId}`, { userId });
  return res.data;
};

export const getProductByName = async (name) => {
  const res = await api.get(`/products/get-product/${encodeURIComponent(name)}`);
  return res.data;
};

export const addProductReviewLike = async (productId, reviewId, userId) => {
  const res = await api.put(`/products/review/like`, { productId, reviewId, userId });
  return res.data;
}

export const addNewProductReview = async (productId, userId, message, rating) => {
  const res = await api.put("/products/add-review", { productId, userId, message, rating });
  return res.data;
}

export const editReview = async (reviewId, message, rating) => {
  const res = await api.put(`/products/edit-review/${reviewId}`, {message, rating});
  return res.data;
}

export const deleteReview = async (reviewId, productId) => {
  const res = await api.delete(`/products/delete-review/${reviewId}/${productId}`);
  return res.data;
}