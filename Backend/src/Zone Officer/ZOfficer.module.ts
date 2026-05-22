import { Module } from "@nestjs/common";
import { ZOfficerController } from "./ZOfficer.controller";
import { ZOfficerService } from "./ZOfficer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintEntity, OfficerProfileEntity, ZOfficerEntity } from "./ZOfficer.entity";
import { OtpService } from "./otp.service";

@Module({
    imports: [TypeOrmModule.forFeature([ZOfficerEntity, ComplaintEntity, OfficerProfileEntity])],
    controllers: [ZOfficerController],
    providers: [ZOfficerService, OtpService],
    exports: [ZOfficerService]
})
export class ZOfficerModule {}