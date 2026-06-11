import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateZoneOfficerDto, UpdateZoneOfficerDto, CreateComplaintDto, CreateOfficerProfileDto } from './ZOfficer.dto';
import { ZOfficerEntity } from './ZOfficer.entity';
import { OfficerProfileEntity } from './officer-profile.entity';
import { notifyComplaintCreated } from '../pusher/pusher.service';
import { ComplaintEntity } from './complaint.entity';

@Injectable()
export class ZOfficerService {

  constructor(
    @InjectRepository(ZOfficerEntity)
    private readonly zOfficerRepository: Repository<ZOfficerEntity>,
    @InjectRepository(ComplaintEntity)
    private readonly complaintRepository: Repository<ComplaintEntity>,
    @InjectRepository(OfficerProfileEntity)
    private readonly officerProfileRepository: Repository<OfficerProfileEntity>,
  ) {}

  async findByEmail(email: string): Promise<ZOfficerEntity | null> {
    const normalized = email.trim().toLowerCase();
    return await this.zOfficerRepository
      .createQueryBuilder('o')
      .where('LOWER(TRIM(o.email)) = :email', { email: normalized })
      .getOne();
  }

  async setPasswordHash(userId: number, hashedPassword: string): Promise<void> {
    await this.zOfficerRepository.update(userId, { password: hashedPassword });
  }

  // Create Zone Officer
  async create(createZOfficerDto: CreateZoneOfficerDto): Promise<ZOfficerEntity> {
    const hashedPassword = await bcrypt.hash(createZOfficerDto.password!, 10);
    const zoneOfficer = this.zOfficerRepository.create({
      name: createZOfficerDto.name,
      email: createZOfficerDto.email!.trim().toLowerCase(),
      password: hashedPassword,
      nid: createZOfficerDto.nid !== undefined ? createZOfficerDto.nid.toString() : undefined,
    });
    return (await this.zOfficerRepository.save(zoneOfficer)) as ZOfficerEntity;
  }

