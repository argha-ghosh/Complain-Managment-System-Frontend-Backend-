import { Module } from "@nestjs/common";
import { ZOfficerController } from "./ZOfficer.controller";
import { ZOfficerService } from "./ZOfficer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintEntity, OfficerProfileEntity, ZOfficerEntity } from "./ZOfficer.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ZOfficerEntity, ComplaintEntity, OfficerProfileEntity])],
    controllers: [ZOfficerController],
    providers: [ZOfficerService],
    exports: [ZOfficerService]
})
export class ZOfficerModule {}