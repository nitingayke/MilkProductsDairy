import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { addNewOrder, getAllUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/add", wrapAsync(addNewOrder));

router.post("/get-orders", wrapAsync(getAllUserOrders));

export default router;