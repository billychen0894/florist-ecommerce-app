import { auth } from '@lib/api/auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email adress', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const data = await auth.signIn(credentials);
        if (data.status === 200 && data.data.success) {
          return data.data as any;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  // NextAuth callback functions
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
      // To persist the data to the token, the callback should return a JSON object with the data
      if (trigger === 'update' && session) {
        token.accessToken = session?.accessToken as string;
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // This callback is called whenever a session is checked (i.e. on any request to Next.js pages)
      // By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
      // jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback
      session.user.id = token?.id;
      session.user.stripeCustomerId = token?.stripeCustomerId;
      session.user.cloudinaryPublicId = token?.cloudinaryPublicId;
      session.user.phone = token?.phone;
      session.user.accessToken = token.access_token ?? token.accessToken;
      session.user.refreshToken = token.refresh_token ?? token.refreshToken;
      session.user.expiresAt = token.expires_at ?? token.exp;
      session.user.role = token.role ?? 'user';
      return { ...session };
    },
  },
};
