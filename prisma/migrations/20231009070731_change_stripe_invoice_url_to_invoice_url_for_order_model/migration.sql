/*
  Warnings:

  - You are about to drop the column `stripeInvoiceUrl` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceUrl]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "stripeInvoiceUrl",
ADD COLUMN     "invoiceUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_invoiceUrl_key" ON "orders"("invoiceUrl");
