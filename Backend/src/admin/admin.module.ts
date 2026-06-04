import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
import { ProfileEntity } from './profile.entity';
import { ZoneOfficerEntity } from './zoneOfficer.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('ADMIN_JWT_EXPIRES', '1h') as any;
        return {
          secret: config.get<string>('ADMIN_JWT_SECRET', 'DhakaCityCorporationKey'),
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
MailerModule.forRoot({
  transport: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'tanjilahabib6@gmail.com',
      pass: 'cxeq eppu etkm fuxj',
    },
  },
}),
    TypeOrmModule.forFeature([AdminEntity, ProfileEntity, ZoneOfficerEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
