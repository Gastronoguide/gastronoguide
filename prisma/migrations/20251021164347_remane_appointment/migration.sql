/*
  Warnings:

  - You are about to drop the column `participantEmail` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `participantFirstName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `participantLastName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `participantPhone` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `email` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "participantEmail",
DROP COLUMN "participantFirstName",
DROP COLUMN "participantLastName",
DROP COLUMN "participantPhone",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
