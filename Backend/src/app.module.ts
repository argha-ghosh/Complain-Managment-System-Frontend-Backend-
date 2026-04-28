import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ZOfficerModule } from './Zone Officer/ZOfficer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintEntity, ZOfficerEntity, OfficerProfileEntity } from './Zone Officer/ZOfficer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ZOfficerModule,
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Argha2026',
    database: 'ZoneOfficer',
    entities: [ZOfficerEntity, ComplaintEntity, OfficerProfileEntity],
    // autoLoadEntities: true,
    synchronize: false,
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}