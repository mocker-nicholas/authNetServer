import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  generateTransaction,
  searchTransactions,
  getTransaction,
  voidTransaction,
  refundTransaction,
} from "./controller/transactionController.js";
import { getFormToken } from "./controller/vtcontroller.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.post("/vt/hosted", async (req, res) => {
  const response = await getFormToken(req.body);
  return res.json(response);
});

app.post("/transaction/:id/void", async (req, res) => {
  const { id } = req.params;
  const response = await voidTransaction(id);
  return res.json(response);
});

app.post("/transaction/:id/refund", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const response = await refundTransaction(body);
  return res.json(response);
});

app.get("/transaction/:id", async (req, res) => {
  const { id } = req.params;
  const response = await getTransaction(id);
  if (response) {
    return res.json(response);
  }
  return "Error";
});

app.post("/api/transaction/search", async (req, res) => {
  const response = await searchTransactions(req.body);
  return res.json(response);
});

app.post("/api/transaction/generate", async (req, res) => {
  const response = await generateTransaction();
  return res.json(response);
});

app.listen(8080, () => {
  console.log("on port 8080");
});
