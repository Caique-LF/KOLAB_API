import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user-dtos';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookiesguards';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtCookieGuard)
  // @ApiBearerAuth()
  @ApiCookieAuth()
  @Get('tree')
  async findTree() {
    return this.userService.findTree();
  }

  @UseGuards(JwtCookieGuard)
  @ApiCookieAuth()
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

  @UseGuards(JwtCookieGuard)
  @ApiCookieAuth()
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtCookieGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @Delete(':id')
  async delelteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
