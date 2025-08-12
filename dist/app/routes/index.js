"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const auth_route_1 = require("../modules/auth/auth.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const admin_route_1 = require("../modules/admin/admin.route");
const otp_route_1 = require("../modules/Otp/otp.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoutes,
    },
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.walletRoutes,
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
