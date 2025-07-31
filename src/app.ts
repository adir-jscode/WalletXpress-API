import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

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

export default app;
