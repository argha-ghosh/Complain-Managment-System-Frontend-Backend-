import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, UseInterceptors, UsePipes, ValidationPipe, UploadedFile, HttpException, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { ZOfficerService } from './ZOfficer.service';
import { CreateZoneOfficerDto, UpdateZoneOfficerDto, CreateComplaintDto, UpdateComplainDto, CreateOfficerProfileDto } from './ZOfficer.dto';
import { diskStorage, MulterError } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";




@Controller('zone-officer')
export class ZOfficerController {
  constructor(private readonly ZOfficerService: ZOfficerService) { }

  //Zone Officer
  //Creating a new Zone Officer
  @Post('create-ZoneOfficer')
  @UsePipes(new ValidationPipe())
  async CreateZoneOfficer(@Body() CreateZoneOfficerDto: CreateZoneOfficerDto): Promise<object> {
    return this.ZOfficerService.create(CreateZoneOfficerDto);
  }

  //Update Zone Officer by ID 
  @Put('update/:id')
  async updateZoneOfficer(@Param('id') id: number, @Body() UpdateZoneOfficerDto: UpdateZoneOfficerDto):
    Promise<{ message: string }> {
    return await this.ZOfficerService.updateZoneOfficer(id, UpdateZoneOfficerDto);
  }

  //Delete Zone Officer by ID
  @Delete('delete-zone-officer/:id')
  async deleteZoneOfficer(@Param('id') id: number): Promise<{ message: string }> {
    return this.ZOfficerService.deleteZoneOfficer(id);
  }

  //Get Zone Officer Details
  @Get('all')
  async getAllZoneOfficers() {
    return await this.ZOfficerService.findAll();
  }
  //Get Zone Officer by ID
  @Get(':id')
  async getZoneOfficerById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
    return await this.ZOfficerService.findOne(parsedId);
  }

  //Complaint
  //Create a new complaint with One-to-Many relationship
  @Post('create-complaint')
  @UsePipes(new ValidationPipe())
  async createComplaint(@Body() CreateComplaintDto: CreateComplaintDto & { zoneOfficerId?: number }): Promise<object> {
    return await this.ZOfficerService.createComplaint(CreateComplaintDto);
  }

  //Update Status only (One-to-Many relationship maintained)
  @Patch('update-complaint/:id')
  @UsePipes(new ValidationPipe())
  async updateComplaintStatus(@Param('id', ParseIntPipe) id: number, @Body() UpdateComplaintDto: UpdateComplainDto):
    Promise<object> {
    return this.ZOfficerService.updateComplaintStatus(id, UpdateComplaintDto.status!);
  }

  //Delete Complaint (One-to-Many relationship cleanup)
  @Delete('delete-complaint/:id')
  @UsePipes(new ValidationPipe())
  async deleteComplaint(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.ZOfficerService.deleteComplaint(id);
  }

  //Get Complaint by ID
  @Get('complaint/:id')
  async getComplaintById(@Param('id', ParseIntPipe) id: number) {
    return await this.ZOfficerService.getComplaintById(id);
  }
  // @Get('complaint/:id')
  // async getComplaintById(@Param('id') id: string) {  // id is a string
  //   const parsedId = parseInt(id, 10); // Convert id to number here
  //   if (isNaN(parsedId)) {
  //     throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
  //   }
  //   return await this.ZOfficerService.getComplaintById(parsedId);
  // }


  //Officer Profile
  //Create Officer Profile (One-to-One)
  @Post('officer-profile/create')
  @UsePipes(new ValidationPipe())
  async createOfficerProfile(@Body() createOfficerProfileDto: CreateOfficerProfileDto) {
    return await this.ZOfficerService.createOfficerProfile(createOfficerProfileDto);
  }

  //Get Complaints by Zone Officer
  @Get('officer/:officerId/complaints')
  async getComplaintsByOfficer(@Param('officerId', ParseIntPipe) officerId: number) {
    return await this.ZOfficerService.getComplaintsByOfficer(officerId);
  }

  //Get Officer Profile (One-to-One)
  @Get('officer/:officerId/profile')
  async getOfficerProfile(@Param('officerId', ParseIntPipe) officerId: number) {
    return await this.ZOfficerService.getOfficerProfile(officerId);
  }

  //Upload NID Image using Multer
  @Post('upload-nid')
  @UseInterceptors(FileInterceptor('image', {
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
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: 'File uploaded successfully', fileName: file.filename };
  }
}