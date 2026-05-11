import { IsNotEmpty, IsString, Matches, IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';

//Zone Officer
export class CreateZoneOfficerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  
  name?: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+@gmail\.com$/, {
    message: 'Email must contain letters/numbers before @ and .com domain',
  })
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsNumber()
  nid?: number;
}

export class UpdateZoneOfficerDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name?: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+@gmail\.com$/, {
    message: 'Email must contain letters/numbers before @ and .com domain',
  })
  email?: string;

  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsNumber()
  nid?: number;
}

//Complaint
export class CreateComplaintDto {
  @IsOptional()
  @IsNumber()
  zoneOfficerId?: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Zone name must contain only letters and spaces',
  })
  zoneName?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Area name must contain only letters and spaces',
  })
  areaName?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s.,!?]+$/, {
    message:
      'Description can only contain letters, numbers, spaces and basic punctuation',
  })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Pending|In Progress|Resolved)$/, {
    message: 'Status must be either Pending, In Progress or Resolved',
  })
  status?: string;
}

export class UpdateComplainDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(Pending|In Progress|Resolved)$/, {
    message: 'Status must be either Pending, In Progress or Resolved',
  })
  status?: string;
}

// Officer Profile DTO (One-to-One)
export class CreateOfficerProfileDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Department must contain only letters and spaces',
  })
  department?: string;

  @IsNotEmpty()
  @IsNumber()
  experienceYears?: number;

  @IsNotEmpty()
  @IsString()
  joinDate?: string;

  @IsNotEmpty()
  @IsNumber()
  zoneOfficerId?: number;
}