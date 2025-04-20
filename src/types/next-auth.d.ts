import { UserRole } from "@/lib/db/schema";

declare module "next-auth" {
  /**
   * ขยาย User interface ให้มี role และ permissions
   */
  interface User {
    role?: UserRole;
    permissions?: string[];
  }

  interface Session {
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
      permissions?: string[];
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * ขยาย JWT interface ให้มี role และ permissions
   */
  interface JWT {
    role?: UserRole;
    permissions?: string[];
  }
}
