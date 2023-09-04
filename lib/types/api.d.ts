import {
  orderFormDataSchema,
  orderSummarySchema,
} from '@app/api/orders/ordersPayloadValidation';
import {
  Category,
  Image,
  OrderItem,
  OrderStatus,
  Product,
  ProductDetail,
  ProductDetailItem,
} from '@prisma/client';

export interface ApiResponse<T> {
  success?: boolean;
  data: T | null;
  status?: number;
  error?: string;
  message: string;
}

export interface SignInApiResponse {
  success?: boolean;
  id?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  emailVerifyToken?: string | null;
  image?: string | null;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: number;
  error?: string;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface UpdatedUserData {
  name?: string;
  emailVerified?: boolean;
  emailVerifyToken?: string;
  image?: string;
  password?: string;
}

export interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  emailVerified: Date | null;
  emailVerifyToken: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface sendEmailData {
  email: string;
  emailVerificationToken: string;
  firstName: string;
}

export interface VerifyingEmailData {
  email: string;
  emailVerified?: Date;
  emailVerifyToken: string | null;
}

export interface VerifyingEmailTokenData {
  email: string;
  emailVerifyToken: string;
  emailVerified: boolean;
  emailTokenExpired: boolean;
}

export interface RefreshAccessTokenResponse extends ApiResponse<null> {
  accessToken: string;
}

export interface ProductCommonFields {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  leadTime: string;
}

export interface WishList {
  wishlist: Product[] | [];
}

export type Filter = 'Bouquets' | 'Flowers' | 'Plants' | 'Gifts';
export type Sort =
  | 'Popular'
  | 'Newest'
  | 'Price-low-to-high'
  | 'Price-high-to-low';

export interface OrderPayload {
  formData: yup.InferType<typeof orderFormDataSchema>;
  orderData: yup.InferType<typeof orderSummarySchema>;
}

export interface commonAddressFields {
  addressLine1: string;
  addressLine2?: string;
  company?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalCode: string;
}

export interface FullAddressInfo extends commonAddressFields {
  id: string;
  addressType: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Address = commonAddressFields | FullAddressInfo;

export interface ShippingMethod {
  name: string;
  turnAround: string;
  location: string;
  location_operation_hours: string;
}

export interface DiscountCouponCommonFields {
  description: string;
  discount: number;
  expiresAt: Date;
  numberOfRedemptions: number;
  status: string;
}

export interface DiscountCouponFullInfo extends DiscountCouponCommonFields {
  id: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}
export type DiscountCoupon =
  | DiscountCouponCommonFields
  | DiscountCouponFullInfo;

export interface commonOrderFields {
  id: string;
  orderNumber: string;
  total: number;
  orderStatus: OrderStatus;
  paymentMethod: string;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  orderItems: OrderItem[];
}

export interface OrdersFromUser extends commonOrderFields {
  discountCoupon: DiscountCoupon;
}

export interface SearchOrders extends commonOrderFields {
  contactEmail: string;
  contactPhone: string;
}

export interface OrderFullInfo extends commonOrderFields {
  discountCoupon: DiscountCoupon;
  contactEmail: string;
  contactPhone: string;
}

export type Order = OrdersFromUser | SearchOrders | OrderFullInfo;

export type TProduct = Product & { images: Image[] } & {
  categories: Category[];
} & {
  productDetail: ProductDetail & { productDetailItems: ProductDetailItem[] };
};

export type TOrderItem = OrderItem & { product: TProduct };
export type TCartItem = { id: string; quantity: number; product: TProduct };
