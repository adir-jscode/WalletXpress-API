import { Router } from "express";
import { WalletControllers } from "./wallet.controller";

const router = Router();

router.patch("/add-money/:id", WalletControllers.addMoney);
router.patch("/withdraw-money/:id", WalletControllers.withdrawMoney);

export const walletRoutes = router;
