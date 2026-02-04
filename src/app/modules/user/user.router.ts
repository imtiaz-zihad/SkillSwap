import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/create-learner", UserController.createLearner);

export const userRouter = router;
