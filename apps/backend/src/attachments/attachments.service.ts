import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Service } from '../common/services/s3.service';
import { AttachmentType, TaskAttachment } from '../entities/task-attachment.entity';
import { Task } from '../entities/task.entity';

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name);

  constructor(
    @InjectRepository(TaskAttachment)
    private attachmentRepository: Repository<TaskAttachment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private s3Service: S3Service,
  ) {}

  async uploadFile(
    taskId: number,
    file: Express.Multer.File,
    userId: number,
    description?: string,
  ): Promise<TaskAttachment> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Determine attachment type
    let attachmentType = AttachmentType.OTHER;
    if (file.mimetype.startsWith('image/')) {
      attachmentType = AttachmentType.IMAGE;
    } else if (file.mimetype.startsWith('video/')) {
      attachmentType = AttachmentType.VIDEO;
    } else if (file.mimetype.startsWith('audio/')) {
      attachmentType = AttachmentType.AUDIO;
    } else if (
      file.mimetype.includes('pdf') ||
      file.mimetype.includes('document') ||
      file.mimetype.includes('text') ||
      file.mimetype.includes('sheet') ||
      file.mimetype.includes('presentation')
    ) {
      attachmentType = AttachmentType.DOCUMENT;
    }

    // Generate unique key for S3
    const fileKey = this.s3Service.generateFileKey(
      file.originalname,
      `tasks/${taskId}/attachments`,
    );

    // Upload to S3
    const { key } = await this.s3Service.uploadFile(
      fileKey,
      file.buffer,
      file.mimetype,
    );

    this.logger.log(`File uploaded to S3: ${key}`);

    // Create attachment record
    const attachment = this.attachmentRepository.create({
      task_id: taskId,
      uploaded_by: userId,
      file_name: file.originalname,
      file_url: key,
      file_size: file.size,
      file_type: this.getFileExtension(file.originalname),
      attachment_type: attachmentType,
      mime_type: file.mimetype,
      description,
      storage_provider: 's3',
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);

    // Update task attachment count
    await this.taskRepository.increment({ id: taskId }, 'attachment_count', 1);

    return this.findOne(savedAttachment.id);
  }

  async findByTask(taskId: number): Promise<TaskAttachment[]> {
    const attachments = await this.attachmentRepository.find({
      where: { task_id: taskId },
      relations: ['uploaded_by_user'],
      order: { created_at: 'DESC' },
    });

    // Generate signed URLs for all attachments
    for (const attachment of attachments) {
      (attachment as any).download_url = await this.s3Service.getSignedUrl(attachment.file_url);
      (attachment as any).public_url = this.s3Service.getFileUrl(attachment.file_url);
    }

    return attachments;
  }

  async findOne(id: number): Promise<TaskAttachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task', 'uploaded_by_user'],
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    // Add signed URL for download
    (attachment as any).download_url = await this.s3Service.getSignedUrl(attachment.file_url);
    (attachment as any).public_url = this.s3Service.getFileUrl(attachment.file_url);

    return attachment;
  }

  async remove(id: number, userId: number): Promise<void> {
    const attachment = await this.findOne(id);

    // Delete file from S3
    await this.s3Service.deleteFile(attachment.file_url);

    this.logger.log(`File deleted from S3: ${attachment.file_url}`);

    // Delete attachment record
    await this.attachmentRepository.delete(id);

    // Update task attachment count
    await this.taskRepository.decrement({ id: attachment.task_id }, 'attachment_count', 1);
  }

  async getSignedUrl(id: number, expiresIn = 3600): Promise<string> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return this.s3Service.getSignedUrl(attachment.file_url, expiresIn);
  }

  async getPublicUrl(id: number): Promise<string> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return this.s3Service.getFileUrl(attachment.file_url);
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }
}
