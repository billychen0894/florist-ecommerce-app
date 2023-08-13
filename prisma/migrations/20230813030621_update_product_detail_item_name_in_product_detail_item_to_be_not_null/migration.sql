/*
  Warnings:

  - Made the column `productDetailItemName` on table `product_detail_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_detail_items" ALTER COLUMN "productDetailItemName" SET NOT NULL;
