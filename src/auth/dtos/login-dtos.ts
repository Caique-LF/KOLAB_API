import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
  })
  password: string;
}
