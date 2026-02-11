import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { DashboardService } from "./dashboard.service";
import { IJWTPayload } from "../../types/common";

const getLearnerDashboard = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const data = await DashboardService.getLearnerDashboard(req.user!);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Learner dashboard retrieved",
      data,
    });
  },
);

const getInstructorDashboard = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const data = await DashboardService.getInstructorDashboard(req.user!);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Instructor dashboard retrieved",
      data,
    });
  },
);

export const DashboardController = {
  getLearnerDashboard,
  getInstructorDashboard,
};
