/*
  Warnings:

  - A unique constraint covering the columns `[stripeInvoiceId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stripeInvoiceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripeInvoiceId_key" ON "orders"("stripeInvoiceId");
