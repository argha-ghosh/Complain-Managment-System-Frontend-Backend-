import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FieldEngineerController } from './field-engineer.controller';
import { FieldEngineerService } from './field-engineer.service';
import { FieldEngineerEntity } from './Entity/field-engineer.entity';
import { EngineerAssignmentEntity } from './Entity/engineer-assignment.entity';
import { RepairPhotoEntity } from './Entity/repair-photo.entity';
import { EngineerCommentEntity } from './Entity/engineer-comment.entity';
import { FieldEngineerAuthGuard } from './field-engineer-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FieldEngineerEntity,
      EngineerAssignmentEntity,
      RepairPhotoEntity,
      EngineerCommentEntity,
    ]),
  ],
  controllers: [FieldEngineerController],
  providers: [FieldEngineerService, FieldEngineerAuthGuard],
  exports: [FieldEngineerService],
})
export class FieldEngineerModule {}
