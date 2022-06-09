import express from "express";
import {
  createCustomer,
  getAllCustomers,
} from "../controller/customercontroller.js";

const router = express.Router();

router.route("/").get(getAllCustomers);
router.route("/create").post(createCustomer);

export default router;
