import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreatUserDto } from 'src/users/dtos/create-user-dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Nome de Usuário ou senha incorretos.');
    }

    const validatePass = await bcrypt.compare(pass, user.password);

    if (!validatePass) {
      return null;
    }

    return user.id;
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };

    return {
      acess_token: this.jwtService.sign(payload),
    };
  }

  async registerNewUser(createUserDto: CreatUserDto) {
    const userExist = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExist !== null) {
      throw new BadRequestException(
        'Nome de usuário já em uso. Por favor tente outro.',
      );
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersService.createUser(createUserDto);

    return newUser;
  }
}
