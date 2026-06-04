import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZOfficerController } from './ZOfficer.controller';
import { ZOfficerService } from './ZOfficer.service';
import { ZOfficerEntity } from './ZOfficer.entity';
import { ComplaintEntity } from './complaint.entity';
import { OfficerProfileEntity } from './officer-profile.entity';
import { OtpService } from './otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZOfficerEntity, ComplaintEntity, OfficerProfileEntity]),
  ],
  controllers: [ZOfficerController],
  providers: [ZOfficerService, OtpService],
  exports: [ZOfficerService],
})
export class ZOfficerModule {}