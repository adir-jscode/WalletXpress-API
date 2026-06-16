import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AIServices } from "./ai.service";

const chat = catchAsync(async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message?.trim()) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Message is required",
      data: null,
    });
  }

  const reply = await AIServices.chat(req.user.id, message, history || []);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AI response generated",
    data: { reply },
  });
});

export const AIControllers = { chat };
