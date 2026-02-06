import { fileUploader } from "../../helper/fileUploder";
import { UserController } from "./user.controller";
import express, { NextFunction, Request, Response } from "express";
import { UserValidation } from "./user.validation";
import { UserRole } from "../../generated/prisma/enums";
import auth from "../../middlewares/auth";


const router = express.Router();



router.get("/", auth(UserRole.ADMIN), UserController.getAllFromDB);

router.post(
  "/create-learner",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createLearnerValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createLearner(req, res, next);
  },
);

router.post(
  "/create-instructor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createInstructorValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createInstructor(req, res, next);
  },
);
router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createAdmin(req, res, next);
  },
);

export const userRouter = router;
