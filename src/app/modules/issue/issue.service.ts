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

// const getOpenIssues = async () => {
//   return prisma.issue.findMany({
//     where: { status: "OPEN" },
//     include: {
//       learner: {
//         select: {
//           id: true,
//           name: true,
//           profilePhoto: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };

// const getMyIssues = async (learnerId: string) => {
//   return prisma.issue.findMany({
//     where: { learnerId },
//     orderBy: { createdAt: "desc" },
//   });
// };

// const getSingleIssue = async (id: string) => {
//   return prisma.issue.findUnique({
//     where: { id },
//     include: {
//       learner: {
//         select: {
//           id: true,
//           name: true,
//           profilePhoto: true,
//         },
//       },
//     },
//   });
// };

export const IssueService = {
  createIssue,
  //   getOpenIssues,
  //   getMyIssues,
  //   getSingleIssue,
};
