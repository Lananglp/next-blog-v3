-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "replyToUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyToUserId_fkey" FOREIGN KEY ("replyToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
