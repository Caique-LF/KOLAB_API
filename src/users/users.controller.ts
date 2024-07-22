import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatUserDto } from './dtos/create-user-dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreatUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
