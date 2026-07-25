import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { NotificationService } from './notification.service';
import { NotificationPreferenceService } from './notification-preference.service';
import { NotificationPreference } from '../entities/notification-preference.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NotificationPreference]),
  ],
  providers: [EmailService, NotificationService, NotificationPreferenceService],
  exports: [EmailService, NotificationService, NotificationPreferenceService],
})
export class EmailModule {}
