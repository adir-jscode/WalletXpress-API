"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("../wallet/wallet.validation");
const user_validation_1 = require("../user/user.validation");
const router = (0, express_1.Router)();
// router.patch(
//   "/:id",
//   checkAuth(Role.ADMIN),
//   AdminControllers.changeUserWalletStatus
// );
router.patch("/block-unblock/:id", (0, validateRequest_1.validateRequest)(wallet_validation_1.updateWalletStatusZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.blockUnlockUserWallets);
router.patch("/approve-suspend/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateApprovalStatusZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.approveSuspendAgent);
exports.adminRoutes = router;
