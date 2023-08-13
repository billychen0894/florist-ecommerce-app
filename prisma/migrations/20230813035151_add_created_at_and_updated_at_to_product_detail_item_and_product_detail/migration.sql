/*
  Warnings:

  - Added the required column `updatedAt` to the `product_detail_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_detail_items" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_details" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
