import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaShippingFast,
  FaBoxOpen,
  FaStar
} from "react-icons/fa";

export default function UserOrders({ order }) {



  const address = order?.address;
  const products = order?.productsData;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: <FaHourglassHalf className="text-yellow-500 text-xl" />,
          textClass: "text-yellow-500",
        };
      case "Processing":
        return {
          icon: <FaBoxOpen className="text-blue-500 text-xl" />,
          textClass: "text-blue-500",
        };
      case "Shipped":
        return {
          icon: <FaShippingFast className="text-purple-500 text-xl" />,
          textClass: "text-purple-500",
        };
      case "Delivered":
        return {
          icon: <FaCheckCircle className="text-green-600 text-xl" />,
          textClass: "text-green-600",
        };
      case "Cancelled":
        return {
          icon: <FaTimesCircle className="text-red-600 text-xl" />,
          textClass: "text-red-600",
        };
      default:
        return {
          icon: null,
          textClass: "text-gray-500 dark:text-white",
        };
    }
  };
  const { icon, textClass } = getStatusStyle(order.status);

  console.log(address, products, order)


  return (
    <div className="bg-white dark:bg-gray-500/20 rounded-xl shadow p-4 mb-6">
      {/* Top Status */}
      <div className={`flex items-center gap-3 text-sm ${textClass} font-semibold mb-2`}>
        {icon}
        <div>
          {order.status}
          <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            On {new Date(order.createdAt).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </div>

      {/* Card Main */}
      {products.map((product) => {
        return (
          <div className="bg-gray-100 dark:bg-gray-500/20 rounded-md flex items-center justify-between p-3 mb-3" >
            <div className="flex gap-3 items-start">
              <img
                src={product.productId.image || "https://res.cloudinary.com/dyahibuzy/image/upload/v1750397387/user-profiles/czkyudzlkuvwt6jmlyer.jpg"}
                alt="Product"
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <span className="font-semibold">{product.productId.name}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {product.category}
                </p>
                <p className="text-sm text-gray-500 dark:text-white">Quantity: {product.productQuantity}</p>
                <p className="text-sm text-gray-500 dark:text-white">Price: {product.productPrice} Rs / {product.productId.quantityUnit}</p>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="text-xl text-gray-400 font-bold" >&rsaquo;</div>
          </div >
        )
      })}

      {/* Return Info */}
      <div className="text-sm text-gray-600  dark:text-gray-400 mt-3 border-t border-dashed pt-3">
        <h3 className="font-semibold dark:text-[#D595C3]  text-gray-400">Delivay Address Info :</h3>
        <div className="w-full">
          <div className="flex  justify-between">
            <p className="font-semibold mt-3 text-gray-800 dark:text-gray-100">
              {order.address?.name} <span className="font-normal text-gray-600 dark:text-gray-300 ml-3">{order.address?.phone}</span>
            </p>
            <span className={`inline-flex items-center px-3 rounded-full text-sm font-semibold tracking-wide bg-gray-800 text-white dark:text-white`}>
              {order.address?.addressType}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {order.address?.streetAddress}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
          </p>
        </div>

      </div>


      {/* Review Stars */}
      <div className="flex items-center mt-3 gap-2 border-t border-dashed pt-3">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="dark:text-gray-300 text-gray-600 hover:text-yellow-400 cursor-pointer" />
        ))}
        <span className="ml-2 text-sm text-gray-800 dark:text-white font-medium">
          Rate & Review to <span className="text-[#d14bad] font-bold">earn Madhur's Credit</span>
        </span>
      </div>
    </div >

  );
}
