import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NetworkPackagesService } from './network-packages.service';
import { CreateNetworkPackageDto } from './dto/create-network-package.dto';
import { UpdateNetworkPackageDto } from './dto/update-network-package.dto';

@ApiTags('network-packages')
@Controller('network-packages')
export class NetworkPackagesController {
  constructor(private readonly networkPackagesService: NetworkPackagesService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลแพ็กเกจเครือข่ายทั้งหมด' })
  findAll() {
    return this.networkPackagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลแพ็กเกจเครือข่ายตาม ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.networkPackagesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'สร้างแพ็กเกจเครือข่ายใหม่' })
  create(@Body() createNetworkPackageDto: CreateNetworkPackageDto) {
    return this.networkPackagesService.create(createNetworkPackageDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตข้อมูลแพ็กเกจเครือข่าย' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNetworkPackageDto: UpdateNetworkPackageDto
  ) {
    return this.networkPackagesService.update(id, updateNetworkPackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบแพ็กเกจเครือข่าย' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.networkPackagesService.remove(id);
  }
}
