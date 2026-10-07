import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "eiQSVr4Q040K2XfYhxkVf/fVFjUfEWOBaGDyKSnDUD0=",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        try {
          // 1. Authenticate with backend /api/auth/login
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim(),
              password: credentials.password,
            }),
          });

          const json = await res.json();

          if (res.ok && json?.data?.token) {
            const userData = json.data.user || {};
            return {
              id: userData.id || `admin-${Date.now()}`,
              name: userData.name || credentials.email.split("@")[0],
              email: credentials.email.trim(),
              role: userData.role || "ADMIN",
              token: json.data.token,
            };
          }

          // 2. Fallback to /api/auth/jwt for master admin bootstrap
          const fbRes = await fetch(`${BACKEND_URL}/api/auth/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.trim(),
              name: "Brain Bari Admin",
              role: "ADMIN",
              password: credentials.password,
            }),
          });

          const fbJson = await fbRes.json();
          if (fbJson?.data?.token) {
            return {
              id: "admin-master",
              name: "Brain Bari Admin",
              email: credentials.email.trim(),
              role: "ADMIN",
              token: fbJson.data.token,
            };
          }

          throw new Error(json?.message || "Invalid credentials.");
        } catch (err: any) {
          console.error("[NextAuth Authorize Error]:", err.message || err);
          throw new Error(err.message || "Failed to authenticate.");
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "ADMIN";
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "ADMIN";
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
