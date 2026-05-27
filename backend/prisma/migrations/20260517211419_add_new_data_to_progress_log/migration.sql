/*
  Warnings:

  - Added the required column `finishedAyah` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finishedSurah` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `juz` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAyah` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedSurah` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeFinished` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStarted` to the `ProgressLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressLog" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "finishedAyah" INTEGER NOT NULL,
ADD COLUMN     "finishedSurah" TEXT NOT NULL,
ADD COLUMN     "juz" TEXT NOT NULL,
ADD COLUMN     "startedAyah" INTEGER NOT NULL,
ADD COLUMN     "startedSurah" TEXT NOT NULL,
ADD COLUMN     "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "timeFinished" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeStarted" TIMESTAMP(3) NOT NULL;
