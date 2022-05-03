import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateTransaction, searchTransactions } from "./util.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.post("/api/transaction/search", async (req, res) => {
  const response = await searchTransactions();
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
