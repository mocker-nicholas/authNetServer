import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
} from "../controller/invoicecontroller.js";

const router = express.Router();

router.route("/").get(getAllInvoices);

router.route("/:id").get(getInvoiceById);

export default router;
