/*
  Warnings:

  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."doctor_schedules" DROP CONSTRAINT "doctor_schedules_scheduleId_fkey";

-- DropTable
DROP TABLE "public"."schedules";
