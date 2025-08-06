import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All user retrived successfully",
      data: users,
    });
  }
);
const getAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agents = await UserServices.getAgents;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All agent retrived successfully",
      data: agents,
    });
  }
);

export const userControllers = { createUser, getUsers, getAgents };
