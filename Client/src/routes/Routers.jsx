import { Route, Routes } from "react-router-dom"
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";

import UserLogin from "../pages/Auth/User/UserLogin";
import UserSignUp from "../pages/Auth/User/UserSignUp";
import AdminLogin from "../pages/Auth/Admin/AdminLogin";
import Profile from "../pages/UserProfile/Profile";
import OtpVerification from "../pages/Auth/User/OtpVerification";
import ProfileInfoInput from "../pages/Auth/User/ProfileInfoInput";

import HomePage from "../pages/HomePage"
import NotFound from "../components/NotFound"
import LandingPage from "../pages/LandingPage"
import AboutPage from "../pages/AboutPage"
import ProductPage from "../pages/ProductPage"
import ProductDetailsPage from "../pages/ProductDetailsPage"
import CartPage from "../pages/CartPage"
import ContactPage from "../pages/ContactPage"
import OrderCheckoutPage from "../pages/OrderCheckoutPage"
import Dashboard from "../pages/Admin/Dashboard";
import Inventory from "../pages/Admin/Inventory";
import Orders from "../pages/Admin/Orders";
import OrderPage from "../pages/ProductPage"

export default function Routers() {
    return (
        <Routes>
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/home" element={<Layout><HomePage /></Layout>} />

            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/signup/otp-verification" element={<OtpVerification />} />
            <Route path="/signup/info-input" element={<ProfileInfoInput />} />
            <Route path="/user-profile" element={<Layout><Profile /></Layout>} />

            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
            <Route path="/orders" element={<Layout><OrderPage/></Layout>}/>

            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/products/:productId?" element={<Layout><ProductPage /></Layout>} />
            <Route path="/product-details/:productId?" element={<Layout><ProductDetailsPage /></Layout>} />

            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/order-checkout" element={<Layout><OrderCheckoutPage /></Layout>} />
            <Route path="/my-orders" element={<Layout><OrderPage /></Layout>} />

            <Route path="/contact-us" element={<Layout><ContactPage /></Layout>} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}