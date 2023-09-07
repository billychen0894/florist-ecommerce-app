declare namespace NodeJS {
  export interface ProcessEnv {
    APP_BASE_URL: string;
    NEXTAUTH_URL: string;
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    EMAIL_USER_NAME: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_PORT: string;
    EMAIL_FROM: string;
    STRIPE_SECRET_KEY: string;
  }
}
