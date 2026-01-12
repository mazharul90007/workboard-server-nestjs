/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `tasks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tasks_assignedToId_isDeleted_status_idx";

-- DropIndex
DROP INDEX "tasks_isDeleted_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted";

-- CreateIndex
CREATE INDEX "tasks_assignedToId_status_idx" ON "tasks"("assignedToId", "status");
