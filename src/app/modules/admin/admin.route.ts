import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { updateWalletStatusZodSchema } from "../wallet/wallet.validation";
import { AdminControllers } from "./admin.controller";

const router = Router();

router.patch(
  "/block-unblock/:id",
  validateRequest(updateWalletStatusZodSchema),
  checkAuth(Role.ADMIN),
  AdminControllers.blockUnlockUserWallets,
);
router.patch(
  "/approve-suspend/:id",
  checkAuth(Role.ADMIN),
  AdminControllers.approveSuspendAgent,
);
router.patch(
  "/block-user/:id",
  checkAuth(Role.ADMIN),
  AdminControllers.blockUser,
);
export const adminRoutes = router;
