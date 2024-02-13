import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from '@auth/strategies/google.strategy';

export const STRATEGIES = [JwtStrategy, GoogleStrategy];
