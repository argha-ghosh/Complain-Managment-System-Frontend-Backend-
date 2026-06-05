import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitizenController } from './citizen.controller';
import { CitizenService } from './citizen.service';
import { CitizenEntity } from './citizen.entity';
import { CitizenComplaintEntity } from './citizen-complaint.entity';
import { FeedbackEntity } from './feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CitizenEntity,
      CitizenComplaintEntity,
      FeedbackEntity,
    ]),
  ],
  controllers: [CitizenController],
  providers: [CitizenService],
  exports: [CitizenService],
})
export class CitizenModule {}