import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ZOfficerService } from '../Zone Officer/ZOfficer.service';
import { LoginDto } from './login.dto';
import { ZOfficerEntity } from '../Zone Officer/ZOfficer.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly zOfficerService: ZOfficerService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user: ZOfficerEntity | null = await this.zOfficerService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const stored = user.password;
    let match = await bcrypt.compare(dto.password, stored);

    if (!match && !stored.startsWith('$2')) {
      // Legacy plain-text password — verify once, then upgrade to bcrypt hash
      if (stored === dto.password) {
        match = true;
        const hashed = await bcrypt.hash(dto.password, 10);
        if (user.id) {
          await this.zOfficerService.setPasswordHash(user.id, hashed);
        }
      }
    }

    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async getProfile(userId: number) {
    const user = await this.zOfficerService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...safe } = user;
    return safe;
  }
}
