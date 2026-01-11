import { UserRole } from 'src/generated/prisma/enums';

export class AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
