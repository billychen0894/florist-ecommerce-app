import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import type { NextAuthOptions, TokenSet } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      // profile(profile: GoogleProfile) {
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     firstName: profile.given_name,
      //     lastName: profile.family_name,
      //     accessToken: profile.id_token,
      //     email: profile.email,
      //     image: profile.picture,
      //     role: profile.role ?? 'user',
      //   };
      // },
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
        if (res.ok && user.success && user.data) {
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
            access_token: account?.access_token,
            expires_at: account?.expires_at,
            refresh_token: account?.refresh_token,
            role: 'user',
          };
        } else {
          try {
            // TODO: validate this implementation
            // https://accounts.google.com/.well-known/openid-configuration
            // We need the `token_endpoint`.
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
                  refresh_token: token.refresh_token as string,
                }),
                method: 'POST',
              }
            );

            const tokens: TokenSet = await response.json();

            if (!response.ok) throw tokens;

            return {
              ...token, // Keep the previous token properties
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens?.expires_at!),
              // Fall back to old refresh token, but note that
              // many providers may only allow using a refresh token once.
              refresh_token: tokens.refresh_token ?? token.refresh_token,
            };
          } catch (error) {
            console.error('Error refreshing access token', error);
            // The error property will be used client-side to handle the refresh token error
            return { ...token, error: 'RefreshAccessTokenError' as const };
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
      // session.user.accessToken = token.accessToken;
      // session.user.id = token.id;
      // console.log('session', session);
      // console.log('token', token);
      // console.log('user', user);
      return { ...session, ...token, ...user };
    },
  },
};
