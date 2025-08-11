import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { walletRoutes } from "../modules/wallet/wallet.route";
import { authRoutes } from "../modules/auth/auth.route";
import { transactionRoutes } from "../modules/transaction/transaction.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { OtpRoutes } from "../modules/Otp/otp.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/wallet",
    route: walletRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
