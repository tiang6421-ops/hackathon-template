-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_topicId_fkey";

-- DropIndex
DROP INDEX "Favorite_questionId_idx";

-- DropIndex
DROP INDEX "Favorite_userId_questionId_key";

-- DropIndex
DROP INDEX "Option_questionId_order_idx";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "questionId",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "questionId",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "emoji",
DROP COLUMN "name",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_topicId_idx" ON "Favorite"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_topicId_key" ON "Favorite"("userId", "topicId");

-- CreateIndex
CREATE INDEX "Option_topicId_order_idx" ON "Option"("topicId", "order");

-- CreateIndex
CREATE INDEX "Topic_categoryId_order_idx" ON "Topic"("categoryId", "order");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
