import express from "express";
import { LeaderboardController } from "./leaderboard.controller";

const router = express.Router();

router.get(
  "/instructors",
  LeaderboardController.getInstructorLeaderboard
);

router.get(
  "/learners",
  LeaderboardController.getLearnerLeaderboard
);

export const LeaderboardRouter = router;
