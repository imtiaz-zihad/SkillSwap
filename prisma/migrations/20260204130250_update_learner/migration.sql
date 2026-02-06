/*
  Warnings:

  - The values [PENDING,ACCEPTED,COMPLETED,CANCELLED] on the enum `IssueStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ratePerMin` on the `instructors` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ONGOING', 'ENDED');

-- CreateEnum
CREATE TYPE "ReviewTarget" AS ENUM ('LEARNER', 'INSTRUCTOR');

-- AlterEnum
BEGIN;
CREATE TYPE "IssueStatus_new" AS ENUM ('OPEN', 'IN_SESSION', 'SOLVED', 'NOT_SOLVED');
ALTER TYPE "IssueStatus" RENAME TO "IssueStatus_old";
ALTER TYPE "IssueStatus_new" RENAME TO "IssueStatus";
DROP TYPE "public"."IssueStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "instructors" DROP COLUMN "ratePerMin";
