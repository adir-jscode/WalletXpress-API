import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { addMoneySchema, withdrawMoneySchema } from "./wallet.validation";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), WalletControllers.getWallets);

router.patch(
  "/add-money/",
  validateRequest(addMoneySchema),
  checkAuth(Role.AGENT),
  WalletControllers.addMoney
);
router.patch(
  "/withdraw-money/",
  validateRequest(withdrawMoneySchema),
  checkAuth(Role.USER),
  WalletControllers.withdrawMoney
);
router.patch(
  "/send-money",
  checkAuth(Role.USER),
  WalletControllers.sendMoneyToUser
);
router.patch("/cash-in", checkAuth(Role.AGENT), WalletControllers.cashIn);

export const walletRoutes = router;
