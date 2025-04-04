/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Debt` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Debt" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserAccount" ALTER COLUMN "role" DROP DEFAULT;
