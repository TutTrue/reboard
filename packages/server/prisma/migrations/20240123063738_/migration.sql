/*
  Warnings:

  - You are about to drop the column `profilePirctureURL` on the `User` table. All the data in the column will be lost.
  - Added the required column `profilePictureURL` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePirctureURL",
ADD COLUMN     "profilePictureURL" TEXT NOT NULL;
