import {
  Body, Controller, Get, Param, Patch, Post,
  UseGuards, UseInterceptors, UsePipes, ValidationPipe,
  UploadedFile, HttpException, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage, MulterError } from 'multer';

import { FieldEngineerService } from './field-engineer.service';
import { FieldEngineerAuthGuard } from './field-engineer-auth.guard';
import {
  RegisterEngineerDto, LoginEngineerDto,
  AssignComplaintDto, AddCommentDto, UpdateAssignmentStatusDto,
} from './DTO/field-engineer.dto';

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

  // ── All Engineers
  @Get('all')
  async getAllEngineers(): Promise<object> {
    return await this.fieldEngineerService.getAllEngineers();
  }

  // ── Assign
  @Post('assign')
  @UsePipes(new ValidationPipe())
  async assignComplaint(@Body() dto: AssignComplaintDto): Promise<object> {
    return await this.fieldEngineerService.assignComplaint(dto);
  }

  // ── Assignment routes (named routes আগে — wildcard এর আগে রাখা জরুরি)
  @Get('assignment/:assignmentId')
  async getAssignmentById(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getAssignmentById(assignmentId);
  }

  @Patch('assignment/:assignmentId/status')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: UpdateAssignmentStatusDto,
  ): Promise<object> {
    return await this.fieldEngineerService.updateStatus(assignmentId, dto);
  }

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

  @Get('assignment/:assignmentId/photos')
  async getPhotos(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getPhotosByAssignment(assignmentId);
  }

  @Post('assignment/:assignmentId/comment')
  @UsePipes(new ValidationPipe())
  async addComment(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
    @Body() dto: AddCommentDto,
  ): Promise<object> {
    return await this.fieldEngineerService.addComment(assignmentId, dto);
  }

  @Get('assignment/:assignmentId/comments')
  async getComments(
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getCommentsByAssignment(assignmentId);
  }

  // ── Wildcard routes সবার শেষে
  @Get(':engineerId/complaints')
  async getAssignedComplaints(
    @Param('engineerId', ParseIntPipe) engineerId: number,
  ): Promise<object> {
    return await this.fieldEngineerService.getAssignedComplaints(engineerId);
  }

  @Get(':id')
  async getEngineerById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.fieldEngineerService.getEngineerById(id);
  }
}
