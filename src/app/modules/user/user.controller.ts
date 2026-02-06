import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { UserService } from "./user.service";

const createLearner = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createLearner(req);

  console.log(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Learner created successfully!",
    data: result,
  });
});

const createInstructor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createInstructor(req);

  console.log(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Instructor created successfully!",
    data: result,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  console.log(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});
export const UserController = {
  createLearner,
  createInstructor,
  createAdmin,
};
