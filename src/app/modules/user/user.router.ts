import { fileUploader } from "../../helper/fileUploder";
import { UserController } from "./user.controller";
import express, { NextFunction, Request, Response } from "express";
import { UserValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/create-learner",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createLearnerValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createLearner(req, res, next);
  },
);

export const userRouter = router;
