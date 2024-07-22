import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatUserDto } from './dtos/create-user-dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user-dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findUser(id);

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    const { ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put()
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async delelteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
