/*
  Warnings:

  - You are about to drop the column `productDetailId` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `product_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `product_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_productDetailId_fkey";

-- DropIndex
DROP INDEX "products_productDetailId_key";

-- AlterTable
ALTER TABLE "product_details" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "productDetailId";

-- CreateIndex
CREATE UNIQUE INDEX "product_details_productId_key" ON "product_details"("productId");

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
