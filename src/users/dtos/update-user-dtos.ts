import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Para atualizar um usuario deverá ser informado um nome.',
    example: 'João silva',
  })
  username?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Para atualizar um usuario poderá ser informado uma senha.',
    example: 'joao1234',
  })
  password?: string;

  @IsOptional()
  @IsString()
  parentUserId: string;
}
