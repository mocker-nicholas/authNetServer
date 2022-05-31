import express from "express";
const router = express.Router();
import { getHostedToken } from "../controller/vtcontroller.js";

router.route("/hosted").post(getHostedToken);

export default router;
