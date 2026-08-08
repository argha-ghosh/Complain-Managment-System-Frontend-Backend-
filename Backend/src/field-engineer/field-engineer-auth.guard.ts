import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { requireEnvValue } from '../common/jwt-secret';

type FieldEngineerPayload = {
  id: number;
  email: string;
  role: string;
};

@Injectable()
export class FieldEngineerAuthGuard implements CanActivate {
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
      (payload as FieldEngineerPayload).role !== 'field_engineer'
    ) {
      throw new UnauthorizedException('Invalid field engineer token');
    }

    request.user = payload;
    return true;
  }
}
