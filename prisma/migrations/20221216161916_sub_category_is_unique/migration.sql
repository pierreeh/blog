/*
  Warnings:

  - You are about to drop the `PostSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subcategory_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostSubCategory" DROP CONSTRAINT "PostSubCategory_post_id_fkey";

-- DropForeignKey
ALTER TABLE "PostSubCategory" DROP CONSTRAINT "PostSubCategory_tag_id_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "subcategory_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "PostSubCategory";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
