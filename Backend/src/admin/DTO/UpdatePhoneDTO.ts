import { IsString } from 'class-validator';

export class UpdatePhoneDTO {
  @IsString()
  phone_number?: string;
}
