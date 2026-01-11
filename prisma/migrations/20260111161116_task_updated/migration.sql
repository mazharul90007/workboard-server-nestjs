/*
  Warnings:

  - Made the column `assignedById` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assignedToId` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedToId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "assignedById" SET NOT NULL,
ALTER COLUMN "assignedToId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
