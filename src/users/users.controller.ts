import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatUserDto } from './dtos/create-user-dtos';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user-dtos';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreatUserDto) {
    const user = await this.userService.findByUsername(createUserDto.username);
    if (user) {
      throw new BadRequestException(
        'Nome de usuário já em uso. Por favor tente outro.',
      );
    }
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findUser(id);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    const { ...result } = user;
    return result;
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Put()
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
