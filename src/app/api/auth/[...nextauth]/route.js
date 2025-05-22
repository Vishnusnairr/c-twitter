import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser, getUserByEmail } from "@/lib/db/users";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // use env vars here
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 6000,
    updateAge: 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async signIn({ user }) {
      const existingUser = await getUserByEmail(user.email);
      if (!existingUser) {
        await createUser({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
