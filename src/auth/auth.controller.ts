import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CreatUserDto } from 'src/users/dtos/create-user-dtos';
import { LocalAuthGuard } from './guards/local-guards';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login-dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Autenticação de usuário' })
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const token = await this.authService.login(user);

    res.cookie('jwt', token.acess_token, { httpOnly: true });
    return {
      user: {
        id: user,
      },
      token: token.acess_token,
    };
  }

  @Post('logout')
  logout(@Res() response: Response) {
    response.clearCookie('jwt'); // Nome do cookie onde o token está armazenado
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Logout successful' });
  }

  @Post('register')
  async registerNewUser(@Body() createUserDto: CreatUserDto) {
    return this.authService.registerNewUser(createUserDto);
  }
}
