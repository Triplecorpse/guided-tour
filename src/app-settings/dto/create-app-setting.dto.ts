import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppSettingDto {
  @ApiProperty({
    example: 'theme',
    description: 'The unique key for the setting',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: 'dark',
    description: 'The value for the setting',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
