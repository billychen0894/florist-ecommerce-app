import axios from '@lib/axios';
import { ApiResponse, DiscountCoupon } from '@lib/types/api';
import { AxiosInstance } from 'axios';

async function getCouponByCouponNumber(
  couponNumber: string
): Promise<ApiResponse<DiscountCoupon>> {
  const response = (await axios.get(
    `/discount-coupons/${couponNumber}`
  )) as ApiResponse<DiscountCoupon>;
  return response;
}

async function createCoupons(
  couponsData: DiscountCoupon[],
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<DiscountCoupon[]>> {
  const response = (await axiosWithAuth.post(`/discount-coupons`, {
    coupons: couponsData,
  })) as ApiResponse<DiscountCoupon[]>;
  return response;
}

async function updateCoupon(
  couponData: DiscountCoupon,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<DiscountCoupon>> {
  const response = (await axiosWithAuth.put(`/discount-coupons`, {
    ...couponData,
  })) as ApiResponse<DiscountCoupon>;
  return response;
}

export const discountCoupons = {
  getCouponByCouponNumber,
  createCoupons,
  updateCoupon,
};
