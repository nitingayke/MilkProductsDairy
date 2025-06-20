import Product from "../models/ProductSchema.js";

export const addNewProduct = async (req, res) => {
  const updatedProductData = JSON.parse(req?.body?.productDetails);

  const photoUrl = req.file?.url || req.file?.path;

  if (!updatedProductData || !photoUrl) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const existingProduct = await Product.findOne({
    name: updatedProductData.name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  });

  if (existingProduct) {
    return res.status(409).json({
      success: false,
      message: "Product with this name already exists.",
    });
  }

  const newProduct = new Product({
    ...updatedProductData,
    name: updatedProductData.name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()), // optional normalization
    image: [photoUrl],
  });

  await newProduct.save();

  res.status(200).json({
    success: true,
    message: "New Product Created Successfully",
    product: newProduct,
  });
};

export const updateProduct = async (req, res) => {
  const updatedProductData = JSON.parse(req?.body?.updatedProductData);

  const photoUrl = req.file?.url || req.file?.path;

  if (!updatedProductData) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const productId = updatedProductData?._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  if (updatedProductData?.name && updatedProductData?.name !== product?.name) {
    const nameExists = await Product.findOne({
      name: updatedProductData?.name,
    });
    if (nameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Product name already exists" });
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updatedProductData },
    { new: true }
  );

  if (!updatedProduct) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
};

export const removeProduct = async (req, res) => {
  let { _id } = req.body;

  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "Product id missing" });
  }

  await Product.findByIdAndDelete(_id);
  console.log("Product removed successfully ")

  res
    .status(200)
    .json({ success: true, message: "Product removed successfully" });
};
