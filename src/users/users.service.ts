import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatUserDto } from './dtos/create-user-dtos';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRespository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreatUserDto): Promise<User> {
    const pass = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = pass;

    const user = this.UserRespository.create({
      ...createUserDto,
      parentUserId: createUserDto.parentUserId
        ? { id: createUserDto.parentUserId }
        : null,
    });

    return this.UserRespository.save(user);
  }
}
