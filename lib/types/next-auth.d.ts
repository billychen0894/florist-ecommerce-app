import 'next-auth';

// Module augmentation to extend the user props in the session object based on the DefaultSession type from next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      accessToken: string;
    } & DefaultSession['user'];
  }
}
