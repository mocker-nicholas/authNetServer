import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateTransaction } from "./util.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/", (req, res) => {
  res.send("myLittleServer is running");
});

app.post("/api/transaction/search", (req, res) => {
  res.json(req.body);
});

app.post("/api/transaction/generate", async (req, res) => {
  const response = await generateTransaction();
  console.log(response);
  res.json(response);
});

app.listen(8080, () => {
  console.log("on port 8080");
});
