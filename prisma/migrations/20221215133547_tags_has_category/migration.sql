/*
  Warnings:

  - Made the column `category_id` on table `PostTag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PostTag" ALTER COLUMN "category_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "PostCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
