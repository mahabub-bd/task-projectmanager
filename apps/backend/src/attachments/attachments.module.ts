import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { TaskAttachment } from '../entities/task-attachment.entity';
import { Task } from '../entities/task.entity';
import { S3Service } from '../common/services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAttachment, Task]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: multer.memoryStorage(), // Store files in memory for S3 upload
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB default
        },
      }),
    }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, S3Service],
  exports: [AttachmentsService, S3Service],
})
export class AttachmentsModule {}
