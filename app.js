import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionRouter from "./routes/transactionrouter.js";
import vtRouter from "./routes/vtrouter.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/transaction", transactionRouter);
app.use("/api/vt", vtRouter);

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

// app.post("/vt/hosted", async (req, res) => {
//   const response = await getFormToken(req.body);
//   return res.json(response);
// });

app.listen(8080, () => {
  console.log("on port 8080");
});
