import {
  Body, Controller, Get, Param, Patch, Post,
  UseInterceptors, UsePipes, ValidationPipe,
  UploadedFile, HttpException, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

import { FieldEngineerService } from './field-engineer.service';
import {
  RegisterEngineerDto, LoginEngineerDto,
  AssignComplaintDto, AddCommentDto, UpdateAssignmentStatusDto,
} from './field-engineer.dto';

@Controller('field-engineer')
export class FieldEngineerController {
  constructor(private readonly fieldEngineerService: FieldEngineerService) {}

  // ── Auth
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: RegisterEngineerDto): Promise<object> {
    return await this.fieldEngineerService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginEngineerDto): Promise<object> {
    return await this.fieldEngineerService.login(dto);
  }

  // ── Engineers
  @Get('all')
  async getAllEngineers(): Promise<object> {
    return await this.fieldEngineerService.getAllEngineers();
  }

  @Get(':id')
  async getEngineerById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.fieldEngineerService.getEngineerById(id);
  }

  // ── Assignments
  @Post('assign')
  @UsePipes(new ValidationPipe())
  async assignComplaint(@Body() dto: AssignComplaintDto): Promise<object> {
    return await this.fieldEngineerService.assignComplaint(dto);
  }

  @Get(':engineerId/complaints')
  async getAssignedComplaints(
    @Param('engineerId', ParseIntPipe) engineerId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getAssignedComplaints(engineerId);
  }

  @Get('assignment/:assignmentId')
  async getAssignmentById(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getAssignmentById(assignmentId);
  }

  // ── Status Update (Mark In Progress / Resolved)
  @Patch('assignment/:assignmentId/status')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: UpdateAssignmentStatusDto,
  ): Promise<object> {
    return await this.fieldEngineerService.updateStatus(assignmentId, dto);
  }

  // ── Upload Repair Photo
  @Post('assignment/:assignmentId/photo')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      storage: diskStorage({
        destination: './uploads/repairs',
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadRepairPhoto(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ): Promise<object> {
    if (!file) {
      throw new HttpException('Image file is required', HttpStatus.BAD_REQUEST);
    }
    const imageUrl = `uploads/repairs/${file.filename}`;
    return await this.fieldEngineerService.uploadRepairPhoto(assignmentId, imageUrl, caption);
  }

  // ── Get Photos
  @Get('assignment/:assignmentId/photos')
  async getPhotos(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getPhotosByAssignment(assignmentId);
  }

  // ── Add Comment
  @Post('assignment/:assignmentId/comment')
  @UsePipes(new ValidationPipe())
  async addComment(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: AddCommentDto,
  ): Promise<object> {
    return await this.fieldEngineerService.addComment(assignmentId, dto);
  }

  // ── Get Comments
  @Get('assignment/:assignmentId/comments')
  async getComments(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getCommentsByAssignment(assignmentId);
  }
}