import Product from "../models/ProductSchema.js";
import Review from "../models/ReviewSchema.js";

export const getProducts = async (req, res) => {
  const products = await Product.find().populate({
    path: "reviews",
    populate: {
      path: "userId",
      select: "username photo",
    },
  });

  res.status(200).json({
    success: true,
    message: "Products fetch successfully",
    products: products,
  });
};

export const likeProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.body.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found." });
  }

  const alreadyLiked = product.likes.includes(userId);

  if (alreadyLiked) {
    return res
      .status(200)
      .json({ success: true, message: "Already liked this product." });
  }

  product.likes.push(userId);
  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product liked successfully.",
    updatedLikes: product.likes,
  });
};

export const getRecentReview = async (req, res) => {
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("userId", "username photo") 
    .lean();

  res.status(200).json({ success: true, reviews });
};
