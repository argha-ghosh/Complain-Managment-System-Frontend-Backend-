import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { CitizenEntity } from './Entity/citizen.entity';
import { CitizenComplaintEntity } from './Entity/citizen-complaint.entity';
import { FeedbackEntity } from './Entity/feedback.entity';
import { CitizenAuthGuard } from './citizen-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CitizenEntity,
      CitizenComplaintEntity,
      FeedbackEntity,
    ]),
  ],
  controllers: [CitizenController],
  providers: [CitizenService, CitizenAuthGuard],
  exports: [CitizenService],
})
export class CitizenModule {}
