import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = express.Router();

// POST /api/reviews/:sessionId
router.post("/:sessionId", auth(UserRole.LEARNER, UserRole.INSTRUCTOR), ReviewController.createReview);

export const reviewRouter = router;
