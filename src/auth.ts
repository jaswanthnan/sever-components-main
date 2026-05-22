import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

type AuthUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || "mock-github-id",
      clientSecret: process.env.GITHUB_SECRET || "mock-github-secret",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        await dbConnect();

        // Support hardcoded admin first for backward compatibility
        if (credentials.username === 'admin' && credentials.password === 'password') {
          return {
            id: 'admin-id',
            name: 'Admin User',
            email: 'admin@hiresync.com',
            role: 'admin'
          };
        }

        // Search in DB
        const user = await User.findOne({
          $or: [
            { username: credentials.username },
            { email: credentials.username }
          ]
        });

        if (!user) {
          throw new Error("No user found with those credentials.");
        }

        // Compare password directly (plain text as registered in register route)
        if (user.password !== credentials.password) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role || 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role || 'user';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as AuthUser;
        sessionUser.role = typeof token.role === 'string' ? token.role : 'user';
        sessionUser.id = typeof token.id === 'string' ? token.id : '';
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "hiresync-very-secret-development-key-32-chars-long-1234",
});
