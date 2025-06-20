import React, { useContext, useEffect, useState } from "react";
import UserOrders from "../../../components/AdminComponents/OrderComponents/UserOrder/UserOrders";
import { getUserOrders } from "../../../services/orderService";
import { UserAuthContext } from "../../../context/AuthProvider"
// import { toast } from "react-toastify";
export default function MyOrders() {



  const { authUser } = useContext(UserAuthContext)

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // optional loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (authUser?._id) {
          const res = await getUserOrders(authUser._id);
          setOrders(res.orders); // assuming API returns { orders: [...] }
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Something went wrong while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser?._id]); // depend on user ID in case it's async

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // console.log(orders);


  return (
    <div className="w-full max-w-full mx-auto bg-white dark:bg-gray-500/20 text-gray-800 dark:text-gray-100 shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Orders</h2>

      {orders.map((order) => {

        return <UserOrders order={order} />
      })}
      {/* <UserOrders /> */}

    </div>
  );
}
