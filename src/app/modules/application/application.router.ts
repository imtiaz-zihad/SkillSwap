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
      req.body,
    );
    next();
  },
  ApplicationController.createApplication,
);

router.post(
  "/accept/:id",
  auth(UserRole.LEARNER),
  ApplicationController.acceptApplication,
);

// router.get("/", auth(UserRole.ADMIN), ApplicationController.getAllApplications);
router.get("/",ApplicationController.getAllApplications);

export const applicationRouter = router;
