import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatUserDto } from './dtos/create-user-dtos';
import { User } from 'src/database/user.entity';
import { UpdateUserDto } from './dtos/update-user-dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRespository: Repository<User>,
  ) {}

  async createUser(creatUserDto: CreatUserDto): Promise<User> {
    const user = this.UserRespository.create({
      ...creatUserDto,
      parentUserId: creatUserDto.parentUserId
        ? { id: creatUserDto.parentUserId }
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
    const user = await this.UserRespository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    const transformedUpdateDto = {
      ...updateUserDto,
      parentUserId: updateUserDto.parentUserId
        ? { id: updateUserDto.parentUserId }
        : null,
    };

    const Updateduser = { ...user, ...transformedUpdateDto };

    await this.UserRespository.save(Updateduser);

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
    const users = await this.UserRespository.find({
      relations: ['parentUserId', 'children'],
    });
    return this.buildTree(users, null);
  }

  private buildTree(users: User[], parentId: string | null): User[] {
    const tree: User[] = [];

    for (const user of users) {
      if (
        (parentId === null && user.parentUserId === null) ||
        (user.parentUserId && user.parentUserId.id === parentId)
      ) {
        const children = this.buildTree(users, user.id);
        user.children = children;

        user.children.forEach((child) => {
          delete child.parentUserId;
        });

        tree.push(user);
      }
    }

    return tree;
  }
}
