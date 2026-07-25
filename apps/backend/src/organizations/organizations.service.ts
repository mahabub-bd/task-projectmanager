import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { S3Service } from '../common/services/s3.service';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private s3Service: S3Service,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const existingOrg = await this.organizationRepository.findOne({
      where: { slug: createOrganizationDto.slug },
    });

    if (existingOrg) {
      throw new ConflictException('Organization with this slug already exists');
    }

    const organization = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['departments', 'users', 'departments.users'],
    });
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['departments', 'users', 'departments.users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    await this.findOne(id);
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.organizationRepository.delete(id);
  }

  async uploadLogo(
    id: number,
    file: Express.Multer.File,
  ): Promise<Organization> {
    const organization = await this.findOne(id);

    // Validate file is an image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Delete old logo if exists
    if (organization.logo_url) {
      try {
        await this.s3Service.deleteFile(organization.logo_url);
        this.logger.log(`Old logo deleted from S3: ${organization.logo_url}`);
      } catch (error) {
        this.logger.warn(`Failed to delete old logo: ${error}`);
      }
    }

    // Generate unique key for S3
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `organizations/${id}/logo/${Date.now()}.${fileExtension}`;

    // Upload to S3
    const { key, url } = await this.s3Service.uploadFile(
      fileKey,
      file.buffer,
      file.mimetype,
    );

    this.logger.log(`Logo uploaded to S3: ${key}`);

    // Update organization with new logo URL
    await this.organizationRepository.update(id, { logo_url: url });

    return this.findOne(id);
  }

  async removeLogo(id: number): Promise<Organization> {
    const organization = await this.findOne(id);

    if (!organization.logo_url) {
      throw new BadRequestException('No logo to delete');
    }

    // Delete file from S3
    try {
      await this.s3Service.deleteFile(organization.logo_url);
      this.logger.log(`Logo deleted from S3: ${organization.logo_url}`);
    } catch (error) {
      this.logger.warn(`Failed to delete logo from S3: ${error}`);
    }

    // Remove logo URL from organization
    await this.organizationRepository.update(id, { logo_url: null });

    return this.findOne(id);
  }
}
