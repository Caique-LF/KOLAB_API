import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'Maria silva',
  })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Maria1234',
  })
  password: string;
}
