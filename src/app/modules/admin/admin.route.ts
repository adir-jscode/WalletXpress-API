import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateWalletStatusZodSchema } from "../wallet/wallet.validation";
import { updateApprovalStatusZodSchema } from "../user/user.validation";

const router = Router();

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  AdminControllers.changeUserWalletStatus
);

router.patch(
  "/block-unblock/:id",
  validateRequest(updateWalletStatusZodSchema),
  checkAuth(Role.ADMIN),
  AdminControllers.blockUnlockUserWallets
);
router.patch(
  "/approve-suspend/:id",
  validateRequest(updateApprovalStatusZodSchema),
  checkAuth(Role.ADMIN),
  AdminControllers.approveSuspendAgent
);
export const adminRoutes = router;
