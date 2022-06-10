import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
} from "../controller/customercontroller.js";

const router = express.Router();

router.route("/").get(getAllCustomers);
router.route("/create").post(createCustomer);
router.route("/:id").get(getSingleCustomer);

export default router;
