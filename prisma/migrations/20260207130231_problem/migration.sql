-- CreateTable
CREATE TABLE "problem_sessions" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "videoCallId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "learnerSolveStatus" "SolveStatus",
    "instructorMarkedCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "problem_sessions_problemId_key" ON "problem_sessions"("problemId");

-- AddForeignKey
ALTER TABLE "problem_sessions" ADD CONSTRAINT "problem_sessions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_sessions" ADD CONSTRAINT "problem_sessions_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_sessions" ADD CONSTRAINT "problem_sessions_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "problem_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "problem_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
