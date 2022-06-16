import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
} from "../controller/invoicecontroller.js";

const router = express.Router();

router.route("/").get(getAllInvoices);

router.route("/create").post(createInvoice);

router.route("/:id").get(getInvoiceById).delete(deleteInvoice);

export default router;
