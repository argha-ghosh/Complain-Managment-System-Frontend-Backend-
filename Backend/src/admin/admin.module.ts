import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './Entity/admin.entity';
import { ProfileEntity } from './Entity/profile.entity';
import { ZoneOfficerEntity } from './Entity/zoneOfficer.entity';
import { JwtStrategy } from './AdminAuth/jwt.strategy';
import { FieldEngineerEntity } from '../field-engineer/Entity/field-engineer.entity';
import { requireConfigValue } from '../common/jwt-secret';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: requireConfigValue(config, 'ADMIN_JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: Number(config.get<string>('MAIL_PORT', '587')),
          secure: config.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: requireConfigValue(config, 'GMAIL_USER'),
            pass: requireConfigValue(config, 'GMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      AdminEntity,
      ProfileEntity,
      ZoneOfficerEntity,
      FieldEngineerEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
