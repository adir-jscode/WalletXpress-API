import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionControllers } from "./transaction.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN),
  TransactionControllers.getAllTransaction
);

router.get(
  "/transaction-history",
  checkAuth(Role.USER, Role.AGENT),
  TransactionControllers.getTransactionHistory
);

export const transactionRoutes = router;
