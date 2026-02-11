import { Request } from "express";
import { prisma } from "../../shares/prisma";
import { fileUploader } from "../../helper/fileUploder";
import { IJWTPayload } from "../../types/common";

type CreateIssuePayload = {
  title: string;
  description: string;
  image?: string;
  requiredSkill: string;
  coinReward: number;
};

const createIssue = async (user: IJWTPayload, payload: CreateIssuePayload) => {
  const learner = await prisma.learner.findUnique({
    where: {
      email: user.email,
    },
    include: { user: true }, // Check User Coin
  });

  if (!learner) {
    throw new Error("Learner profile not found");
  }

  if (learner.user.coins < payload.coinReward) {
    throw new Error(
      `Insufficient coins. You have ${learner.user.coins} coins, but need ${payload.coinReward}`,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Deduct coins from User
    await tx.user.update({
      where: { id: learner.user.id },
      data: {
        coins: { decrement: payload.coinReward },
      },
    });

    // Create problem post
    return await tx.problemPost.create({
      data: {
        title: payload.title,
        description: payload.description,
        image: payload.image,
        requiredSkill: payload.requiredSkill,
        coinReward: payload.coinReward,
        learnerId: learner.id,
      },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });

  console.log(result);

  return result;
};

const getOpenIssues = async () => {
  return prisma.problemPost.findMany({
    where: { status: "OPEN" },
    include: {
      learner: {
        select: {
          id: true,
          name: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getMyIssues = async (learnerEmail: string) => {
  const learner = await prisma.learner.findUnique({
    where: { email: learnerEmail },
  });

  if (!learner) {
    throw new Error("Learner profile not found");
  }

  const result = await prisma.problemPost.findMany({
    where: {
      learnerId: learner.id,
    },
    include: {
      learner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleIssue = async (id: string) => {
  const result = await prisma.problemPost.findUnique({
    where: { id },
    include: {
      learner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Issue not found");
  }

  return result;
};

export const IssueService = {
  createIssue,
  getOpenIssues,
  getMyIssues,
  getSingleIssue,
};
