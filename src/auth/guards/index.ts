import { JwtAuthGuard } from '@auth/guards/jwt-auth.guards';
import { RolesGuard } from '@auth/guards/role.quard';
import { GoogleGuard } from '@auth/guards/google.guard';

export const GUARDS = [JwtAuthGuard, RolesGuard, GoogleGuard];
