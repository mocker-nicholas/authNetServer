import express from "express";
import {
  last7DayTotals,
  unsettledTotal,
} from "../controller/reportcontroller.js";
const router = express.Router();

router.route("/week").post(last7DayTotals);

router.route("/unsettled/total").get(unsettledTotal);

export default router;
