import { prisma } from "../../shares/prisma";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { SessionStatus } from "../../generated/prisma/enums";

const instructorMarkCompleted = async (
  user: IJWTPayload,
  sessionId: string,
) => {
  // 1. Find instructor
  const instructor = await prisma.instructor.findUnique({
    where: { email: user.email },
  });

  if (!instructor) {
    throw new ApiError(httpStatus.FORBIDDEN, "Instructor profile not found");
  }

  // 2. Find session
  const session = await prisma.problemSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session not found");
  }

  // 3. Ownership check
  if (session.instructorId !== instructor.id) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "This session is not assigned to you",
    );
  }

  // 4. Prevent double mark
  if (session.instructorMarkedCompleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Session already marked completed",
    );
  }

  // 5. Update session
  const updatedSession = await prisma.problemSession.update({
    where: { id: sessionId },
    data: {
      instructorMarkedCompleted: true,
      status: SessionStatus.COMPLETED,
    },
  });

  return updatedSession;
};

// const learnerFeedback = async (
//   user: IJWTPayload,
//   sessionId: string,
//   solveStatus: "SOLVED" | "NOT_SOLVED",
// ) => {
//   // 1. Find learner
//   const learner = await prisma.learner.findUnique({
//     where: { email: user.email },
//   });

//   if (!learner)
//     throw new ApiError(httpStatus.FORBIDDEN, "Learner profile not found");

//   // 2. Find session with problem & instructor
//   const session = await prisma.problemSession.findUnique({
//     where: { id: sessionId },
//     include: { problem: true, instructor: true },
//   });

//   if (!session) throw new ApiError(httpStatus.NOT_FOUND, "Session not found");

//   // 3. Ownership check
//   if (session.learnerId !== learner.id)
//     throw new ApiError(httpStatus.FORBIDDEN, "This is not your session");

//   // 4. Instructor must complete first
//   if (!session.instructorMarkedCompleted)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "Instructor has not completed the session yet",
//     );

//   // 5. Prevent double submit
//   if (session.learnerSolveStatus)
//     throw new ApiError(httpStatus.BAD_REQUEST, "Feedback already submitted");

//   // 6. Update session
//   const updatedSession = await prisma.problemSession.update({
//     where: { id: sessionId },
//     data: {
//       learnerSolveStatus: solveStatus,
//       status: solveStatus === "SOLVED" ? "COMPLETED" : "FAILED",
//       endedAt: new Date(),
//     },
//   });

//   // 7. Coin transfer if solved
//   if (solveStatus === "SOLVED") {
//     // Get learner's user ID
//     const learnerUser = await prisma.user.findUnique({
//       where: { email: learner.email },
//     });
//     if (!learnerUser)
//       throw new ApiError(httpStatus.NOT_FOUND, "Learner user not found");

//     // Get instructor's user ID
//     const instructorUser = await prisma.user.findUnique({
//       where: { email: session.instructor.email },
//     });
//     if (!instructorUser)
//       throw new ApiError(httpStatus.NOT_FOUND, "Instructor user not found");

//     // Transfer coins atomically
//     await prisma.$transaction([
//       prisma.user.update({
//         where: { id: instructorUser.id },
//         data: { coins: { increment: session.problem.coinReward } },
//       }),
//       prisma.coinTransaction.create({
//         data: {
//           fromUserId: learnerUser.id,
//           toUserId: instructorUser.id,
//           sessionId: session.id,
//           amount: session.problem.coinReward,
//         },
//       }),
//     ]);
//   }

//   return updatedSession;
// };

const learnerFeedback = async (
  user: IJWTPayload,
  sessionId: string,
  solveStatus: "SOLVED" | "NOT_SOLVED",
) => {
  // 1. Find learner
  const learner = await prisma.learner.findUnique({
    where: { email: user.email },
  });

  if (!learner)
    throw new ApiError(httpStatus.FORBIDDEN, "Learner profile not found");

  // 2. Find session with problem & instructor
  const session = await prisma.problemSession.findUnique({
    where: { id: sessionId },
    include: { problem: true, instructor: true },
  });

  if (!session) throw new ApiError(httpStatus.NOT_FOUND, "Session not found");

  // 3. Ownership check
  if (session.learnerId !== learner.id)
    throw new ApiError(httpStatus.FORBIDDEN, "This is not your session");

  // 4. Instructor must complete first
  if (!session.instructorMarkedCompleted)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Instructor has not completed the session yet",
    );

  // 5. Prevent double submit
  if (session.learnerSolveStatus)
    throw new ApiError(httpStatus.BAD_REQUEST, "Feedback already submitted");

  // 6. Update session
  const updatedSession = await prisma.problemSession.update({
    where: { id: sessionId },
    data: {
      learnerSolveStatus: solveStatus,
      status:
        solveStatus === "SOLVED"
          ? SessionStatus.COMPLETED
          : SessionStatus.FAILED,
      endedAt: new Date(),
    },
  });


  //  CASE 1: SOLVED → Coin transfer

  if (solveStatus === "SOLVED") {
    const learnerUser = await prisma.user.findUnique({
      where: { email: learner.email },
    });

    const instructorUser = await prisma.user.findUnique({
      where: { email: session.instructor.email },
    });

    if (!learnerUser || !instructorUser)
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    await prisma.$transaction([
      prisma.user.update({
        where: { id: instructorUser.id },
        data: { coins: { increment: session.problem.coinReward } },
      }),
      prisma.coinTransaction.create({
        data: {
          fromUserId: learnerUser.id,
          toUserId: instructorUser.id,
          sessionId: session.id,
          amount: session.problem.coinReward,
        },
      }),
    ]);
  }


  // CASE 2: NOT_SOLVED → Reopen Problem

  if (solveStatus === "NOT_SOLVED") {
    await prisma.$transaction([
      // Reopen problem
      prisma.problemPost.update({
        where: { id: session.problemId },
        data: { status: "OPEN" },
      }),


    ]);
  }

  return updatedSession;
};

export const SessionService = {
  learnerFeedback,
  instructorMarkCompleted,
};
