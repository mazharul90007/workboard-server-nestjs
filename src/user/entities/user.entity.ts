// import { UserRole } from 'src/generated/prisma/enums';
import { UserRole } from 'generated/prisma/enums';

export class AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
