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
      useFactory: (configService: ConfigService) => {
        const defaultFileSize = 10 * 1024 * 1024; // 10MB default
        const parsedFileSize = Number(configService.get('MAX_FILE_SIZE'));
        // Env vars are strings; multer requires limits.fileSize to be a non-negative integer
        const fileSize =
          Number.isInteger(parsedFileSize) && parsedFileSize > 0
            ? parsedFileSize
            : defaultFileSize;

        return {
          storage: multer.memoryStorage(), // Store files in memory for S3 upload
          limits: { fileSize },
        };
      },
    }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, S3Service],
  // Re-export MulterModule so dependent modules (e.g. OrganizationsModule)
  // resolve MULTER_MODULE_OPTIONS and share the same fileSize limit.
  exports: [AttachmentsService, S3Service, MulterModule],
})
export class AttachmentsModule {}
