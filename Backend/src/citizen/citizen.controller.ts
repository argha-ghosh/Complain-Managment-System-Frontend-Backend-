import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  UseGuards, UseInterceptors, UsePipes, ValidationPipe,
  UploadedFile, HttpException, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage, MulterError } from 'multer';

import { CitizenService } from './citizen.service';
import { CitizenAuthGuard } from './citizen-auth.guard';
import {
  RegisterCitizenDto, LoginCitizenDto,
  CreateCitizenComplaintDto, UpdateComplaintStatusDto,
  CreateFeedbackDto,
} from './DTO/citizen.dto';

@Controller('citizen')
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 1 & 2 — Auth
  // ────────────────────────────────────────────────────────────────────────────

  // POST /citizen/register
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: RegisterCitizenDto): Promise<object> {
    return await this.citizenService.register(dto);
  }

  // POST /citizen/login
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginCitizenDto): Promise<object> {
    return await this.citizenService.login(dto);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 3 — Profile
  // ────────────────────────────────────────────────────────────────────────────

  // GET /citizen/profile/:id
  @UseGuards(CitizenAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.citizenService.getProfile(id);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 4 — Submit Complaint (with optional image upload)
  // ────────────────────────────────────────────────────────────────────────────

  // POST /citizen/complaint/submit
  // Form-data fields: corporation, zone, ward, title, description, citizenId (optional), image (optional file)
  @UseGuards(CitizenAuthGuard)
  @Post('complaint/submit')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
      storage: diskStorage({
        destination: './uploads/complaints',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async submitComplaint(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCitizenComplaintDto,
  ): Promise<object> {
    // Convert citizenId string → number (multipart/form-data sends strings)
    if (dto.citizenId) {
      dto.citizenId = Number(dto.citizenId);
    }

    const imageUrl = file ? `uploads/complaints/${file.filename}` : undefined;
    return await this.citizenService.createComplaint(dto, imageUrl);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 5 — Track Complaint
  // ────────────────────────────────────────────────────────────────────────────

  // GET /citizen/complaint/track/:id
  @Get('complaint/track/:id')
  async trackComplaint(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.citizenService.trackComplaint(id);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 6 — My Complaints
  // ────────────────────────────────────────────────────────────────────────────

  // GET /citizen/:citizenId/complaints
  @UseGuards(CitizenAuthGuard)
  @Get(':citizenId/complaints')
  async getMyComplaints(@Param('citizenId', ParseIntPipe) citizenId: number): Promise<object> {
    return await this.citizenService.getMyComplaints(citizenId);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 7 — Update Complaint Status (Officer / Admin)
  // ────────────────────────────────────────────────────────────────────────────

  // PATCH /citizen/complaint/status/:id
  @UseGuards(AuthGuard('jwt'))
  @Patch('complaint/status/:id')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComplaintStatusDto,
  ): Promise<object> {
    return await this.citizenService.updateComplaintStatus(id, dto);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 8 — Delete Complaint
  // ────────────────────────────────────────────────────────────────────────────

  // DELETE /citizen/complaint/:id
  @UseGuards(CitizenAuthGuard)
  @Delete('complaint/:id')
  async deleteComplaint(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.citizenService.deleteComplaint(id);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 9 — Give Feedback
  // ────────────────────────────────────────────────────────────────────────────

  // POST /citizen/feedback
  @UseGuards(CitizenAuthGuard)
  @Post('feedback')
  @UsePipes(new ValidationPipe())
  async createFeedback(@Body() dto: CreateFeedbackDto): Promise<object> {
    return await this.citizenService.createFeedback(dto);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 10 — Get Feedback for a Complaint
  // ────────────────────────────────────────────────────────────────────────────

  // GET /citizen/feedback/complaint/:complaintId
  @UseGuards(CitizenAuthGuard)
  @Get('feedback/complaint/:complaintId')
  async getFeedback(@Param('complaintId', ParseIntPipe) complaintId: number): Promise<object> {
    return await this.citizenService.getFeedbackByComplaint(complaintId);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STEP 11 — Location Tree (Corporation → Zone → Ward)
  // ────────────────────────────────────────────────────────────────────────────

  // GET /citizen/locations
  @Get('locations')
  getLocations(): object {
    return this.citizenService.getLocationTree();
  }

  // NOTE: Keep this generic :id route LAST to avoid intercepting named routes above
  // GET /citizen/:id
  @UseGuards(CitizenAuthGuard)
  @Get(':id')
  async getCitizenById(@Param('id') id: string): Promise<object> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
    return await this.citizenService.getProfile(parsedId);
  }
}
