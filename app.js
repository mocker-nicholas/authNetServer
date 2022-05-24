import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateTransaction, searchTransactions } from "./util.js";
import transactionRouter from "./routes/transactionrouter.js";
import { getFormToken } from "./controller/vtcontroller.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/transaction", transactionRouter);

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.post("/vt/hosted", async (req, res) => {
  const response = await getFormToken(req.body);
  return res.json(response);
});

// app.post("/api/transaction/search", async (req, res) => {
//   const response = await searchTransactions(req.body);
//   return res.json(response);
// });

app.post("/api/transaction/generate", async (req, res) => {
  const response = await generateTransaction();
  return res.json(response);
});

app.listen(8080, () => {
  console.log("on port 8080");
});
