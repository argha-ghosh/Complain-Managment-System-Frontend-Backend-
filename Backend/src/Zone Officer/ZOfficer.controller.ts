import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put,
  UseGuards, UseInterceptors, UsePipes, ValidationPipe,
  UploadedFile, HttpException, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import { ZOfficerService } from './ZOfficer.service';
import {
  CreateZoneOfficerDto, UpdateZoneOfficerDto,
  CreateComplaintDto, UpdateComplainDto, CreateOfficerProfileDto,
} from './ZOfficer.dto';
import { diskStorage, MulterError } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { OtpService } from './otp.service';

@Controller('zone-officer')
export class ZOfficerController {
  constructor(
    private readonly ZOfficerService: ZOfficerService,
    private readonly otpService: OtpService,
  ) {}

  // Send OTP
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    await this.otpService.sendOtp(email);
    return { message: `An OTP is sent to ${email}` };
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    const isValid = this.otpService.verifyOtp(email, otp);
    if (isValid) {
      return { message: 'OTP verified successfully' };
    } else {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }
  }

  // Create Zone Officer
  @Post('create-ZoneOfficer')
  @UsePipes(new ValidationPipe())
  async CreateZoneOfficer(@Body() CreateZoneOfficerDto: CreateZoneOfficerDto): Promise<object> {
    return this.ZOfficerService.create(CreateZoneOfficerDto);
  }

  // Update Zone Officer by ID
  @Put('update/:id')
  async updateZoneOfficer(
    @Param('id') id: number,
    @Body() UpdateZoneOfficerDto: UpdateZoneOfficerDto,
  ): Promise<{ message: string }> {
    return await this.ZOfficerService.updateZoneOfficer(id, UpdateZoneOfficerDto);
  }

  // Delete Zone Officer by ID
  @Delete('delete-zone-officer/:id')
  async deleteZoneOfficer(@Param('id') id: number): Promise<{ message: string }> {
    return this.ZOfficerService.deleteZoneOfficer(id);
  }

  // Get All Zone Officers
  @Get('all')
  async getAllZoneOfficers() {
    return await this.ZOfficerService.findAll();
  }

  // Create Complaint
  @Post('create-complaint')
  @UsePipes(new ValidationPipe())
  async createComplaint(
    @Body() CreateComplaintDto: CreateComplaintDto & { zoneOfficerId?: number },
  ): Promise<object> {
    return await this.ZOfficerService.createComplaint(CreateComplaintDto);
  }

  // Update Complaint Status
  @Patch('update-complaint/:id')
  @UsePipes(new ValidationPipe())
  async updateComplaintStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateComplaintDto: UpdateComplainDto,
  ): Promise<object> {
    return this.ZOfficerService.updateComplaintStatus(id, UpdateComplaintDto.status!);
  }

  // Delete Complaint
  @Delete('delete-complaint/:id')
  @UsePipes(new ValidationPipe())
  async deleteComplaint(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.ZOfficerService.deleteComplaint(id);
  }

  // Get Complaint by ID
  @Get('complaint/:id')
  async getComplaintById(@Param('id', ParseIntPipe) id: number) {
    return await this.ZOfficerService.getComplaintById(id);
  }

  // Get Complaints by Zone Officer
  @Get('officer/:officerId/complaints')
  async getComplaintsByOfficer(@Param('officerId', ParseIntPipe) officerId: number) {
    return await this.ZOfficerService.getComplaintsByOfficer(officerId);
  }

  // Create Officer Profile (One-to-One)
  @Post('officer-profile/create')
  @UsePipes(new ValidationPipe())
  async createOfficerProfile(@Body() createOfficerProfileDto: CreateOfficerProfileDto) {
    return await this.ZOfficerService.createOfficerProfile(createOfficerProfileDto);
  }

  // Get Officer Profile (One-to-One)
  @Get('officer/:officerId/profile')
  async getOfficerProfile(@Param('officerId', ParseIntPipe) officerId: number) {
    return await this.ZOfficerService.getOfficerProfile(officerId);
  }

  // Upload NID Image
  @Post('upload-nid')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded successfully', fileName: file.filename };
  }

  // NOTE: @Get(':id') must always be last — otherwise it intercepts named routes above
  @Get(':id')
  async getZoneOfficerById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
    return await this.ZOfficerService.findOne(parsedId);
  }
}
