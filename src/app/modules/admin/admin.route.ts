import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  AdminControllers.changeUserWalletStatus
);

router.patch(
  "/block-unblock/:id",
  checkAuth(Role.ADMIN),
  AdminControllers.blockUnlockUserWallets
);
export const adminRoutes = router;
