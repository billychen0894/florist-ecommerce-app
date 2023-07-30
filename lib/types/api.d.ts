export interface ApiResponse<T> {
  success?: boolean;
  data: T | null;
  status?: number;
  error?: string;
  message?: string;
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
