import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";

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
  res
    .status(200)
    .json({ success: true, message: "Welcome to DigitalXpress Server 💳" });
});

export default app;
