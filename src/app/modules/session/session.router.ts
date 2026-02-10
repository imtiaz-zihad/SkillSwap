import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma/enums";
import { SessionController } from "./session.controller";
import { SessionValidation } from "./session.validation";

const router = express.Router();

router.patch(
  "/:id/learner-feedback",
  auth(UserRole.LEARNER),
  (req, _res, next) => {
    req.body = SessionValidation.learnerFeedbackValidationSchema.parse(
      req.body,
    );
    next();
  },
  SessionController.learnerFeedback,
);

router.patch(
  "/:id/instructor-mark-completed",
  auth(UserRole.INSTRUCTOR),
  SessionController.instructorMarkCompleted
);

export const sessionRouter = router;
