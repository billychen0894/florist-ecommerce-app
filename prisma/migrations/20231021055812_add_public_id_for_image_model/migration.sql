/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "images_publicId_key" ON "images"("publicId");
