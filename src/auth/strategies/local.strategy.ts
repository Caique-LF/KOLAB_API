import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ username: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    const userExist = await this.authService.validateUser(username, password);

    if (!userExist) {
      throw new UnauthorizedException('Nome de usuário ou senha incorreta.');
    }

    return userExist;
  }
}
