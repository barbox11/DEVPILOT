import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/error.js";
import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
