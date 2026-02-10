import { prisma } from "../../shares/prisma";
import { IJWTPayload } from "../../types/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

export const ApplicationService = {
  createApplication,
};
