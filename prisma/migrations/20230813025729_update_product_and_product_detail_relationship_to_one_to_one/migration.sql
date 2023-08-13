/*
  Warnings:

  - A unique constraint covering the columns `[productDetailId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_productDetailId_key" ON "products"("productDetailId");
