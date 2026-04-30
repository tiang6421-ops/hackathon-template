-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "category" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "TopicFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TopicFavorite_topicId_idx" ON "TopicFavorite"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicFavorite_userId_topicId_key" ON "TopicFavorite"("userId", "topicId");

-- CreateIndex
CREATE INDEX "Topic_category_idx" ON "Topic"("category");

-- AddForeignKey
ALTER TABLE "TopicFavorite" ADD CONSTRAINT "TopicFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicFavorite" ADD CONSTRAINT "TopicFavorite_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
