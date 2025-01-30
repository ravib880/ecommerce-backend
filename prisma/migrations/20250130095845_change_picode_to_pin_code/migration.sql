/*
  Warnings:

  - You are about to drop the column `pincode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pincode",
ADD COLUMN     "pinCode" TEXT;
