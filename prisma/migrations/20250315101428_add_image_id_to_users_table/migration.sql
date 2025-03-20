-- CreateEnum
CREATE TYPE "ImageProvider" AS ENUM ('DEFAULT', 'OTHER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaImage" TEXT,
ADD COLUMN     "metaKeywords" TEXT[],
ADD COLUMN     "metaTitle" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageId" TEXT,
ADD COLUMN     "imageProvider" "ImageProvider" NOT NULL DEFAULT 'DEFAULT';
