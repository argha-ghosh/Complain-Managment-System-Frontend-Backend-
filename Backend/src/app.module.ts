import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Zone Officer part modules
import { AuthModule } from './auth/auth.module';
import { ZOfficerModule } from './Zone Officer/ZOfficer.module';
import { ZOfficerEntity } from './Zone Officer/ZOfficer.entity';

// Admin part modules
import { AdminModule } from './admin/admin.module';
import { AdminEntity } from './admin/admin.entity';
import { ProfileEntity } from './admin/profile.entity';
import { ZoneOfficerEntity } from './admin/zoneOfficer.entity';
import { OfficerProfileEntity } from './Zone Officer/officer-profile.entity';
import { ComplaintEntity } from './Zone Officer/complaint.entity';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Single TypeORM connection — all entities registered here
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    ZOfficerEntity,
    ComplaintEntity,
    OfficerProfileEntity,
    AdminEntity,
    ProfileEntity,
    ZoneOfficerEntity,
  ],
  synchronize: true,
}),

    // Zone Officer part
    AuthModule,
    ZOfficerModule,

    // Admin part
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
