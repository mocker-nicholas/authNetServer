import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionRouter from "./routes/transactionrouter.js";
import vtRouter from "./routes/vtrouter.js";
import reportingRouter from "./routes/reportingrouter.js";
import customerRouter from "./routes/customerRouter.js";
import session from "express-session";
import { sessionStuff } from "./middleware.js";
const PORT = process.env.PORT || 8080;

const app = express();
dotenv.config();

app.use(express.json());

const corsOptions = {
  origin: "https://mocker-nicholas.github.io/authy/",
  credentials: true,
};
const sessionConfig = {
  secret: "keyboard cat",
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

app.get("/", (req, res) => {
  res.send("authNetServer is online");
});

app.listen(PORT, () => {
  console.log("on port 8080");
});
