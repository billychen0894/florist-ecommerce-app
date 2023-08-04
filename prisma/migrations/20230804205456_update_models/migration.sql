/*
  Warnings:

  - The values [PENDING] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `items` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the `credit_cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('CREATED', 'PROCESSING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "orders" ALTER COLUMN "orderStatus" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "orderStatus" TYPE "OrderStatus_new" USING ("orderStatus"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "orderStatus" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "credit_cards" DROP CONSTRAINT "credit_cards_userId_fkey";

-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "items",
DROP COLUMN "name";

-- DropTable
DROP TABLE "credit_cards";

-- CreateTable
CREATE TABLE "product_detail_items" (
    "id" TEXT NOT NULL,
    "productDetailItemName" TEXT,
    "items" TEXT[],
    "productDetailId" TEXT NOT NULL,

    CONSTRAINT "product_detail_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_detail_items" ADD CONSTRAINT "product_detail_items_productDetailId_fkey" FOREIGN KEY ("productDetailId") REFERENCES "product_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
