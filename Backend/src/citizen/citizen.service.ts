import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {
  RegisterCitizenDto, LoginCitizenDto,
  CreateCitizenComplaintDto, UpdateComplaintStatusDto,
  CreateFeedbackDto,
} from './citizen.dto';
import { CitizenEntity } from './citizen.entity';
import { CitizenComplaintEntity } from './citizen-complaint.entity';
import { FeedbackEntity } from './feedback.entity';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


@Injectable()
export class CitizenService {
  constructor(
    @InjectRepository(CitizenEntity)
    private readonly citizenRepository: Repository<CitizenEntity>,

    @InjectRepository(CitizenComplaintEntity)
    private readonly complaintRepository: Repository<CitizenComplaintEntity>,

    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  // ── Step 1: Register 

  async register(dto: RegisterCitizenDto): Promise<{ message: string }> {
    const normalized = dto.email.trim().toLowerCase();

    const existing = await this.citizenRepository.findOne({ where: { email: normalized } });
    if (existing) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const citizen = this.citizenRepository.create({
      name: dto.name,
      email: normalized,
      password: hashedPassword,
      phone: dto.phone,
      nid: dto.nid,
    });

    await this.citizenRepository.save(citizen);
    return { message: 'Citizen registered successfully' };
  }

  // ── Step 2: Login 

  async login(dto: LoginCitizenDto): Promise<{ token: string; citizen: Partial<CitizenEntity> }> {
    const normalized = dto.email.trim().toLowerCase();

    const citizen = await this.citizenRepository.findOne({ where: { email: normalized } });
    if (!citizen) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(dto.password, citizen.password!);
    if (!isMatch) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { id: citizen.id, email: citizen.email, role: 'citizen' },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    // Never return password
    const { password, ...safeData } = citizen;
    return { token, citizen: safeData };
  }

  // ── Step 3: Get Citizen Profile 

  async getProfile(id: number): Promise<Partial<CitizenEntity>> {
    const citizen = await this.citizenRepository.findOne({
      where: { id },
      relations: ['complaints', 'feedbacks'],
    });
    if (!citizen) {
      throw new HttpException(`Citizen with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    const { password, ...safeData } = citizen;
    return safeData;
  }

  // ── Step 4: Submit Complaint 

  async createComplaint(
    dto: CreateCitizenComplaintDto,
    imageUrl?: string,
  ): Promise<CitizenComplaintEntity> {
    // Validate citizen exists if citizenId provided
    if (dto.citizenId) {
      const citizen = await this.citizenRepository.findOneBy({ id: dto.citizenId });
      if (!citizen) {
        throw new HttpException(`Citizen with ID ${dto.citizenId} not found`, HttpStatus.NOT_FOUND);
      }
    }

    const complaint = this.complaintRepository.create({
      corporation: dto.corporation,
      zone: dto.zone,
      ward: dto.ward,
      title: dto.title,
      description: dto.description,
      imageUrl: imageUrl ?? undefined,
      status: 'Pending',
      citizenId: dto.citizenId,
    });

    return await this.complaintRepository.save(complaint) as CitizenComplaintEntity;
  }

  // ── Step 5: Track Complaint by ID 

  async trackComplaint(complaintId: number): Promise<CitizenComplaintEntity> {
    const complaint = await this.complaintRepository.findOne({
      where: { complaintId },
      relations: ['citizen', 'feedback'],
    });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${complaintId} not found`, HttpStatus.NOT_FOUND);
    }
    return complaint;
  }

  // ── Step 6: Get All Complaints by Citizen 

  async getMyComplaints(citizenId: number): Promise<CitizenComplaintEntity[]> {
    return await this.complaintRepository.find({
      where: { citizenId },
      relations: ['feedback'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Step 7: Update Complaint Status (Admin/Officer use) 

  async updateComplaintStatus(
    complaintId: number,
    dto: UpdateComplaintStatusDto,
  ): Promise<{ message: string }> {
    const complaint = await this.complaintRepository.findOneBy({ complaintId });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${complaintId} not found`, HttpStatus.NOT_FOUND);
    }
    complaint.status = dto.status;
    await this.complaintRepository.save(complaint);
    return { message: `Complaint ${complaintId} status updated to "${dto.status}"` };
  }

  // ── Step 8: Delete Complaint 

  async deleteComplaint(complaintId: number): Promise<{ message: string }> {
    const complaint = await this.complaintRepository.findOneBy({ complaintId });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${complaintId} not found`, HttpStatus.NOT_FOUND);
    }
    await this.complaintRepository.delete(complaintId);
    return { message: `Complaint with ID ${complaintId} deleted successfully` };
  }

  // ── Step 9: Give Feedback 

  async createFeedback(dto: CreateFeedbackDto): Promise<FeedbackEntity> {
    // Check complaint exists
    const complaint = await this.complaintRepository.findOneBy({ complaintId: dto.complaintId });
    if (!complaint) {
      throw new HttpException(`Complaint with ID ${dto.complaintId} not found`, HttpStatus.NOT_FOUND);
    }

    // Only allow feedback if complaint is Resolved
    if (complaint.status !== 'Resolved') {
      throw new HttpException(
        'Feedback can only be given after complaint is Resolved',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if feedback already exists for this complaint
    const existing = await this.feedbackRepository.findOneBy({ complaintId: dto.complaintId });
    if (existing) {
      throw new HttpException(
        `Feedback already submitted for complaint ID ${dto.complaintId}`,
        HttpStatus.CONFLICT,
      );
    }

    const feedback = this.feedbackRepository.create({
      rating: dto.rating,
      comment: dto.comment,
      complaintId: dto.complaintId,
      citizenId: dto.citizenId,
    });

    return await this.feedbackRepository.save(feedback);
  }

  // ── Step 10: Get Feedback by Complaint 

  async getFeedbackByComplaint(complaintId: number): Promise<FeedbackEntity> {
    const feedback = await this.feedbackRepository.findOne({
      where: { complaintId },
      relations: ['citizen', 'complaint'],
    });
    if (!feedback) {
      throw new HttpException(`No feedback found for complaint ID ${complaintId}`, HttpStatus.NOT_FOUND);
    }
    return feedback;
  }

  // ── Step 11: Get Location Tree 
  // Static location data — replace with DB table later if needed

  getLocationTree(): object {
    return {
      corporations: [
        {
          name: 'Dhaka North City Corporation',
          zones: [
            { name: 'Zone-1', wards: ['Ward-1', 'Ward-2', 'Ward-3', 'Ward-4', 'Ward-5'] },
            { name: 'Zone-2', wards: ['Ward-6', 'Ward-7', 'Ward-8', 'Ward-9', 'Ward-10'] },
            { name: 'Zone-3', wards: ['Ward-11', 'Ward-12', 'Ward-13', 'Ward-14', 'Ward-15'] },
            { name: 'Zone-4', wards: ['Ward-16', 'Ward-17', 'Ward-18', 'Ward-19', 'Ward-20'] },
          ],
        },
        {
          name: 'Dhaka South City Corporation',
          zones: [
            { name: 'Zone-1', wards: ['Ward-1', 'Ward-2', 'Ward-3', 'Ward-4', 'Ward-5'] },
            { name: 'Zone-2', wards: ['Ward-6', 'Ward-7', 'Ward-8', 'Ward-9', 'Ward-10'] },
            { name: 'Zone-3', wards: ['Ward-11', 'Ward-12', 'Ward-13', 'Ward-14', 'Ward-15'] },
          ],
        },
        {
          name: 'Chattogram City Corporation',
          zones: [
            { name: 'Zone-1', wards: ['Ward-1', 'Ward-2', 'Ward-3', 'Ward-4'] },
            { name: 'Zone-2', wards: ['Ward-5', 'Ward-6', 'Ward-7', 'Ward-8'] },
          ],
        },
      ],
    };
  }

  // ── Helper: Find citizen by email (for auth module use) 

  async findByEmail(email: string): Promise<CitizenEntity | null> {
    const normalized = email.trim().toLowerCase();
    return await this.citizenRepository
      .createQueryBuilder('c')
      .where('LOWER(TRIM(c.email)) = :email', { email: normalized })
      .getOne();
  }
}