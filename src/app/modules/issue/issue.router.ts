import { Admin } from './../../generated/prisma/browser';
import express, { NextFunction, Request, Response } from "express";
import { IssueController } from "./issue.controller";
import { IssueValidation } from "./issue.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploder";
import { UserRole } from "../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/create-issue",
  auth(UserRole.LEARNER),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = IssueValidation.createIssueValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return IssueController.createIssue(req, res, next);
  },
);

router.get("/open-issue", IssueController.getOpenIssues);

router.get("/my-issue", auth(UserRole.LEARNER), IssueController.getMyIssues);

 router.get("/issue/:id", auth(), IssueController.getSingleIssue);

export const IssueRouter = router;
