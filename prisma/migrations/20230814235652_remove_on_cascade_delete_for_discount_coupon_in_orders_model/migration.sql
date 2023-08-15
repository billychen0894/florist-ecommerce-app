-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_discountCouponId_fkey";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_discountCouponId_fkey" FOREIGN KEY ("discountCouponId") REFERENCES "discount_coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
