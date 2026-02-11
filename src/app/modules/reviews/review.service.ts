import { prisma } from "../../shares/prisma";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { UserRole, SessionStatus } from "../../generated/prisma/enums";

const createReview = async (
  user: IJWTPayload,
  sessionId: string,
  payload: { rating: number; comment?: string }
) => {
  // 1. Find user (learner or instructor)
  let reviewerId: string;
  if (user.role === UserRole.LEARNER) {
    const learner = await prisma.learner.findUnique({ where: { email: user.email } });
    if (!learner) throw new ApiError(httpStatus.FORBIDDEN, "Learner profile not found");
    reviewerId = learner.id;
  } else if (user.role === UserRole.INSTRUCTOR) {
    const instructor = await prisma.instructor.findUnique({ where: { email: user.email } });
    if (!instructor) throw new ApiError(httpStatus.FORBIDDEN, "Instructor profile not found");
    reviewerId = instructor.id;
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, "Only learner or instructor can review");
  }

  // 2. Find session with learner & instructor
  const session = await prisma.problemSession.findUnique({
    where: { id: sessionId },
    include: { learner: true, instructor: true },
  });
  if (!session) throw new ApiError(httpStatus.NOT_FOUND, "Session not found");

  // 3. Check ownership
  if (user.role === UserRole.LEARNER && session.learnerId !== reviewerId)
    throw new ApiError(httpStatus.FORBIDDEN, "This is not your session");
  if (user.role === UserRole.INSTRUCTOR && session.instructorId !== reviewerId)
    throw new ApiError(httpStatus.FORBIDDEN, "This session is not assigned to you");

  // 4. Session must be completed
  if (session.status !== SessionStatus.COMPLETED)
    throw new ApiError(httpStatus.BAD_REQUEST, "Session not completed yet");

  // 5. Prevent duplicate review
  const existingReview = await prisma.review.findUnique({
    where: { sessionId_reviewerId: { sessionId, reviewerId } },
  });
  if (existingReview)
    throw new ApiError(httpStatus.BAD_REQUEST, "You already submitted a review for this session");

  // 6. Create review
  const review = await prisma.review.create({
    data: {
      sessionId,
      reviewerId,
      reviewerRole: user.role,
      rating: payload.rating,
      comment: payload.comment,
      learnerId: session.learnerId,
      instructorId: session.instructorId,
    },
  });

  // 7. Optional: Update average rating of instructor
// After creating the review
if (user.role === UserRole.LEARNER) {
  // Learner reviewed instructor → update instructor avg
  const reviews = await prisma.review.findMany({ where: { instructorId: session.instructorId } });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await prisma.instructor.update({ where: { id: session.instructorId }, data: { averageRating: avg } });
} else if (user.role === UserRole.INSTRUCTOR) {
  // Instructor reviewed learner → update learner avg
  const reviews = await prisma.review.findMany({ where: { learnerId: session.learnerId } });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await prisma.learner.update({ where: { id: session.learnerId }, data: { averageRating: avg } });
}


  return review;
};

export const ReviewService = {
  createReview,
};
