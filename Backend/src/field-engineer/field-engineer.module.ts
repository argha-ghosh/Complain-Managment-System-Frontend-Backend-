import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FieldEngineerController } from './field-engineer.controller';
import { FieldEngineerService } from './field-engineer.service';
import { FieldEngineerEntity } from './field-engineer.entity';
import { EngineerAssignmentEntity } from './engineer-assignment.entity';
import { RepairPhotoEntity } from './repair-photo.entity';
import { EngineerCommentEntity } from './engineer-comment.entity';

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
  providers: [FieldEngineerService],
  exports: [FieldEngineerService],
})
export class FieldEngineerModule {}