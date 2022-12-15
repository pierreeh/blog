/*
  Warnings:

  - Made the column `color` on table `PostCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PostCategory" ALTER COLUMN "color" SET NOT NULL;
