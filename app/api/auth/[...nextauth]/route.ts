import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Simple credentials-based auth for admin access.
// In production, store users in a database and hash passwords.
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'password123';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        if (username === ADMIN_USER && password === ADMIN_PASS) {
          return { id: '1', name: username, email: `${username}@local` };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin'
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
