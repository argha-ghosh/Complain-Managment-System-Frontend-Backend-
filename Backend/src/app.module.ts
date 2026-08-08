import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Zone Officer part modules
import { AuthModule } from './auth/auth.module';
import { ZOfficerModule } from './Zone Officer/ZOfficer.module';
import { ZOfficerEntity } from './Zone Officer/Entity/ZOfficer.entity';

// Admin part modules
import { AdminModule } from './admin/admin.module';
import { AdminEntity } from './admin/Entity/admin.entity';
import { ProfileEntity } from './admin/Entity/profile.entity';
import { ZoneOfficerEntity } from './admin/Entity/zoneOfficer.entity';
import { OfficerProfileEntity } from './Zone Officer/Entity/officer-profile.entity';
import { ComplaintEntity } from './Zone Officer/Entity/complaint.entity';

//CITIZEN PART MODULES
import { CitizenModule } from './citizen/citizen.module';
import { CitizenEntity } from './citizen/Entity/citizen.entity';
import { CitizenComplaintEntity } from './citizen/Entity/citizen-complaint.entity';
import { FeedbackEntity } from './citizen/Entity/feedback.entity';
import { FieldEngineerEntity } from './field-engineer/Entity/field-engineer.entity';
import { FieldEngineerModule } from './field-engineer/field-engineer.module';
import { EngineerAssignmentEntity } from './field-engineer/Entity/engineer-assignment.entity';
import { RepairPhotoEntity } from './field-engineer/Entity/repair-photo.entity';
import { EngineerCommentEntity } from './field-engineer/Entity/engineer-comment.entity';

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
        CitizenEntity,
        CitizenComplaintEntity,
        FeedbackEntity,
        FieldEngineerEntity,
        EngineerAssignmentEntity,
        RepairPhotoEntity,
        EngineerCommentEntity,
      ],
      synchronize: process.env.TYPEORM_SYNC === 'true',
    }),

    // Zone Officer part
    AuthModule,
    ZOfficerModule,

    // Admin part
    AdminModule,

    // Citizen part
    CitizenModule,

    // Field Engineer part
    FieldEngineerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
