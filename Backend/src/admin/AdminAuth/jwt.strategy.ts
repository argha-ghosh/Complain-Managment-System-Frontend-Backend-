import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { requireConfigValue } from '../../common/jwt-secret';

type AdminJwtPayload = { sub?: number; id?: number; email?: string };

// Named 'admin-jwt' so it does not conflict with the 'jwt' strategy in the auth module
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: requireConfigValue(config, 'ADMIN_JWT_SECRET'),
    });
  }

  validate(payload: AdminJwtPayload) {
    const id = payload.sub ?? payload.id;
    if (id == null || !payload.email) {
      throw new UnauthorizedException();
    }
    return { id, email: payload.email };
  }
}
