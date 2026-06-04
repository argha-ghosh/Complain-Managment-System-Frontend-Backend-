import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsIn, IsOptional } from 'class-validator';

export class AdminDTO {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  @Matches(/^[a-zA-Z0-9._-]+@citycorporation\.bd$/, {
    message: 'Email must be from citycorporation.bd domain',
  })
  email?: string;

  @IsNotEmpty({ message: 'Password field is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
  password?: string;

  @IsNotEmpty({ message: 'Gender field is required.' })
  @IsIn(['male', 'female'], { message: 'Invalid gender' })
  gender?: string;

  @IsNotEmpty({ message: 'Phone number field is required.' })
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must start with 01 and be 11 digits long.',
  })
  phone_number?: string;

  @IsOptional()
  filename?: string;
}
