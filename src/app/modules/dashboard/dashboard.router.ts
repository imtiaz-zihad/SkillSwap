import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../generated/prisma/enums";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/learner", auth(UserRole.LEARNER), DashboardController.getLearnerDashboard);
router.get("/instructor", auth(UserRole.INSTRUCTOR), DashboardController.getInstructorDashboard);

export const dashboardRouter = router;
