import api from "./api";
import { sendOtpEmail } from "./sentOtp";

export const loginUser = async (email, password) => {
  const res = await api.post("/u/login", { email, password });
  console.log(res.data);
  return res?.data;
};

export const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const signupUser = async (formData, otp) => {

  const res = await api.post("/u/signup", formData);
  if (res?.data?.success) {
    const response = await sendOtpEmail(formData?.email, otp);
    if(response?.success) {
      return res.data;
    }else{
      return response;
    }
  }else{
    return res?.data;
  }
};

export const verifyUserOTP = async (formData) => {
  const res = await api.post("/u/signup/otp-verification", formData);
  return res?.data;
};

export const getUserById = async (userId) => {
  const res = await api.post("/u/get-user", { _id: userId });
  return res?.data;
};
