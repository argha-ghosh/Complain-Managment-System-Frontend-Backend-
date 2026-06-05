import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { AdminEntity } from './admin.entity';
import { ProfileEntity } from './profile.entity';
import { ZoneOfficerEntity } from './zoneOfficer.entity';
import { AdminDTO } from './DTO/AdminDTO';
import { UpdatePhoneDTO } from './DTO/UpdatePhoneDTO';
import { pusher } from '../pusher/pusher.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(ZoneOfficerEntity)
    private zoneOfficerRepository: Repository<ZoneOfficerEntity>,
    private mailService: MailerService,
    private jwtService: JwtService,
  ) {}

  getAllAdmins() {
    return this.adminRepository.find();
  }

  getAdminById(id: number) {
    return this.adminRepository.findOne({ where: { id } });
  }

  getZoneOfficer(id: number) {
    return this.adminRepository.findOneBy({ id });
  }

  getEngineer(id: number) {
    return this.adminRepository.findOneBy({ id });
  }

  async createAdmin(dto: AdminDTO) {
    const salt = await bcrypt.genSalt();
    dto.password = await bcrypt.hash(dto.password!, salt);
    return this.adminRepository.save(dto);
  }

  deleteAdmin(name: string) {
    return this.adminRepository.delete({ name });
  }

  async updateAdmin(id: number, mydata: AdminDTO) {
    if (mydata.password) {
      const salt = await bcrypt.genSalt();
      mydata.password = await bcrypt.hash(mydata.password, salt);
    }
    return this.adminRepository.update(id, mydata);
  }

  updateAdminPartial(id: number, mydata: UpdatePhoneDTO) {
    return this.adminRepository.update(id, mydata);
  }

  searchAdmin(name: string) {
    return this.adminRepository.find({ where: { name } });
  }

  async createOfficer(data: any) {
    const admin = await this.adminRepository.findOneBy({ id: data.adminId });
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    const officer = this.zoneOfficerRepository.create({
      name: data.name,
      zone: data.zone,
      admin: admin,
    });
    return this.zoneOfficerRepository.save(officer);
  }

  getOfficers() {
    return this.zoneOfficerRepository.find({ relations: ['admin'] });
  }

  async deleteOfficer(id: number) {
    const officer = await this.zoneOfficerRepository.delete(id);
    // await pusher.trigger('admin-channel', 'officer-delete', {
    //   message: 'Officer Deleted Successfully.',
    // });
    return officer;
  }

  async updateOfficer(id: number, data: any) {
    const officer = await this.zoneOfficerRepository.update(id, data);
    // await pusher.trigger('admin-channel', 'officer-update', {
    //   message: 'You successfully updated officer account',
    // });
    return officer;
  }

  searchOfficer(name: string) {
    return this.zoneOfficerRepository.find({ where: { name }, relations: ['admin'] });
  }

  async signin(mydata: AdminDTO) {
    const admin = await this.adminRepository.findOneBy({ email: mydata.email });
    if (!admin || !mydata.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const match = await bcrypt.compare(mydata.password, admin.password!);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { sub: admin.id, email: admin.email };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login Successful',
      access_token: token,
      id: admin.id,
      name: admin.name,
    };
  }

  async createProfile(mydata: any) {
    const admin = await this.adminRepository.findOneBy({ id: mydata.adminId });
    if (!admin) {
      throw new Error('Admin not found');
    }
    const existingProfile = await this.profileRepository.findOne({
      where: { admin: { id: mydata.adminId } },
    });
    if (existingProfile) {
      throw new HttpException('This admin already has a profile.', HttpStatus.BAD_REQUEST);
    }
    const profile = this.profileRepository.create({
      address: mydata.address,
      department: mydata.department,
      admin: admin,
    });
    return this.profileRepository.save(profile);
  }

  async sendmail(data: any) {
    return await this.mailService.sendMail({
      to: data.email,
      subject: data.subject,
      text: data.text,
    });
  }
}
