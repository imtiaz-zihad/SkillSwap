import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma/enums";
import { ApplicationController } from "./application.controller";
import { ApplicationValidation } from "./application.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.INSTRUCTOR),
  (req, _res, next) => {
    req.body = ApplicationValidation.createApplicationValidationSchema.parse(
      req.body
    );
    next();
  },
  ApplicationController.createApplication
);

export const applicationRouter = router;
