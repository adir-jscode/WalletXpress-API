import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const blockUnlockUserWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const userId = req.params.id;
    const updateStatus = await AdminServices.blockUnlockUserWallets(
      userId,
      status,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Wallet is ${status} successfully`,
      data: updateStatus,
    });
  },
);

const approveSuspendAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("params:", req.params);

    const updateStatus = await AdminServices.approveSuspendAgent(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Agent's status changed successfully`,
      data: updateStatus,
    });
  },
);
const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    console.log("Blocking user with ID:", userId);
    const updateStatus = await AdminServices.blockUser(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User is blocked successfully`,
      data: updateStatus,
    });
  },
);
export const AdminControllers = {
  blockUnlockUserWallets,
  approveSuspendAgent,
  blockUser,
};
