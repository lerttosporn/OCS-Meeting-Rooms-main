import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'ดูองค์กรทั้งหมด' })
  @ApiResponse({ status: 200, description: 'รายการองค์กรทั้งหมด' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดูองค์กรตาม ID' })
  @ApiParam({ name: 'id', description: 'org_id', example: 1 })
  @ApiResponse({ status: 200, description: 'ข้อมูลองค์กร' })
  @ApiResponse({ status: 404, description: 'ไม่พบองค์กร' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างองค์กรใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ' })
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลองค์กร' })
  @ApiParam({ name: 'id', description: 'org_id', example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ลบองค์กร' })
  @ApiParam({ name: 'id', description: 'org_id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }
}
