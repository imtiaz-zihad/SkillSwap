/*
  Warnings:

  - The values [ONGOING,DISPUTED] on the enum `SessionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SessionStatus_new" AS ENUM ('SCHEDULED', 'PENDING', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."problem_sessions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "problem_sessions" ALTER COLUMN "status" TYPE "SessionStatus_new" USING ("status"::text::"SessionStatus_new");
ALTER TYPE "SessionStatus" RENAME TO "SessionStatus_old";
ALTER TYPE "SessionStatus_new" RENAME TO "SessionStatus";
DROP TYPE "public"."SessionStatus_old";
ALTER TABLE "problem_sessions" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;
