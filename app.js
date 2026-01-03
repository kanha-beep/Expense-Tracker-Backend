import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./init/db.js";
import TrackerRoutes from "./Routes/TrackerRoutes.js";
import AuthRoutes from "./Routes/AuthRoutes.js";

const app = express();
connectDB();
// Middleware
const allowedOrigins=process.env.CLIENT_URL.split(",")
console.log(allowedOrigins)
app.set("trust proxy", 1);
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(express.json());
// Routes
app.use("/api/tracker", TrackerRoutes);
app.use("/api/auth", AuthRoutes);
app.get("/", (req, res) => res.send("Server running..."));

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ error: message });
});



app.use((error, req, res, next) => {
  const { status, message } = error;
  res.status(status).json(message);
})



export default app;