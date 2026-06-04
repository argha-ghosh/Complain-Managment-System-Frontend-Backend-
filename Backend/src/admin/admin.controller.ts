import {
  Controller, Get, Post, Body, Delete, Param, Put, Patch,
  Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile,
  Res, HttpException, HttpStatus, UnauthorizedException, UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { diskStorage, MulterError } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminDTO } from './DTO/AdminDTO';
import { UpdatePhoneDTO } from './DTO/UpdatePhoneDTO';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Auth
  @Post('signin')
  async signin(@Body() mydto: AdminDTO) {
    const result = await this.adminService.signin(mydto);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return result;
  }

  // Admin CRUD
  @Post('createAdmin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 300000 },
    }),
  )
  @UsePipes(new ValidationPipe())
  createAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AdminDTO,
  ): object {
    dto.filename = file ? file.filename : '';
    return this.adminService.createAdmin(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getAllAdmin')
  async getAllAdmins() {
    try {
      return await this.adminService.getAllAdmins();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Failed to fetch admins' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getAdminby/:id')
  getAdminById(@Param('id') id: number): object {
    return this.adminService.getAdminById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:name')
  deleteAdmin(@Param('name') name: string): object {
    return this.adminService.deleteAdmin(name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updateAdmin(@Param('id') id: number, @Body() mydata: AdminDTO): object {
    return this.adminService.updateAdmin(id, mydata);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('partialupdate/:id')
  updateAdminPartial(@Param('id') id: number, @Body() mydata: UpdatePhoneDTO): object {
    return this.adminService.updateAdminPartial(id, mydata);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  SearchAdmin(@Query('name') name: string): object {
    return this.adminService.searchAdmin(name);
  }

  // Profile
  @UseGuards(AuthGuard('jwt'))
  @Post('createProfile')
  createProfile(@Body() data: any) {
    return this.adminService.createProfile(data);
  }

  // Zone Officer (admin-managed)
  @UseGuards(AuthGuard('jwt'))
  @Get('getZoneOfficerby/:id')
  getZoneOfficer(@Param('id') id: number): object {
    return this.adminService.getZoneOfficer(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getEngineerby/:id')
  getEngineer(@Param('id') id: number): object {
    return this.adminService.getEngineer(id);
  }

  @Post('createOfficer')
  createOfficer(@Body() data: any) {
    return this.adminService.createOfficer(data);
  }

  @Get('officers')
  getOfficers() {
    return this.adminService.getOfficers();
  }

  @Delete('officer/:id')
  deleteOfficer(@Param('id') id: number) {
    return this.adminService.deleteOfficer(id);
  }

  @Get('searchOfficer')
  searchOfficer(@Query('name') name: string) {
    return this.adminService.searchOfficer(name);
  }

  @Put('officer/:id')
  updateOfficer(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateOfficer(id, data);
  }

  // Image
  @Get('getimage/:name')
  getImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads' });
  }

  // Mail
  @Post('sendmail')
  sendMail(@Body() data: any) {
    return this.adminService.sendmail(data);
  }
}
