/*
  Warnings:

  - You are about to drop the column `productId` on the `product_details` table. All the data in the column will be lost.
  - Added the required column `productDetailId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_details" DROP CONSTRAINT "product_details_productId_fkey";

-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "productDetailId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productDetailId_fkey" FOREIGN KEY ("productDetailId") REFERENCES "product_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
