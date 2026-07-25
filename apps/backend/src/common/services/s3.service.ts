import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET', '');

    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
      forcePathStyle: !!endpoint, // Use path-style for non-AWS S3 (e.g., MinIO)
    });

    this.logger.log(`S3 Service initialized with bucket: ${this.bucketName}`);
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<{ key: string; url: string }> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Remove ACL setting as buckets with ACLs disabled will reject this
        // Use bucket policies instead for public access
      });

      await this.s3Client.send(command);

      const url = this.getFileUrl(key);
      this.logger.log(`File uploaded successfully: ${key}`);

      return { key, url };
    } catch (error: any) {
      this.logger.error(`Error uploading file to S3: ${error?.message}`, error?.stack);
      throw new Error(`Failed to upload file: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get signed URL for downloading a file
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error: any) {
      this.logger.error(`Error generating signed URL: ${error?.message}`, error?.stack);
      throw new Error(`Failed to generate signed URL: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get public URL for a file (if bucket is configured for public access)
   */
  getFileUrl(key: string): string {
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    if (endpoint) {
      // For custom S3-compatible services (e.g., MinIO)
      return `${endpoint}/${this.bucketName}/${key}`;
    }
    // For AWS S3
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error: any) {
      this.logger.error(`Error deleting file from S3: ${error?.message}`, error?.stack);
      throw new Error(`Failed to delete file: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Generate a unique key for file upload
   */
  generateFileKey(originalName: string, prefix = 'uploads'): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '-');
    return `${prefix}/${timestamp}-${randomString}-${baseName}.${extension}`;
  }

  /**
   * Delete multiple files from S3
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    try {
      await Promise.all(keys.map((key) => this.deleteFile(key)));
      this.logger.log(`${keys.length} files deleted successfully`);
    } catch (error: any) {
      this.logger.error(`Error deleting multiple files: ${error?.message}`, error?.stack);
      throw new Error(`Failed to delete files: ${error?.message || 'Unknown error'}`);
    }
  }
}
