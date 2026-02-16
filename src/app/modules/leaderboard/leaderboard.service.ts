import { prisma } from "../../shares/prisma";

const getInstructorLeaderboardFromDB = async () => {
  const instructors = await prisma.instructor.findMany({
    where: { isDeleted: false },
    include: {
      sessions: {
        where: { status: "COMPLETED" },
      },
    },
  });

  const leaderboard = instructors.map((inst) => ({
    id: inst.id,
    name: inst.name,
    profilePhoto: inst.profilePhoto,
    averageRating: inst.averageRating,
    completedSessions: inst.sessions.length,
  }));

  const sorted = leaderboard.sort((a, b) => {
    if (b.averageRating !== a.averageRating) {
      return b.averageRating - a.averageRating;
    }
    return b.completedSessions - a.completedSessions;
  });

  return sorted.slice(0, 10).map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
};

const getLearnerLeaderboardFromDB = async () => {
  const learners = await prisma.learner.findMany({
    where: { isDeleted: false },
    include: {
      sessions: {
        where: { status: "COMPLETED" },
      },
    },
  });

  const leaderboard = learners.map((learner) => ({
    id: learner.id,
    name: learner.name,
    profilePhoto: learner.profilePhoto,
    averageRating: learner.averageRating,
    completedSessions: learner.sessions.length,
  }));

  const sorted = leaderboard.sort((a, b) => {
    if (b.averageRating !== a.averageRating) {
      return b.averageRating - a.averageRating;
    }
    return b.completedSessions - a.completedSessions;
  });

  return sorted.slice(0, 10).map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
};

export const LeaderboardService = {
  getInstructorLeaderboardFromDB,
  getLearnerLeaderboardFromDB,
};
