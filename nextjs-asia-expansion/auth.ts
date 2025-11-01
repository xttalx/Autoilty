import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';

// Mock user database - Replace with Supabase/real DB
const users = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123', // In production, use hashed passwords
    name: 'Test User',
    country: 'SG',
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In production, verify against Supabase/database
        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          country: user.country,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});

