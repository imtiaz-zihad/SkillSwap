import express from "express";
import { userRouter } from "../modules/user/user.router";
import { authRoutes } from "../modules/auth/auth.router";
import { IssueRouter } from "../modules/issue/issue.router";
import { applicationRouter } from "../modules/application/application.router";
import { sessionRouter } from "../modules/session/session.router";
import { reviewRouter } from "../modules/reviews/review.router";
import { dashboardRouter } from "../modules/dashboard/dashboard.router";
import { LeaderboardRouter } from "../modules/leaderboard/leaderboard.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/issues",
    route: IssueRouter,
  },
  {
    path: "/applications",
    route: applicationRouter,
  },
  {
    path: "/sessions",
    route: sessionRouter,
  },
  {
    path: "/reviews",
    route: reviewRouter,
  },
  {
    path: "/dashboard",
    route: dashboardRouter,
  },
  {
    path: "/leaderboard",
    route: LeaderboardRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
