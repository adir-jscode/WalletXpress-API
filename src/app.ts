import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Configure CORS to allow requests from the frontend for all routes
app.use(cors({ origin: true, credentials: true }));

app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Welcome to DigitalXpress Server 💳",
  });
});

app.use(globalErrorHandler);
app.use(notFound);
app.set("trust proxy", true);

export default app;
