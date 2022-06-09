import express from "express";
import { createCustomer } from "../controller/customercontroller.js";

const router = express.Router();

router.route("/create").post(createCustomer);

export default router;
