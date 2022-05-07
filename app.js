import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  generateTransaction,
  searchTransactions,
  getTransaction,
  voidTransaction,
} from "./controller/transactionController.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.post("/transaction/:id/void", async (req, res) => {
  const { id } = req.params;
  const response = await voidTransaction(id);
  console.log(response);
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
  console.log(response);
  return res.json(response);
});

app.listen(8080, () => {
  console.log("on port 8080");
});
