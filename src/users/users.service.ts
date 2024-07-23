import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatUserDto } from './dtos/create-user-dtos';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/user.entity';
import { UpdateUserDto } from './dtos/update-user-dtos';

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

  async findUser(id: string): Promise<User> {
    const user = await this.UserRespository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.UserRespository.findOne({ where: { username } });
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return this.UserRespository.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.UserRespository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const transformedUpdateDto = {
      ...updateUserDto,
      parentUserId: updateUserDto.parentUserId
        ? { id: updateUserDto.parentUserId }
        : null,
    };

    await this.UserRespository.update({ id }, transformedUpdateDto);

    return this.UserRespository.findOne({ where: { id } });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.UserRespository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.UserRespository.delete({ id });
  }

  async findTree(): Promise<User[]> {
    const users = await this.UserRespository.find();
    return this.buildTree(users);
  }

  private buildTree(users: User[]): User[] {
    const tree: User[] = [];

    for (const user of users) {
      user.children = [];
    }

    for (const user of users) {
      if (user.parentUserId) {
        for (const potentialParent of users) {
          if (user.parentUserId.id === potentialParent.id) {
            potentialParent.children.push(user);
            break;
          }
        }
      } else {
        tree.push(user);
      }
    }

    return tree;
  }
}
