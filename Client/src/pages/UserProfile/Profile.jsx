import React, { useState, useContext, useEffect } from "react";
import {
  MdOutlineAccountCircle,
  MdLocationOn,
  MdShoppingCart,
  MdDelete,
  MdFavorite,
  MdPayment,
  MdArrowForward,
} from "react-icons/md";
import CircularProgress from '@mui/material/CircularProgress';

import AccountInfo from "./ProfileSections/AccountInfo";
import MyAddresses from "./ProfileSections/MyAddresses";
import MyOrders from "./ProfileSections/MyOrders";
import MyWishlist from "./ProfileSections/MyWishlist";
import Payments from "./ProfileSections/Payments";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../../context/AuthProvider";
import axios from "axios";

const Profile = () => {

  const { authUser, setAuthUser, handleUserLogout } = useContext(UserAuthContext);

  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);

  const [activeSection, setActiveSection] = useState("account");
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(authUser?.photo || "");
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    if (authUser?.photo) {
      setPhotoUrl(authUser.photo); // Reset photoUrl from backend on authUser load
    }
  }, [authUser]);


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoUrl(URL.createObjectURL(file));
      setShowUpdateButton(true);
    }
  };

  const handleProfileImageChange = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("id", authUser?._id);

    try {
      const res = await axios.post("http://localhost:9000/user-profile/edit-profilePhoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (res?.data?.success) {
        toast.success("Profile photo updated!");
        setAuthUser((prev) => ({ ...prev, photo: res.data.updatedPhoto }));
      } else {
        toast.error("Failed to update photo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setShowUpdateButton(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <div className="section"><AccountInfo /></div>;
      case "addresses":
        return <div className="section"><MyAddresses /></div>;
      case "orders":
        return <div className="section"><MyOrders /></div>;
      case "wishlist":
        return <div className="section"><MyWishlist /></div>;
      case "payments":
        return <div className="section"><Payments /></div>;
      case "delete":
        return <div className="section py-10 text-center text-red-600 font-bold">Are you sure you want to delete your account?</div>;
      case "logout":
        break;

      default:
        return null;
    }
  };

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-600 dark:text-gray-300">
        <p className="text-xl font-semibold mb-4">User not found or not logged in.</p>
        <p className="text-sm">Please <Link to="/login" className="text-[#843E71] underline">log in</Link> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-5 p-3 gap-5 max-w-7xl mx-auto">
      <aside className="w-full md:w-1/4 bg-white dark:bg-gray-500/20 p-4 shadow-md overflow-y-hidden rounded-md">
        <div className="flex flex-col items-center mb-10 relative group">
          <div className="relative w-24 h-24">
            <img
              src={photoUrl || authUser?.photo}
              alt="User"
              className="rounded-full w-24 h-24 object-cover border"
            />

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={64}
                  thickness={4}
                  style={{ color: "#fff" }}
                />
              </div>
            )}

            <label
              htmlFor="profileImageInput"
              className={`absolute bottom-0 right-0 bg-white dark:bg-gray-800 border p-1 rounded-full transition
    ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              title="Edit Photo"
            >
              <i className="fa-solid fa-pen-to-square text-sm" />
            </label>

            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={loading}
            />

          </div>


          {showUpdateButton && (
            <button
              onClick={handleProfileImageChange}
              disabled={loading}
              className={`mt-2 px-4 py-1 rounded text-sm transition flex items-center gap-2
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#414141] hover:bg-[#5a5a5a] text-white"}
              `}
            >
              {loading ? (
                <>
                  <span>Updating</span>
                  <CircularProgress size={18} color="inherit" />
                </>
              ) : (
                "Update Photo"
              )}
            </button>

          )}


          <h2 className="text-xl font-bold mt-2 text-black dark:text-white">
            {authUser?.firstName} {authUser?.lastName}
          </h2>
        </div>

        <nav className="mt-6 space-y-3">
          {[
            { key: "account", icon: <MdOutlineAccountCircle />, label: "Account" },
            { key: "addresses", icon: <MdLocationOn />, label: "Addresses" },
            { key: "orders", icon: <MdShoppingCart />, label: "Orders" },
            { key: "wishlist", icon: <MdFavorite />, label: "My Wishlist" },
            { key: "payments", icon: <MdPayment />, label: "Payments" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded transition duration-300 ${activeSection === item.key ? "bg-[#D595C3] dark:bg-[#843E71] text-black dark:text-white" : "hover:bg-[#D595C3] dark:hover:bg-[#843E71] text-black dark:text-white"
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          <button
            onClick={() => setActiveSection("delete")}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded text-red-500 transition duration-300 ${activeSection === "delete" ? "bg-red-100 dark:bg-red-800" : "hover:bg-red-100 dark:hover:bg-red-800"
              }`}
          >
            <MdDelete /> Delete Account
          </button>

          <button
            onClick={() => {
              handleUserLogout();
              toast.success("User Logged Out Successfully");
            }}
            className={`w-full flex items-center gap-2 mt-2 px-4 py-2 text-left rounded text-gray-800 dark:text-white transition duration-300 ${activeSection === "logout" ? "bg-[#D595C3] text-white" : "hover:bg-[#D595C3] dark:hover:bg-[#843E71]"
              }`}
          >
            Log out <MdArrowForward />
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto dark:text-white">{renderSection()}</main>
    </div>
  );
};

export default Profile;
