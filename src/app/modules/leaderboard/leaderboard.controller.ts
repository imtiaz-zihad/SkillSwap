import { Request, Response } from "express";

import { LeaderboardService } from "./leaderboard.service";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";

const getInstructorLeaderboard = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await LeaderboardService.getInstructorLeaderboardFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top 10 Instructor leaderboard retrieved successfully",
      data: result,
    });
  }
);

const getLearnerLeaderboard = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await LeaderboardService.getLearnerLeaderboardFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top 10 Learner leaderboard retrieved successfully",
      data: result,
    });
  }
);

export const LeaderboardController = {
  getInstructorLeaderboard,
  getLearnerLeaderboard,
};
