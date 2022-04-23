import express from "express";
import dotenv from "dotenv";
import { getTransactions } from "./util.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("myLittleServer is running");
});

app.get("/transactions", async (req, res) => {
  const response = await getTransactions();
  res.json(response);
});

app.listen(8080, () => {
  console.log("on port 8080");
});
