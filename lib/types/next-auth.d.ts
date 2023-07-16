import 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// Module augmentation to extend the user props in the session object based on the DefaultSession type from next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
