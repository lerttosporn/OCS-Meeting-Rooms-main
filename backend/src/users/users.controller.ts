import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto, RegisterDto, GoogleLoginDto } from './dto/auth.dto';

@ApiTags('auth / users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── AUTH ─────────────────────────────────────────────────────────────────

  @Post('register')
  @ApiOperation({ summary: 'สมัครสมาชิกใหม่' })
  @ApiResponse({ status: 201, description: 'สมัครสำเร็จ — คืน user + JWT token' })
  @ApiResponse({ status: 409, description: 'อีเมลนี้ถูกใช้งานแล้ว' })
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'เข้าสู่ระบบ' })
  @ApiResponse({ status: 200, description: 'Login สำเร็จ — คืน user + JWT token' })
  @ApiResponse({ status: 401, description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วย Google' })
  @ApiResponse({ status: 200, description: 'Login สำเร็จ — คืน user + JWT token' })
  @ApiResponse({ status: 401, description: 'Token ไม่ถูกต้อง' })
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.usersService.googleLogin(dto);
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'ดู profile ของตัวเอง (ใช้ user id จาก token)' })
  @ApiParam({ name: 'id', description: 'user id', example: 1 })
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfile(id);
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'ดู user ทั้งหมด' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดู user ตาม ID' })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้าง user ใหม่ (Admin)' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไข user' })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ลบ user' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

