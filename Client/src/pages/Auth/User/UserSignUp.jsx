import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { ThemeContext } from "../../../context/ThemeProvider";
import { signupUser } from "../../../services/userService";

export default function UserSignUp() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setIsLoading(true);

      const res = await signupUser(formData);
      if (res?.success) {
        toast.success("OTP sent successfully");
        navigate("/signup/otp-verification", { state: { formData } });
        setFormData({ email: "", password: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTextFieldStyles = (theme) => ({
    input: {
      color: theme === "dark" ? "#fff" : "#000",
    },
    "& label": {
      color: theme === "dark" ? "#ccc" : "#555",
      "&.Mui-focused": {
        color: "#843E71",
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme === "dark" ? "#999" : "#ccc",
      },
      "&:hover fieldset": {
        borderColor: "#843E71",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#843E71",
      },
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
      <div className="bg-white dark:bg-gray-500/20 rounded-2xl shadow-xl px-6 py-10 w-full max-w-md">
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center w-full gap-6">

          <div className="flex justify-between bg-[#D595C3] dark:bg-[#843E71] w-full rounded-lg p-1">
            <button
              className="w-[48%] font-semibold p-1 bg-white text-black dark:bg-gray-200 rounded-lg"
              type="button"
            >
              User
            </button>
            <button
              className="w-[48%] font-semibold p-1 rounded-lg hover:bg-white hover:text-black transition"
              type="button"
              onClick={() => navigate("/admin/login")}
            >
              Admin
            </button>
          </div>

          <h1 className="text-2xl font-bold text-center text-black dark:text-white">User Signup</h1>

          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${isLoading ? "cursor-not-allowed" : "cursor-text"}`}
            variant="outlined"
            fullWidth
            required
            sx={getTextFieldStyles(theme)}
          />

          {/* Password */}
          <div className="relative w-full">
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className={`${isLoading ? "cursor-not-allowed" : "cursor-text"}`}
              variant="outlined"
              fullWidth
              required
              sx={getTextFieldStyles(theme)}
            />
            <button
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500`}
              onClick={() => setShowPassword(!showPassword)}
            ></button>
          </div>


          <div className="relative w-full">
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${isLoading ? "cursor-not-allowed" : "cursor-text"}`}
              variant="outlined"
              fullWidth
              required
              sx={getTextFieldStyles(theme)}
            />
            <button
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500`}
              onClick={() => setShowPassword(!showPassword)}
            ></button>
          </div>

          {/* Terms */}
          <label className="w-full flex justify-start text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" required className="mr-2" />
            I agree to the Terms and Privacy Policy
          </label>

          {/* Submit Button */}
          <Button
            variant="contained"
            className="w-full !bg-[#843E71] text-white font-semibold py-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </Button>

          {/* Already have account */}
          <p className="text-sm text-black dark:text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF8682] hover:underline font-medium">
              Login
            </Link>
          </p>

          {/* OR */}
          <div className="flex items-center w-full">
            <div className="border-t border-gray-400 dark:border-gray-600 flex-grow mr-3" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">or login with</span>
            <div className="border-t border-gray-400 dark:border-gray-600 flex-grow ml-3" />
          </div>

          {/* Social login */}
          <div className="flex w-full justify-between ">
            <div className="w-[47%] border p-2 text-center rounded-md border-[#843E71] hover:bg-[#843E71] dark:text-white transition cursor-pointer">
              <i className="fa-brands fa-facebook"></i>
            </div>
            <div className="w-[47%] border p-2 text-center rounded-md border-[#843E71] hover:bg-[#843E71] dark:text-white transition cursor-pointer">
              <i className="fa-brands fa-google"></i>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
