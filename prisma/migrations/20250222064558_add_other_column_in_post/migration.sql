/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentStatus` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featuredImage` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISH', 'DRAFT', 'PRIVATE');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "commentStatus" "CommentStatus" NOT NULL,
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "featuredImage" TEXT NOT NULL,
ADD COLUMN     "meta" JSONB NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "PostStatus" NOT NULL,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "content" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
