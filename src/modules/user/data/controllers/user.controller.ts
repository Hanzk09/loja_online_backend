import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from '../../domain/models/dto/create-user.dto';
import { User } from '../../domain/models/entities/user.entity';
import { UpdateUserDto } from '../../domain/models/dto/update-user.dto';
import { IUserController } from '../../domain/controllers/user.controller.interface';
import { IUserService } from '../../domain/services/user.service.interface';
import { JwtAuthGuard } from 'src/modules/auth/data/guards/jwt-auth.guard';

@Controller('user')
export class UserController implements IUserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('take', new ParseIntPipe()) take: number,
    @Query('skip', new ParseIntPipe()) skip: number,
  ): Promise<User[]> {
    return await this.userService.findAll(take, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.remove(+id);
  }
}
