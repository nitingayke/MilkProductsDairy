import React, { useState } from "react";
import { removeProduct } from "../../../../services/productServices"
import { toast } from "react-toastify";

export default function RemoveModel({ setRemoveModel, selectedProduct }) {

  const [isRemoving, setIsRemoving] = useState(false)

  if (!selectedProduct) {
    return toast.error("Please select a product")
  }

  const handleRemoveProduct = async () => {
    setIsRemoving(true);
    try {

      const res = await removeProduct(selectedProduct?._id)

      if (res?.success) {
        toast.success("Product removed successfully")
      } else {
        toast.error("Error while removing product")
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsRemoving(false),
      setRemoveModel(false)
    }
      
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm px-4  flex flex-col items-center justify-center overflow-auto">
      <div className="bg-white dark:bg-gray-500/20 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-fadeIn scale-95 animate-scaleIn">

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          Do you want to remove this product?
        </h2>

        <div className="text-sm sm:text-base bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-gray-700 dark:text-gray-200">
          <p><span className="font-medium">Name:</span> {selectedProduct?.name}</p>
          <p><span className="font-medium">Category:</span> {selectedProduct?.category}</p>
          <p><span className="font-medium">Stock:</span> {selectedProduct?.stock}</p>
          <p><span className="font-medium">Price:</span> {selectedProduct?.price}</p>
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              setRemoveModel(false)
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleRemoveProduct()
            }}
            className="flex-1 py-2 border border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
