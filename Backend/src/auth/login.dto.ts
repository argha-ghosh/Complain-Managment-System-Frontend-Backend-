import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+@gmail\.com$/, {
    message: 'Email must match the same format as zone officer registration',
  })
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
