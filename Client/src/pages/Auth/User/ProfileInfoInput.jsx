// Updated ProfileInfoInput with dark/light theme support, responsive design, toasts, and more
import React, { useContext, useState } from "react";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeProvider";
import { maharashtraCities } from "../../../data/cities";
import { AdminAuthContext } from "../../../context/AuthProvider";

export default function ProfileInfoInput() {
  const navigate = useNavigate();

  const { handleAdminLogout } = useContext(AdminAuthContext);
  const { theme } = useContext(ThemeContext);

  const getTextFieldStyles = (theme) => ({
    input: {
      color: theme === "dark" ? "#fff" : "#000",
      backgroundColor: "transparent",
    },
    '& label': {
      color: theme === "dark" ? "#bbb" : "#555",
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme === "dark" ? "#888" : "#ccc",
      },
      '&:hover fieldset': {
        borderColor: "#843E71",
      },
      '&.Mui-focused fieldset': {
        borderColor: "#843E71",
      },
    },
  });

  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    gender: "",
    photo: "",
    username: "",
    address: {
      streetAddress: "",
      city: "",
      pincode: "",
    },
    shopName: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileInfo((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["streetAddress", "city", "pincode"].includes(name)) {
      setProfileInfo((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      setProfileInfo((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("User"))?._id;
      if (!userId) {
        toast.error("User not logged in, please login!");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("id", userId);
      formData.append("profileInfo", JSON.stringify(profileInfo));
      if (selectedFile) formData.append("photo", selectedFile);

      const res = await axios.post("http://localhost:9000/u/signup/info-input", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        localStorage.setItem("User", JSON.stringify(res?.data?.user));
        handleAdminLogout();
        toast.success("Profile created successfully!");
        navigate("/home");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error occurred!");
      // console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center px-4 py-10 overflow-auto min-h-screen bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300`}>
      <div className={`bg-white dark:bg-gray-500/20 rounded-2xl shadow-2xl p-8 w-full max-w-3xl`}>
        <h1 className="text-3xl font-bold text-center text-[#843E71] mb-6 dark:text-[#e0b3d9]">
          Complete Your Profile
        </h1>
        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <div className="relative w-24 h-24 rounded-full mx-auto mb-8">
            <img
              src={profileInfo.photo || "/default-avatar.png"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"

            />
            <label htmlFor="photoInput" className="absolute bottom-0 right-0 bg-white dark:bg-gray-200 rounded-full p-1 cursor-pointer border">
              <i className="fas fa-edit text-[#843E71]" />
            </label>
            <input type="file" accept="image/*" id="photoInput" onChange={handlePhotoChange} className="hidden"/>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="First Name" name="firstName" value={profileInfo.firstName} onChange={handleInputChange} disabled={isLoading} fullWidth required  sx={getTextFieldStyles(theme)} />
            <TextField label="Last Name" name="lastName" value={profileInfo.lastName} onChange={handleInputChange} disabled={isLoading} fullWidth required sx={getTextFieldStyles(theme)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Phone Number" name="mobileNo" value={profileInfo.mobileNo} onChange={handleInputChange} disabled={isLoading} fullWidth required sx={getTextFieldStyles(theme)} />
            <select name="gender" required value={profileInfo.gender} onChange={handleInputChange} disabled={isLoading} className="border border-gray-300 rounded-md p-3 w-full text-black dark:text-white dark:bg-gray-700">
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <TextField label="Username" name="username" value={profileInfo.username} onChange={handleInputChange} disabled={isLoading} fullWidth required sx={getTextFieldStyles(theme)} className="!mb-5" />
          <TextField label="Shop Name" name="shopName" value={profileInfo.shopName} onChange={handleInputChange} disabled={isLoading} fullWidth  sx={getTextFieldStyles(theme)} className="!mb-5" />
          <TextField label="Address" name="streetAddress" value={profileInfo.address.streetAddress} onChange={handleInputChange} disabled={isLoading} fullWidth required sx={getTextFieldStyles(theme)} className="!mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <select name="city" required value={profileInfo.address.city} onChange={handleInputChange} disabled={isLoading} className="border border-gray-300 rounded-md p-3 w-full text-black dark:text-white dark:bg-gray-700">
              <option >Select City</option>
              {maharashtraCities.map((city, idx) => {
                return <option value={city} key={idx}>{city}</option>
              })}
            </select>
            <TextField label="Pincode" name="pincode" value={profileInfo.pincode} onChange={handleInputChange} disabled={isLoading} fullWidth required sx={getTextFieldStyles(theme)} />
          </div>

          <div className="flex flex-col gap-2 mt-4 text-sm font-medium">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#843E71]" required/> I agree to all
              <span className="text-[#FF8682]"> Terms </span> and
              <span className="text-[#FF8682]"> Privacy Policies</span>
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input type="checkbox" className="accent-[#843E71]" /> Subscribe to all offers and updates
            </label>
          </div>

          <Button type="submit" variant="contained" fullWidth className="!mt-6 !py-3 !text-lg !bg-[#843E71] hover:!bg-[#6f3260]">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
