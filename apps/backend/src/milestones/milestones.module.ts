import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { Milestone } from '../entities/milestone.entity';
import { MilestoneStatusHistory } from '../entities/milestone-status-history.entity';
import { Phase } from '../entities/phase.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone, MilestoneStatusHistory, Phase]),
    AuditLogsModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
