import { Request, Response } from "express";
import catchAsync from "../../shares/catchAsync";
import sendResponse from "../../shares/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Login Successfully !!!",
    data: result,
  });
});

export const AuthController = {
  login,
};
