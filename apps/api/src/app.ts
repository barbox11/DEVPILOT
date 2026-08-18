import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/error.js";
import router from "./routes/index.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  }),
);
app.use(express.json());

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
