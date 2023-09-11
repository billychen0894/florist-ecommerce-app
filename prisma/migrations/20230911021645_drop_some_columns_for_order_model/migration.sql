/*
  Warnings:

  - You are about to drop the column `addressType` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `discountCouponId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingMethodId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `discount_coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipping_methods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_discountCouponId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shippingMethodId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "addressType";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "discountCouponId",
DROP COLUMN "paymentMethod",
DROP COLUMN "shippingMethodId";

-- DropTable
DROP TABLE "discount_coupons";

-- DropTable
DROP TABLE "shipping_methods";

-- DropEnum
DROP TYPE "AddressType";

-- DropEnum
DROP TYPE "CouponStatus";

-- DropEnum
DROP TYPE "PaymentMethod";
