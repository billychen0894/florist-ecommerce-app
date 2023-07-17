import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import type { NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          accessToken: profile.id_token,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? 'user',
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
    async jwt({ token, user, account, profile }) {
      // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
      // To persist the data to the token, the callback should return a JSON object with the data
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // This callback is called whenever a session is checked (i.e. on any request to Next.js pages)
      // By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
      // jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback
      session.user = token;
      return session;
    },
  },
};
