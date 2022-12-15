/*
  Warnings:

  - You are about to drop the column `featured_image` on the `Post` table. All the data in the column will be lost.
  - Added the required column `body` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "featured_image",
ADD COLUMN     "image" TEXT,
DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;
