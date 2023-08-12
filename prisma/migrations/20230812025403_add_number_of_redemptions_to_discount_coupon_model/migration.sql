/*
  Warnings:

  - The values [UNUSED,USED] on the enum `CouponStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CouponStatus_new" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'EXPIRED');
ALTER TABLE "discount_coupons" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "discount_coupons" ALTER COLUMN "status" TYPE "CouponStatus_new" USING ("status"::text::"CouponStatus_new");
ALTER TYPE "CouponStatus" RENAME TO "CouponStatus_old";
ALTER TYPE "CouponStatus_new" RENAME TO "CouponStatus";
DROP TYPE "CouponStatus_old";
ALTER TABLE "discount_coupons" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterTable
ALTER TABLE "discount_coupons" ADD COLUMN     "numberOfRedemptions" INTEGER NOT NULL DEFAULT 20,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
