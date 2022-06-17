import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import transactionRouter from "./routes/transactionrouter.js";
import vtRouter from "./routes/vtrouter.js";
import reportingRouter from "./routes/reportingrouter.js";
import customerRouter from "./routes/customerRouter.js";
import invoiceRouter from "./routes/invoicerouter.js";
import session from "express-session";
import { sessionStuff } from "./middleware.js";
import mysql from "mysql";

export const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_SECRET,
  database: process.env.DB,
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log(`Database Connection Error: ${err.stack}`);
  } else {
    console.log("Connection to Database Established");
  }
});

const PORT = process.env.PORT || 8080;
const app = express();
dotenv.config();
app.use(express.json());

const corsOptions = {
  origin: "https://main--benevolent-scone-9283d1.netlify.app",
  credentials: true,
};
// Prod Live url: https://main--benevolent-scone-9283d1.netlify.app
// Devurl: http://localhost:3000

const sessionConfig = {
  secret: process.send.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
};

app.use(cors(corsOptions));
app.use(session(sessionConfig));
app.use(sessionStuff);

////////////////// Routers /////////////////////
app.use("/api/transaction", transactionRouter);
app.use("/api/vt", vtRouter);
app.use("/api/reporting", reportingRouter);
app.use("/api/customer", customerRouter);
app.use("/api/invoice", invoiceRouter);

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.listen(PORT, () => {
  console.log("on port 8080");
});
