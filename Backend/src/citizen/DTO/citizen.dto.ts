import {
  IsNotEmpty, IsString, Matches, IsNumber, IsOptional,
  IsEmail, Min, Max, IsInt,
} from 'class-validator';


export class RegisterCitizenDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only letters and spaces' })
  name!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'Phone must be 11 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  nid?: string;
}

export class LoginCitizenDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}


export class CreateCitizenComplaintDto {
  @IsOptional()
  @IsNumber()
  citizenId?: number;

  // Location Hierarchy
  @IsNotEmpty()
  @IsString()
  corporation!: string;   // e.g. "Dhaka North City Corporation"

  @IsNotEmpty()
  @IsString()
  zone!: string;           // e.g. "Zone-1"

  @IsNotEmpty()
  @IsString()
  ward!: string;           // e.g. "Ward-10"

  // Complaint Info
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s.,!?-]+$/, { message: 'Title contains invalid characters' })
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}

export class UpdateComplaintStatusDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(Pending|In Progress|Resolved|Rejected)$/, {
    message: 'Status must be: Pending | In Progress | Resolved | Rejected',
  })
  status!: string;
}


export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsNumber()
  complaintId!: number;

  @IsNotEmpty()
  @IsNumber()
  citizenId!: number;
}