import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { IssueService } from "./issue.service";
import { IJWTPayload } from "../../types/common";
import { fileUploader } from "../../helper/fileUploder";
const createIssue = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;

    let imageUrl: string | undefined;

    if (req.file) {
      const uploadResult = await fileUploader.uploadToCloudinary(req.file);
      imageUrl = uploadResult?.secure_url;
    }

    const result = await IssueService.createIssue(user, {
      ...req.body,
      image: imageUrl,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully!",
      data: result,
    });
  },
);

const getOpenIssues = catchAsync(async (_req: Request, res: Response) => {
  const result = await IssueService.getOpenIssues();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Open issues retrieved successfully!",
    data: result,
  });
});

const getMyIssues = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;

    const result = await IssueService.getMyIssues(user.email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My issues retrieved successfully!",
      data: result,
    });
  },
);

const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await IssueService.getSingleIssue(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue retrieved successfully!",
    data: result,
  });
});

export const IssueController = {
  createIssue,
  getOpenIssues,
  getMyIssues,
  getSingleIssue,
};
