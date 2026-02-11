import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { IJWTPayload } from "../../types/common";
import { ApplicationService } from "./application.server";

const createApplication = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const result = await ApplicationService.createApplication(
      req.user as IJWTPayload,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Application submitted successfully!",
      data: result,
    });
  },
);

const acceptApplication = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;

    const result = await ApplicationService.acceptApplication(
      id as string,              
      req.user as IJWTPayload,   
    );

    sendResponse(res, {  
      statusCode: 200,
      success: true,
      message: "Application accepted & session created",
      data: result,
    });
  },
);

const getAllApplications = catchAsync(async (_req: Request, res: Response) => {
  const result = await ApplicationService.getAllApplications();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All applications retrieved successfully",
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  acceptApplication,
  getAllApplications
};
