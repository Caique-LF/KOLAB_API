import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatUserDto } from './dtos/create-user-dtos';
import { User } from 'src/database/user.entity';
import { UpdateUserDto } from './dtos/update-user-dtos';
import * as bcrypt from 'bcrypt';
import { excludePassword } from 'src/utils/exclude-pass.utils';

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

    const savedUser = await this.UserRespository.save(user);

    return excludePassword(savedUser);
  }

  async findUser(id: string): Promise<User> {
    const user = await this.UserRespository.findOne({
      where: { id },
      relations: ['parentUserId'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return excludePassword(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.UserRespository.findOne({ where: { username } });
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.UserRespository.find({
      relations: ['parentUserId'],
    });
    const newArrayUsers: User[] = [];

    for (const user of users) {
      const userWithoutpass = excludePassword(user);
      newArrayUsers.push(userWithoutpass);
    }

    return newArrayUsers;
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

    await this.UserRespository.save({ ...user, ...transformedUpdateDto });

    const updatedUser = await this.UserRespository.findOne({
      where: { id },
      relations: ['parentUserId'],
    });

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado após a atualização');
    }

    return excludePassword(updatedUser);
  }

  async deleteUser(id: string): Promise<any> {
    const user = await this.UserRespository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.UserRespository.delete({ id });

    return { mensagem: 'usuário excluido' };
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

        tree.push(excludePassword(user));
      }
    }

    return tree;
  }
}
