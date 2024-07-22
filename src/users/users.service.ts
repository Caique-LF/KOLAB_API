import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { CreatUserDto } from './dtos/create-user-dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRespository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreatUserDto): Promise<any> {
    const pass = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = pass;

    const user = this.UserRespository.create({
      ...createUserDto,
      parentUserId: createUserDto.parentUserId
        ? { id: createUserDto.parentUserId }
        : null,
    });

    this.UserRespository.save(user);
  }
}
