-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');

-- AlterTable
ALTER TABLE "discount_coupons" ADD COLUMN     "status" "CouponStatus" NOT NULL DEFAULT 'UNUSED';
