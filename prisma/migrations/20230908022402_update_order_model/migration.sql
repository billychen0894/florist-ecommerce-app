-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "shippingMethodId" DROP NOT NULL,
ALTER COLUMN "shippingAddressId" DROP NOT NULL,
ALTER COLUMN "billingAddressId" DROP NOT NULL;
