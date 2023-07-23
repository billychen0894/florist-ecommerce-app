import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import type { NextAuthOptions, TokenSet } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

interface Tokens extends TokenSet {
  expires_in: number;
}

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email adress', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Fetch user data from POST /api/signin with credentials supplied in parameters
        const res = await fetch(`${baseUrl}/api/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();
        // If no error and we have user data, return it
        if (res.ok && user.success) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  session: {
    strategy: 'jwt',
  },
  // NextAuth callback functions
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   if (account?.provider === 'google') {
    //     user.image = profile?.image;
    //   }
    //   if (credentials) {
    //     console.log('credentials', credentials);
    //     return true;
    //   }
    //   return true;
    // },
    async jwt({ token, user, account, profile }) {
      // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
      // To persist the data to the token, the callback should return a JSON object with the data
      if (account?.provider === 'google') {
        if (account?.expires_at && Date.now() < account?.expires_at * 1000) {
          return {
            ...token,
            id: user?.id,
            picture: profile?.picture,
            access_token: account?.access_token,
            expires_at: account?.expires_at,
            refresh_token: account?.refresh_token,
            role: 'user',
          };
        } else {
          try {
            // Hit the refresh token endpoint to get a new access token
            const response = await fetch(
              'https://oauth2.googleapis.com/token',
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  client_id: process.env.GOOGLE_CLIENT_ID as string,
                  client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                  grant_type: 'refresh_token',
                  refresh_token: account?.refresh_token as string,
                }),
                method: 'POST',
              }
            );

            const tokens: Tokens = await response.json();
            const { access_token, expires_in, refresh_token } = tokens;

            if (!response.ok) throw tokens;

            return {
              ...token, // Keep the previous token properties
              id: user?.id,
              picture: profile?.picture,
              access_token,
              expires_at: Date.now() + expires_in * 1000,
              // Fall back to old refresh token, but note that
              // many providers may only allow using a refresh token once.
              refresh_token: refresh_token ?? account.refresh_token,
              role: 'user',
            };
          } catch (error) {
            console.error('Error refreshing access token', error);
            // The error property will be used client-side to handle the refresh token error
            return {
              ...token,
              ...account,
              error: 'RefreshAccessTokenError' as const,
            };
          }
        }
      } else {
        return { ...token, ...user };
      }
    },
    async session({ session, token, user }) {
      // This callback is called whenever a session is checked (i.e. on any request to Next.js pages)
      // By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
      // jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback
      session.user.id = token?.id;
      session.user.accessToken = token.access_token ?? token.accessToken;
      session.user.refreshToken = token.refresh_token;
      session.user.expiresAt = token.expires_at ?? token.exp;
      session.user.role = token.role ?? 'user';
      return { ...session };
    },
  },
};
