-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shippingAddressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
