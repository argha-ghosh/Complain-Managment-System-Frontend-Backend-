import {
  IsNotEmpty, IsString, IsNumber, IsOptional, IsInt, Min, Max,
} from 'class-validator';

export class RegisterEngineerDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  specialization?: string;
}

export class LoginEngineerDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class AssignComplaintDto {
  @IsNotEmpty()
  @IsNumber()
  engineerId!: number;

  @IsNotEmpty()
  @IsNumber()
  complaintId!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  comment!: string;

  @IsNotEmpty()
  @IsNumber()
  engineerId!: number;
}

export class UpdateAssignmentStatusDto {
  @IsNotEmpty()
  @IsString()
  status!: string; // Assigned | In Progress | Resolved
}