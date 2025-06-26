import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { UserAuthContext } from "../../context/AuthProvider";
import { socket } from "../../socket/socket";

const ReviewForm = ({ productId }) => {

    const { authUser } = useContext(UserAuthContext);

    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleReviewSuccess = (data) => {
        toast.success(data?.message);
        setMessage("");
        setRating(5);
        setLoading(false);
    }

    const handleReviewFailed = (data) => {
        toast.error(data.message);
        setLoading(false);
    }

    useEffect(() => {
        socket.on("new-review-add-success", handleReviewSuccess);
        socket.on("review:add-failed", handleReviewFailed);

        return () => {
            socket.off("new-review-add-success", handleReviewSuccess);
            socket.off("review:add-failed", handleReviewFailed);
        }
    }, []);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!authUser?._id) {
            toast.error("You must be logged in to submit a review.");
            return;
        }

        if (!message.trim()) {
            toast.error("Please write your review message.");
            return;
        }

        if (!rating || typeof rating !== "number") {
            toast.error("Please provide a valid rating.");
            return;
        }

        setLoading(true);
        socket.emit("review:add-new", {
            productId,
            userId: authUser._id,
            message: message.trim(),
            rating,
            username: authUser?.username,
            photo: authUser?.photo,
        });
    };

    return (
        <motion.form
            onSubmit={handleSubmitReview}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-2 p-3 rounded-lg bg-white dark:bg-gray-500/20 transition-colors duration-300 max-w-xl"
        >

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Write a Review
            </h2>

            <div>
                <label
                    htmlFor="review-message"
                    className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Message
                </label>
                <textarea
                    id="review-message"
                    className="w-full p-3 border rounded-md text-sm border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-500/10 dark:text-white transition-colors duration-300"
                    rows={4}
                    placeholder="Write your review here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <label
                        htmlFor="review-rating"
                        className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Rating
                    </label>
                    <Rating
                        id="review-rating"
                        name="product-rating"
                        value={rating}
                        precision={1}
                        onChange={(event, newValue) => setRating(newValue)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#843E71] hover:bg-[#6d2b5f] text-white font-medium px-6 py-2 rounded-md transition disabled:opacity-60"
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </motion.form>
    );
};

ReviewForm.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default ReviewForm;
