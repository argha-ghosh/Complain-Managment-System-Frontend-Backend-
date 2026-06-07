import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { FieldEngineerEntity } from './field-engineer.entity';
import { EngineerAssignmentEntity } from './engineer-assignment.entity';
import { RepairPhotoEntity } from './repair-photo.entity';
import { EngineerCommentEntity } from './engineer-comment.entity';
import {
  RegisterEngineerDto, LoginEngineerDto,
  AssignComplaintDto, AddCommentDto, UpdateAssignmentStatusDto,
} from './field-engineer.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

@Injectable()
export class FieldEngineerService {
  constructor(
    @InjectRepository(FieldEngineerEntity)
    private readonly engineerRepository: Repository<FieldEngineerEntity>,

    @InjectRepository(EngineerAssignmentEntity)
    private readonly assignmentRepository: Repository<EngineerAssignmentEntity>,

    @InjectRepository(RepairPhotoEntity)
    private readonly photoRepository: Repository<RepairPhotoEntity>,

    @InjectRepository(EngineerCommentEntity)
    private readonly commentRepository: Repository<EngineerCommentEntity>,
  ) {}

  // ── Register
  async register(dto: RegisterEngineerDto): Promise<{ message: string }> {
    const normalized = dto.email.trim().toLowerCase();

    const existing = await this.engineerRepository.findOne({
      where: { email: normalized },
    });
    if (existing) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const engineer = this.engineerRepository.create({
      name: dto.name,
      email: normalized,
      password: hashedPassword,
      phone: dto.phone,
      specialization: dto.specialization,
    });

    await this.engineerRepository.save(engineer);
    return { message: 'Field Engineer registered successfully' };
  }

  // ── Login
  async login(dto: LoginEngineerDto): Promise<{ token: string; engineer: Partial<FieldEngineerEntity> }> {
    const normalized = dto.email.trim().toLowerCase();

    const engineer = await this.engineerRepository.findOne({
      where: { email: normalized },
    });
    if (!engineer) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(dto.password, engineer.password!);
    if (!isMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { id: engineer.id, email: engineer.email, role: 'field_engineer' },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    const { password, ...safeData } = engineer;
    return { token, engineer: safeData };
  }

  // ── Get All Engineers
  async getAllEngineers(): Promise<FieldEngineerEntity[]> {
    return await this.engineerRepository.find();
  }

  // ── Get Engineer by ID
  async getEngineerById(id: number): Promise<Partial<FieldEngineerEntity>> {
    const engineer = await this.engineerRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });
    if (!engineer) {
      throw new HttpException(`Engineer with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    const { password, ...safeData } = engineer;
    return safeData;
  }

  // ── Assign Complaint to Engineer (Admin use)
  async assignComplaint(dto: AssignComplaintDto): Promise<EngineerAssignmentEntity> {
    const engineer = await this.engineerRepository.findOneBy({ id: dto.engineerId });
    if (!engineer) {
      throw new HttpException(`Engineer with ID ${dto.engineerId} not found`, HttpStatus.NOT_FOUND);
    }

    const existing = await this.assignmentRepository.findOne({
      where: { engineerId: dto.engineerId, complaintId: dto.complaintId },
    });
    if (existing) {
      throw new HttpException('This complaint is already assigned to this engineer', HttpStatus.CONFLICT);
    }

    const assignment = this.assignmentRepository.create({
      engineerId: dto.engineerId,
      complaintId: dto.complaintId,
      notes: dto.notes,
      status: 'Assigned',
    });

    return await this.assignmentRepository.save(assignment);
  }

  // ── View Assigned Complaints for an Engineer
  async getAssignedComplaints(engineerId: number): Promise<EngineerAssignmentEntity[]> {
    const engineer = await this.engineerRepository.findOneBy({ id: engineerId });
    if (!engineer) {
      throw new HttpException(`Engineer with ID ${engineerId} not found`, HttpStatus.NOT_FOUND);
    }

    return await this.assignmentRepository.find({
      where: { engineerId },
      relations: ['photos', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Get Assignment by ID
  async getAssignmentById(assignmentId: number): Promise<EngineerAssignmentEntity> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId },
      relations: ['engineer', 'photos', 'comments'],
    });
    if (!assignment) {
      throw new HttpException(`Assignment with ID ${assignmentId} not found`, HttpStatus.NOT_FOUND);
    }
    return assignment;
  }

  // ── Upload Repair Photo
  async uploadRepairPhoto(
    assignmentId: number,
    imageUrl: string,
    caption?: string,
  ): Promise<RepairPhotoEntity> {
    const assignment = await this.assignmentRepository.findOneBy({ assignmentId });
    if (!assignment) {
      throw new HttpException(`Assignment with ID ${assignmentId} not found`, HttpStatus.NOT_FOUND);
    }

    const photo = this.photoRepository.create({
      assignmentId,
      imageUrl,
      caption,
    });

    return await this.photoRepository.save(photo);
  }

  // ── Add Comment
  async addComment(assignmentId: number, dto: AddCommentDto): Promise<EngineerCommentEntity> {
    const assignment = await this.assignmentRepository.findOneBy({ assignmentId });
    if (!assignment) {
      throw new HttpException(`Assignment with ID ${assignmentId} not found`, HttpStatus.NOT_FOUND);
    }

    const comment = this.commentRepository.create({
      assignmentId,
      comment: dto.comment,
      engineerId: dto.engineerId,
    });

    return await this.commentRepository.save(comment);
  }

  // ── Update Assignment Status (Mark In Progress / Resolved)
  async updateStatus(
    assignmentId: number,
    dto: UpdateAssignmentStatusDto,
  ): Promise<{ message: string }> {
    const assignment = await this.assignmentRepository.findOneBy({ assignmentId });
    if (!assignment) {
      throw new HttpException(`Assignment with ID ${assignmentId} not found`, HttpStatus.NOT_FOUND);
    }

    const validStatuses = ['Assigned', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(dto.status)) {
      throw new HttpException(
        'Status must be: Assigned | In Progress | Resolved',
        HttpStatus.BAD_REQUEST,
      );
    }

    assignment.status = dto.status;
    await this.assignmentRepository.save(assignment);
    return { message: `Assignment ${assignmentId} status updated to "${dto.status}"` };
  }

  // ── Get Photos for an Assignment
  async getPhotosByAssignment(assignmentId: number): Promise<RepairPhotoEntity[]> {
    return await this.photoRepository.find({
      where: { assignmentId },
    });
  }

  // ── Get Comments for an Assignment
  async getCommentsByAssignment(assignmentId: number): Promise<EngineerCommentEntity[]> {
    return await this.commentRepository.find({
      where: { assignmentId },
      order: { createdAt: 'DESC' },
    });
  }
}