"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const admin_service_1 = require("./admin.service");
const sendResponse_1 = require("../../utils/sendResponse");
// const changeUserWalletStatus = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const updateStatus = await AdminServices.changeUserWalletStatus(
//       req.params.id
//     );
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Status updated successfully",
//       data: updateStatus,
//     });
//   }
// );
const blockUnlockUserWallets = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const userId = req.params.id;
    const updateStatus = yield admin_service_1.AdminServices.blockUnlockUserWallets(userId, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Wallet is ${status} successfully`,
        data: updateStatus,
    });
}));
const approveSuspendAgent = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { approvalStatus } = req.body;
    const updateStatus = yield admin_service_1.AdminServices.approveSuspendAgent(req.params.id, approvalStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Agent is ${approvalStatus} successfully`,
        data: updateStatus,
    });
}));
exports.AdminControllers = {
    blockUnlockUserWallets,
    approveSuspendAgent,
};
