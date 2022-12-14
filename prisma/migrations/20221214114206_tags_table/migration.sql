-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_name_key" ON "PostTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PostTag_slug_key" ON "PostTag"("slug");

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
