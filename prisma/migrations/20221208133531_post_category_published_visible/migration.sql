-- AlterTable
ALTER TABLE "PostCategory" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
