import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { UserService } from "./user.service";
import { log } from "console";

const createLearner = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body);
  const result = await UserService.createLearner(req);
  
  console.log(result);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Learner created successfully!",
    data: result,
  });
});
export const UserController = {
  createLearner,
};
