import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Para criar um usuario deverá ser informado um nome.',
    example: 'João silva',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Para criarum usuario deverá ser informada uma senha',
    example: 'joao1234',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'campo opcional, caso não queira informar por favor apague-o.',
  })
  parentUserId?: string;
}
