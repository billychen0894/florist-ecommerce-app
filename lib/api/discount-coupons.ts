import axios from '@lib/axios';
import { ApiResponse, DiscountCoupon } from '@lib/types/api';
import { AxiosInstance } from 'axios';

async function getCouponByCouponNumber(
  couponNumber: string
): Promise<ApiResponse<DiscountCoupon>> {
  const response = (await axios.get(
    `/api/discount-coupons/${couponNumber}`
  )) as ApiResponse<DiscountCoupon>;
  return response;
}

async function updateCouponByCouponNumber(
  couponNumber: string,
  couponData: DiscountCoupon,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<DiscountCoupon>> {
  const response = (await axiosWithAuth.put(
    `/api/discount-coupons/${couponNumber}`,
    {
      ...couponData,
    }
  )) as ApiResponse<DiscountCoupon>;
  return response;
}

export const discountCoupons = {
  getCouponByCouponNumber,
  updateCouponByCouponNumber,
};
