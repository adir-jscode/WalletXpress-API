import { Router } from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  addMoneySchema,
  sendMoneyToUserSchema,
  withdrawMoneySchema,
} from "./wallet.validation";

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
  validateRequest(sendMoneyToUserSchema),
  checkAuth(Role.USER),
  WalletControllers.sendMoneyToUser
);

export const walletRoutes = router;
