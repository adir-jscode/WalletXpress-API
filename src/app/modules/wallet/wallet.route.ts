import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.patch(
  "/add-money/:id",
  checkAuth(Role.USER),
  WalletControllers.addMoney
);
router.patch(
  "/withdraw-money/:id",
  checkAuth(Role.USER),
  WalletControllers.withdrawMoney
);
router.patch(
  "/send-money",
  checkAuth(Role.USER),
  WalletControllers.sendMoneyToUser
);

export const walletRoutes = router;
