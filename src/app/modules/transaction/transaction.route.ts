import { Router } from "express";
import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/",
  checkAuth(Role.USER),
  TransactionControllers.getTransactionHistory
);
export const transactionRoutes = router;
