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

  // Private method to get full organization entity for internal use
  private async findOrganizationEntity(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['departments', 'users', 'departments.users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

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

  async findAll(): Promise<any[]> {
    const organizations = await this.organizationRepository.find({
      relations: ['departments', 'users', 'departments.users'],
    });

    // Return optimized response with only necessary fields
    return organizations.map((org: Organization) => ({
      id: org.id,
      created_at: org.created_at,
      updated_at: org.updated_at,
      name: org.name,
      description: org.description,
      slug: org.slug,
      website: org.website,
      address: org.address,
      phone: org.phone,
      email: org.email,
      logo_url: org.logo_url,
      dark_logo_url: org.dark_logo_url,
      light_logo_url: org.light_logo_url,
      settings: org.settings,
      is_active: org.is_active,
      departments: org.departments?.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        user_count: dept.users?.length || 0,
      })) || [],
      users: org.users?.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        avatar_url: user.avatar_url,
        department_id: user.department_id,
        department_name: org.departments?.find((d: any) => d.id === user.department_id)?.name || null,
      })) || [],
    }));
  }

  async findOne(id: number): Promise<any> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['departments', 'users', 'departments.users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    // Return optimized response with only necessary fields
    return {
      id: organization.id,
      created_at: organization.created_at,
      updated_at: organization.updated_at,
      name: organization.name,
      description: organization.description,
      slug: organization.slug,
      website: organization.website,
      address: organization.address,
      phone: organization.phone,
      email: organization.email,
      logo_url: organization.logo_url,
      dark_logo_url: organization.dark_logo_url,
      light_logo_url: organization.light_logo_url,
      settings: organization.settings,
      is_active: organization.is_active,
      departments: organization.departments?.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        user_count: dept.users?.length || 0,
      })) || [],
      users: organization.users?.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        avatar_url: user.avatar_url,
        department_id: user.department_id,
        department_name: organization.departments?.find((d: any) => d.id === user.department_id)?.name || null,
      })) || [],
    };
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<any> {
    await this.findOrganizationEntity(id);
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
  ): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

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

  async removeLogo(id: number): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

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

  async uploadDarkLogo(
    id: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

    // Validate file is an image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Delete old dark logo if exists
    if (organization.dark_logo_url) {
      try {
        await this.s3Service.deleteFile(organization.dark_logo_url);
        this.logger.log(`Old dark logo deleted from S3: ${organization.dark_logo_url}`);
      } catch (error) {
        this.logger.warn(`Failed to delete old dark logo: ${error}`);
      }
    }

    // Generate unique key for S3
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `organizations/${id}/dark-logo/${Date.now()}.${fileExtension}`;

    // Upload to S3
    const { key, url } = await this.s3Service.uploadFile(
      fileKey,
      file.buffer,
      file.mimetype,
    );

    this.logger.log(`Dark logo uploaded to S3: ${key}`);

    // Update organization with new dark logo URL
    await this.organizationRepository.update(id, { dark_logo_url: url });

    return this.findOne(id);
  }

  async uploadLightLogo(
    id: number,
    file: Express.Multer.File,
  ): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

    // Validate file is an image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Delete old light logo if exists
    if (organization.light_logo_url) {
      try {
        await this.s3Service.deleteFile(organization.light_logo_url);
        this.logger.log(`Old light logo deleted from S3: ${organization.light_logo_url}`);
      } catch (error) {
        this.logger.warn(`Failed to delete old light logo: ${error}`);
      }
    }

    // Generate unique key for S3
    const fileExtension = file.originalname.split('.').pop();
    const fileKey = `organizations/${id}/light-logo/${Date.now()}.${fileExtension}`;

    // Upload to S3
    const { key, url } = await this.s3Service.uploadFile(
      fileKey,
      file.buffer,
      file.mimetype,
    );

    this.logger.log(`Light logo uploaded to S3: ${key}`);

    // Update organization with new light logo URL
    await this.organizationRepository.update(id, { light_logo_url: url });

    return this.findOne(id);
  }

  async removeDarkLogo(id: number): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

    if (!organization.dark_logo_url) {
      throw new BadRequestException('No dark logo to delete');
    }

    // Delete file from S3
    try {
      await this.s3Service.deleteFile(organization.dark_logo_url);
      this.logger.log(`Dark logo deleted from S3: ${organization.dark_logo_url}`);
    } catch (error) {
      this.logger.warn(`Failed to delete dark logo from S3: ${error}`);
    }

    // Remove dark logo URL from organization
    await this.organizationRepository.update(id, { dark_logo_url: null });

    return this.findOne(id);
  }

  async removeLightLogo(id: number): Promise<any> {
    const organization = await this.findOrganizationEntity(id);

    if (!organization.light_logo_url) {
      throw new BadRequestException('No light logo to delete');
    }

    // Delete file from S3
    try {
      await this.s3Service.deleteFile(organization.light_logo_url);
      this.logger.log(`Light logo deleted from S3: ${organization.light_logo_url}`);
    } catch (error) {
      this.logger.warn(`Failed to delete light logo from S3: ${error}`);
    }

    // Remove light logo URL from organization
    await this.organizationRepository.update(id, { light_logo_url: null });

    return this.findOne(id);
  }
}
