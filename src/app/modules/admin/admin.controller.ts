import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

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
const blockUnlockUserWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const userId = req.params.id;
    const updateStatus = await AdminServices.blockUnlockUserWallets(
      userId,
      status
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Wallet is ${status} successfully`,
      data: updateStatus,
    });
  }
);

const approveSuspendAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { approvalStatus } = req.body;
    const updateStatus = await AdminServices.approveSuspendAgent(
      req.params.id,
      approvalStatus
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Agent is ${approvalStatus} successfully`,
      data: updateStatus,
    });
  }
);
export const AdminControllers = {
  blockUnlockUserWallets,
  approveSuspendAgent,
};
