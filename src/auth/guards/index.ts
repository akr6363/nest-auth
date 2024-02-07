import { JwtAuthGuard } from '@auth/guards/jwt-auth.guards';
import { RolesGuard } from '@auth/guards/role.quard';

export const GUARDS = [JwtAuthGuard, RolesGuard];
