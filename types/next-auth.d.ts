import { StaffRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    role: StaffRole;
  }
  interface Session {
    user: {
      staffId: string;
      role: StaffRole;
      email: string;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: StaffRole;
    staffId: string;
  }
}
