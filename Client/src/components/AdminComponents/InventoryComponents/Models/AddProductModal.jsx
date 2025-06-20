// import React, { useState } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { addNewProduct } from "../../../../services/productServices";
import { Image, Tag, DollarSign, Archive, Package, AlertCircle, Scale3D, FlaskConical } from "lucide-react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ScienceIcon from '@mui/icons-material/Science';
import DescriptionIcon from '@mui/icons-material/Description';
import NutritionInput from "../NutritionalInfo";

const categories = [
  "Milk",
  "Curd (Dahi)",
  "Paneer",
  "Butter",
  "Ghee (Clarified Butter)",
  "Cheese",
  "Cream",
  "Buttermilk (Chaas)",
  "Lassi",
  "Flavored Milk",
  "Milk Powder",
  "Condensed Milk",
  "Khoa / Mawa",
  "Yogurt",
  "Ice Cream",
  "Shrikhand",
  "Whey Protein",
  "Dairy-Based Sweets (e.g., Rasgulla, Gulab Jamun, Kalakand)",
];

const quantityUnits = ["Litre", "Ml", "Kg", "Gram", "Pack"];


export default function AddProductModal({ setAddModel }) {

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    shelfLife: 0,
    quantityUnit: "",
    stock: 0,
    thresholdVal: 0,
    price: 0,
    nutrition: {},
    discount: 0
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProductDetails((prev) => ({
        ...prev,
        image: URL.createObjectURL(file)
      }
      ));
    }
  };

  const validateInputs = () => {
    const { name, category, price, stock, quantityUnit, thresholdVal, shelfLife, nutrition, discount, description } = productDetails;
    if (!name || !category || !price || !stock || !quantityUnit || !thresholdVal || !selectedFile || !shelfLife || !nutrition || !discount || !description) {
      toast.error("Please fill all fields and select an image.");
      return false;
    }
    if (isNaN(price) || isNaN(stock) || isNaN(thresholdVal) || isNaN(discount) || isNaN(shelfLife) ) {
      toast.error("Price, Stock, Discount, Shelflife and Threshold should be numbers.");
      return false;
    }
    return true;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setIsAdding(true)
      e.preventDefault()

      const productData = new FormData();

      productData.append("image", selectedFile)
      productData.append("productDetails", JSON.stringify(productDetails))

      const res = await addNewProduct(productData);

      if (res?.success) {
        toast.success("Product Added successfully");
      } else {
        toast.error(res.message);
      }

    } catch (error) {
      console.log(error)
      toast.error("Product already exist. Add other product")
    } finally {
      setAddModel(false)
      setIsAdding(false)
    }
  }


  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 flex flex-col items-center  overflow-auto">
      <div className="bg-white dark:bg-gray-500/20 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-4xl animate-fadeIn space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          🧾 Add New Product
        </h2>

        <form onSubmit={handleAddProduct} className="space-y-6 text-sm sm:text-base">
          {/* Image upload */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={productDetails?.image || "https://img.freepik.com/free-vector/dairy-products-poster_1284-18867.jpg?semt=ais_hybrid&w=740"}
              alt="Product Preview"
              className={`${isAdding ? "cursor-not-allowed" : null} w-24 h-24 rounded-xl object-cover border opacity-50`}
            />
            <label htmlFor="photoInput" className="absolute bottom-0 right-0 bg-white border p-1 rounded-full cursor-pointer">
              <Image className="w-5 h-5 text-blue-600" />
            </label>
            <input
              type="file"
              accept="image/*"
              id="photoInput"
              name="image"
              className="hidden"

              onChange={handlePhotoChange}
            />
          </div>

          {/* Product Name and Category */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-1/2">
              <InputWithLabel
                label="Product Name"
                name="name"
                placeholder="Ex: Milk"
                icon={<Tag className="text-gray-500" />}
                onChange={handleInputChange}

              />
            </div>
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="category"
                className="text-sm text-gray-700 dark:text-white font-medium flex items-center gap-2"
              >
                <Package className="text-gray-500 text-sm" />
                Category
              </label>
              <select
                id="category"
                name="category"
                onChange={handleInputChange}
                defaultValue=""

                className={`${isAdding ? "cursor-not-allowed" : null} p-3 rounded-lg border border-gray-600 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
              focus:outline-none focus:ring-1 focus:ring-gray-500`}            >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat} className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Description
            </label>
            <div className="flex items-start gap-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-500/30 dark:border-gray-600">
              <DescriptionIcon className="text-gray-500" />
              <textarea
                type="text"
                name="description"
                rows={5}
                cols={40}
                placeholder="Enter something product"
                className={`${isAdding ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Nutrition Input  */}
          <NutritionInput
            onChange={(nutritionData) =>
              setProductDetails((prev) => ({
                ...prev,
                nutrition: nutritionData,
              }))
            }
          />

          {/* Product"s Shelflife and Selling Price */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-1/2">
              <InputWithLabel
                label="Product's Shelflife"
                name="shelfLife"
                placeholder="Ex: 4 Days"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <InputWithLabel
                label="Selling Price (₹)"
                name="price"
                placeholder="Ex: 50"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Stock and Quantity Unit */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 ">
            <div className="w-1/2">
              <InputWithLabel
                label="Stock"
                name="stock"
                placeholder="Ex: 100"
                isAdding={isAdding}
                icon={<Archive className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quantityUnit"
                  className="text-sm text-gray-700 dark:text-white font-medium flex items-center gap-2"
                >
                  <FlaskConical className="text-gray-500 !text-sm" />
                  Quantity Unit
                </label>
                <select
                  id="quantityUnit"
                  name="quantityUnit"
                  onChange={handleInputChange}
                  defaultValue=""

                  className={`${isAdding ? "cursor-not-allowed" : null} p-3 rounded-lg border border-gray-600 dark:border-gray-600 
                 bg-gray-50 dark:bg-gray-500/30 text-gray-700 dark:text-white 
                 focus:outline-none focus:ring-1 focus:ring-gray-500`}
                >
                  <option value="" disabled hidden>
                    Select unit
                  </option>

                  {quantityUnits.map((unit, index) => (
                    <option
                      key={index}
                      value={unit}
                      className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                    >
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Threshold Value and Discount */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
            <div className="w-1/2">
              <InputWithLabel
                label="Threshold Value"
                name="thresholdVal"
                placeholder="Ex: 10"
                icon={<AlertCircle className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <InputWithLabel
                label="Discount (%)"
                name="discount"
                placeholder="Ex: 10%"
                icon={<CurrencyRupeeIcon className="text-gray-500" />}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setAddModel(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"

              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isAdding ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🧩 Reusable input with label and icon
function InputWithLabel({ label, name, placeholder, icon, onChange, isAdding }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-500/30 dark:border-gray-600">
        {icon}
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className={`${isAdding ? " cursor-not-allowed" : null} flex-1 bg-transparent focus:outline-none text-gray-900 dark:text-white`}
          onChange={onChange}
        />
      </div>
    </div>
  );
}


