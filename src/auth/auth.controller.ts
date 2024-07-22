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
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dtos/login-dtos';
import { JwtAuthGuard } from './guards/jwt-guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Autenticação de usuário' })
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    const token = await this.authService.login(user);

    res.cookie('acess_token', token.acess_token, { httpOnly: true });
    return res.status(HttpStatus.OK).json({ user, token: token.acess_token });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('register')
  async registerNewUser(@Body() createUserDto: CreatUserDto) {
    return this.authService.registerNewUser(createUserDto);
  }
}
