import express from "express";
import { last7DayTotals } from "../controller/reportcontroller.js";
const router = express.Router()

router.route("/week").post(last7DayTotals)
export default router;