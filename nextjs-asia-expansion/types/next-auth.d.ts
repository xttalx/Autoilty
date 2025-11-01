import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      email?: string;
      name?: string;
      image?: string;
      country?: string;
    };
  }

  interface User {
    id: string;
    username?: string;
    email?: string;
    name?: string;
    image?: string;
    country?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    country?: string;
  }
}

