import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  chargeAProfile,
  searchCustomers,
} from "../controller/customercontroller.js";

const router = express.Router();

router.route("/").get(getAllCustomers);
router.route("/create").post(createCustomer);
router.route("/search").post(searchCustomers);
router.route("/:id/charge").post(chargeAProfile);
router.route("/:id").get(getSingleCustomer);

export default router;
