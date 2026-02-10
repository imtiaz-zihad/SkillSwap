import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { IJWTPayload } from "../../types/common";
import { ApplicationService } from "./application.server";

const createApplication = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const result = await ApplicationService.createApplication(
      req.user as IJWTPayload,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Application submitted successfully!",
      data: result,
    });
  }
);

export const ApplicationController = {
  createApplication,
};
