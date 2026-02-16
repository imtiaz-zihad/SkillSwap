import { prisma } from "../../shares/prisma";
import { IJWTPayload } from "../../types/common";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const getLearnerDashboard = async (user: IJWTPayload) => {
  // 1. Find learner
  const learner = await prisma.learner.findUnique({
    where: { email: user.email },
  });
  if (!learner) throw new ApiError(httpStatus.NOT_FOUND, "Learner not found");

  // 2. Average rating
  const avgRatingResult = await prisma.review.aggregate({
    where: { learnerId: learner.id },
    _avg: { rating: true },
  });

  // 3. Coins spent
  const learnerUser = await prisma.user.findUnique({ where: { email: learner.email } });
  const coinsSpentResult = await prisma.coinTransaction.aggregate({
    where: { fromUserId: learnerUser?.id },
    _sum: { amount: true },
  });

  // 4. Completed and failed sessions
  const sessionCounts = await prisma.problemSession.groupBy({
    by: ["status"],
    where: { learnerId: learner.id },
    _count: { status: true },
  });

  // 5. Reviews
  const reviewGivenCount = await prisma.review.count({
    where: { reviewerId: learner.id, reviewerRole: "LEARNER" },
  });
  const reviewGotCount = await prisma.review.count({
    where: { learnerId: learner.id },
  });

  return {
    learner: {
      id: learner.id,
      name: learner.name,
      email: learner.email,
    },
    averageRating: avgRatingResult._avg.rating || 0,
    totalCoinsSpent: coinsSpentResult._sum.amount || 0,
    completedSessions: sessionCounts.find(s => s.status === "COMPLETED")?._count.status || 0,
    failedSessions: sessionCounts.find(s => s.status === "FAILED")?._count.status || 0,
    ongoingSessions: sessionCounts.find(s => s.status === "PENDING")?._count.status || 0,
    reviewGiven: reviewGivenCount,
    reviewGot: reviewGotCount,
  };
};

const getInstructorDashboard = async (user: IJWTPayload) => {
  // 1. Find instructor
  const instructor = await prisma.instructor.findUnique({
    where: { email: user.email },
  });
  if (!instructor) throw new ApiError(httpStatus.NOT_FOUND, "Instructor not found");

  // 2. Average rating
  const avgRatingResult = await prisma.review.aggregate({
    where: { instructorId: instructor.id },
    _avg: { rating: true },
  });

  // 3. Coins earned
  const instructorUser = await prisma.user.findUnique({ where: { email: instructor.email } });
  const coinsEarnedResult = await prisma.coinTransaction.aggregate({
    where: { toUserId: instructorUser?.id },
    _sum: { amount: true },
  });

  // 4. Completed and failed sessions
  const sessionCounts = await prisma.problemSession.groupBy({
    by: ["status"],
    where: { instructorId: instructor.id },
    _count: { status: true },
  });

  // 5. Reviews
  const reviewGivenCount = await prisma.review.count({
    where: { reviewerId: instructor.id, reviewerRole: "INSTRUCTOR" },
  });
  const reviewGotCount = await prisma.review.count({
    where: { instructorId: instructor.id },
  });

  return {
    instructor: {
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
    },
    averageRating: avgRatingResult._avg.rating || 0,
    totalCoinsEarned: coinsEarnedResult._sum.amount || 0,
    completedSessions: sessionCounts.find(s => s.status === "COMPLETED")?._count.status || 0,
    failedSessions: sessionCounts.find(s => s.status === "FAILED")?._count.status || 0,
    ongoingSessions: sessionCounts.find(s => s.status === "PENDING")?._count.status || 0,
    reviewGiven: reviewGivenCount,
    reviewGot: reviewGotCount,
  };
};

export const DashboardService = {
  getLearnerDashboard,
  getInstructorDashboard,
};
