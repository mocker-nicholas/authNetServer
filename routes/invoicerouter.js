import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
} from "../controller/invoicecontroller.js";

const router = express.Router();

router.route("/").post(getAllInvoices);

router.route("/create").post(createInvoice);

router.route("/:id").get(getInvoiceById).delete(deleteInvoice);

router.route("/paid/:id").post(markInvoiceAsPaid);

export default router;
