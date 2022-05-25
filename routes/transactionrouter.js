import express from "express";
const router = express.Router();
import {
  createRandomTrans,
  transactionRefund,
  transactionVoid,
  getTransactionDetails,
  transactionSearch,
} from "../controller/transactionController.js";

router.route("/generate").post(createRandomTrans);

router.route("/search").post(transactionSearch);

router.route("/:id/refund").post(transactionRefund);

router.route("/:id/void").post(transactionVoid);

router.route("/:id").get(getTransactionDetails);

export default router;
