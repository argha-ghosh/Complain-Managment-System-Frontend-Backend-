import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function requireConfigValue(
  config: ConfigService,
  key: string,
): string {
  const value = config.get<string>(key)?.trim();
  if (!value) {
    throw new InternalServerErrorException(`${key} is not configured`);
  }
  return value;
}

export function requireEnvValue(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new InternalServerErrorException(`${key} is not configured`);
  }
  return value;
}
