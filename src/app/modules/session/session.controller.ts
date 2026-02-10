import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { SessionService } from "./session.service";
import { IJWTPayload } from "../../types/common";

const learnerFeedback = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;
    const { solveStatus } = req.body;

    const result = await SessionService.learnerFeedback(
      req.user as IJWTPayload,
      id as string,
      solveStatus,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Session feedback submitted successfully",
      data: result,
    });
  },
);
const instructorMarkCompletedController = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;

    const result = await SessionService.instructorMarkCompleted(
      req.user as IJWTPayload,
      id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Session marked completed by instructor",
      data: result,
    });
  }
);
export const SessionController = {
  learnerFeedback,
  instructorMarkCompleted: instructorMarkCompletedController,
};