  // Update Zone Officer by ID
  async updateZoneOfficer(id: number, updateZoneOfficerDto: UpdateZoneOfficerDto): Promise<{ message: string }> {
    const payload: Partial<ZOfficerEntity> = {};

    if (updateZoneOfficerDto.name !== undefined) payload.name = updateZoneOfficerDto.name;
    if (updateZoneOfficerDto.email !== undefined) payload.email = updateZoneOfficerDto.email.trim().toLowerCase();
    if (updateZoneOfficerDto.password !== undefined && updateZoneOfficerDto.password !== '') {
      payload.password = await bcrypt.hash(updateZoneOfficerDto.password, 10);
    }
    if (updateZoneOfficerDto.nid !== undefined) payload.nid = updateZoneOfficerDto.nid.toString();

    const result = await this.zOfficerRepository.update(id, payload);
    if (result.affected === 0) {
      throw new HttpException(`Zone Officer with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return { message: `Zone Officer with ID ${id} updated successfully` };
  }

  // Delete Zone Officer by ID
  async deleteZoneOfficer(id: number): Promise<{ message: string }> {
    const zoneOfficer = await this.zOfficerRepository.findOneBy({ id });
    if (!zoneOfficer) {
      throw new HttpException(`Zone user with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.officerProfileRepository.delete({ zoneOfficerId: id });
    await this.complaintRepository.delete({ zoneOfficerId: id });
    const result = await this.zOfficerRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(`Zone officer with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return { message: `Zone officer with ID ${id} deleted successfully` };
  }

  // Get All Zone Officers
  async findAll(): Promise<ZOfficerEntity[]> {
    return await this.zOfficerRepository.find();
  }

  // Get Zone Officer by ID
  async findOne(id: number): Promise<ZOfficerEntity> {
    const zoneOfficer = await this.zOfficerRepository.findOne({ where: { id } });
    if (!zoneOfficer) {
      throw new HttpException(`Zone Officer with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return zoneOfficer;
  }

  // Create Complaint
  async createComplaint(
    CreateComplaintDto: CreateComplaintDto & { zoneOfficerId?: number },
): Promise<ComplaintEntity> {
    const complaint = this.complaintRepository.create(CreateComplaintDto);

    if (CreateComplaintDto.zoneOfficerId) {
        const zoneOfficer = await this.zOfficerRepository.findOneBy({
            id: CreateComplaintDto.zoneOfficerId,
        });
        if (!zoneOfficer) {
            throw new HttpException(
                `Zone Officer with ID ${CreateComplaintDto.zoneOfficerId} not found`,
                HttpStatus.NOT_FOUND,
            );
        }
        complaint.zoneOfficer = zoneOfficer;
        complaint.zoneOfficerId = CreateComplaintDto.zoneOfficerId;
    }

    const saved = (await this.complaintRepository.save(complaint)) as ComplaintEntity;

    console.log('🔔 Calling notifyComplaintCreated...');  // ← add koro
    console.log('Zone:', CreateComplaintDto.zoneName);     // ← add koro
    console.log('Area:', CreateComplaintDto.areaName);     // ← add koro

    await notifyComplaintCreated(
        CreateComplaintDto.zoneName || 'Unknown Zone',
        CreateComplaintDto.areaName || 'Unknown Area',
    );

    console.log('🔔 notifyComplaintCreated finished');     // ← add koro

    return saved;
}

  // Update Complaint Status
  async updateComplaintStatus(id: number, status: string): Promise<object> {
    const complaint = await this.complaintRepository.findOneBy({ complaintId: id });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    complaint.status = status;
    await this.complaintRepository.save(complaint);
    return { message: `Complaint with ID ${id} updated to status ${status} successfully` };
  }

  // Delete Complaint
  async deleteComplaint(id: number): Promise<{ message: string }> {
    const complaint = await this.complaintRepository.findOneBy({ complaintId: id });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    const result = await this.complaintRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(`Complaint with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return { message: `Complaint with ID ${id} deleted successfully` };
  }

  // Get Complaint by ID
  async getComplaintById(id: number): Promise<ComplaintEntity> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaintId: id },
      relations: ['zoneOfficer'],
    });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return complaint;
  }

  // Get All Complaints by Zone Officer
  async getComplaintsByOfficer(zoneOfficerId: number): Promise<ComplaintEntity[]> {
    return await this.complaintRepository.find({
      where: { zoneOfficerId },
      relations: ['zoneOfficer'],
    });
  }

  // Create Officer Profile (One-to-One)
  async createOfficerProfile(createOfficerProfileDto: CreateOfficerProfileDto): Promise<OfficerProfileEntity> {
    const zoneOfficer = await this.zOfficerRepository.findOneBy({ id: createOfficerProfileDto.zoneOfficerId });
    if (!zoneOfficer) {
      throw new HttpException(
        `Zone Officer with ID ${createOfficerProfileDto.zoneOfficerId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const existingProfile = await this.officerProfileRepository.findOne({
      where: { zoneOfficerId: createOfficerProfileDto.zoneOfficerId },
    });
    if (existingProfile) {
      throw new HttpException(
        `Profile already exists for Officer with ID ${createOfficerProfileDto.zoneOfficerId}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const profile = this.officerProfileRepository.create(createOfficerProfileDto);
    return await this.officerProfileRepository.save(profile);
  }

  // Get Officer Profile (One-to-One)
  async getOfficerProfile(zoneOfficerId: number): Promise<OfficerProfileEntity> {
    const profile = await this.officerProfileRepository.findOne({
      where: { zoneOfficerId },
      relations: ['zoneOfficer'],
    });
    if (!profile) {
      throw new HttpException(`Profile not found for Officer with ID ${zoneOfficerId}`, HttpStatus.NOT_FOUND);
    }
    return profile;
  }
}
