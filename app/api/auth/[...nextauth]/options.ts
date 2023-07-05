import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
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
        if (user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  // NextAuth callback functions
  callbacks: {
    async jwt({ token, user, account }) {
      // This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
      // To persist the data to the token, the callback should return a JSON object with the data
      console.log('jwt callback', token, user, account);
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // This callback is called whenever a session is checked (i.e. on any request to Next.js pages)
      // By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
      // jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback
      console.log('session callback', session, token, user);
      session.user = token as any;
      return session;
    },
  },
};
