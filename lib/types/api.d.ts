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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  inStock: boolean;
  leadTime: string;
  shippingDetails: string;
  productDetailId: string;
}

export interface WishList {
  wishList: Product[] | [];
}

export type Filter = 'Bouquets' | 'Flowers' | 'Plants' | 'Gifts';
export type Sort =
  | 'Popular'
  | 'Newest'
  | 'Price-low-to-high'
  | 'Price-high-to-low';

export interface Categories {
  id: string;
  name: string;
}
