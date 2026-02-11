/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId,reviewerId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Made the column `startedAt` on table `problem_sessions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `reviewerId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerRole` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reviews_sessionId_key";

-- AlterTable
ALTER TABLE "problem_sessions" ALTER COLUMN "startedAt" SET NOT NULL,
ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "updatedAt",
ADD COLUMN     "reviewerId" TEXT NOT NULL,
ADD COLUMN     "reviewerRole" "UserRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_sessionId_reviewerId_key" ON "reviews"("sessionId", "reviewerId");
