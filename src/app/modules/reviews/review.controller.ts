import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { IJWTPayload } from "../../types/common";
import { ReviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { sessionId } = req.params;
    const result = await ReviewService.createReview(
      req.user as IJWTPayload,
      sessionId as string,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  createReview,
};
