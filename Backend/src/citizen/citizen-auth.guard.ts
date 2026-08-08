import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { requireEnvValue } from '../common/jwt-secret';

type CitizenPayload = {
  id: number;
  email: string;
  role: string;
};

@Injectable()
export class CitizenAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const payload = jwt.verify(token, requireEnvValue('JWT_SECRET'));
    if (
      typeof payload !== 'object' ||
      payload === null ||
      (payload as CitizenPayload).role !== 'citizen'
    ) {
      throw new UnauthorizedException('Invalid citizen token');
    }

    request.user = payload;
    return true;
  }
}
