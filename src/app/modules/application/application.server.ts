import { prisma } from "../../shares/prisma";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { SessionStatus } from "../../generated/prisma/enums";

const createApplication = async (
  user: IJWTPayload,
  payload: {
    problemId: string;
    note: string;
  },
) => {
  const instructor = await prisma.instructor.findUnique({
    where: { email: user.email },
  });

  if (!instructor) {
    throw new ApiError(httpStatus.FORBIDDEN, "Instructor profile not found");
  }

  const problemPost = await prisma.problemPost.findUnique({
    where: { id: payload.problemId },
  });

  if (!problemPost || problemPost.status !== "OPEN") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Problem is not open");
  }

  const alreadyApplied = await prisma.application.findFirst({
    where: {
      problemId: payload.problemId,
      instructorId: instructor.id,
    },
  });

  if (alreadyApplied) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already applied");
  }

  return prisma.application.create({
    data: {
      problemId: payload.problemId,
      instructorId: instructor.id,
      note: payload.note,
    },
  });
};

const acceptApplication = async (applicationId: string, user: IJWTPayload) => {
  // 1. Find application with problem & instructor
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      problem: true, // include problem
      instructor: true, // include instructor info
    },
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const problem = application.problem;
  const instructor = application.instructor;

  if (!problem) throw new ApiError(httpStatus.NOT_FOUND, "Problem not found");
  if (!instructor)
    throw new ApiError(httpStatus.NOT_FOUND, "Instructor not found");

  // 2. Verify that the requester is the learner who owns the problem
  const learner = await prisma.learner.findUnique({
    where: { email: user.email },
  });
  if (!learner)
    throw new ApiError(httpStatus.FORBIDDEN, "Learner profile not found");
  if (learner.id !== problem.learnerId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to accept this application",
    );
  }

  // 3. Create ProblemSession
  const session = await prisma.problemSession.create({
    data: {
      problemId: problem.id,
      learnerId: learner.id,
      instructorId: instructor.id,
      status: SessionStatus.PENDING,
      startedAt:new Date(),
      videoCallId: uuidv4(),
    },
  });

  // 4. Update problem status to LOCKED
  await prisma.problemPost.update({
    where: { id: problem.id },
    data: { status: "LOCKED" },
  });

  // 5. Reject all other applications for this problem
  await prisma.application.updateMany({
    where: {
      problemId: problem.id,
      id: { not: applicationId }, // exclude accepted one
    },
    data: { status: "REJECTED" },
  });

  // 6. Update accepted application status to ACCEPTED
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "ACCEPTED" },
  });

  return session;
};
const getAllApplications = async () => {
  return prisma.application.findMany({
    include: {
      problem: {
        select: { id: true, title: true, learnerId: true },
      },
      instructor: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
export const ApplicationService = {
  createApplication,
  acceptApplication,
  getAllApplications,
};
