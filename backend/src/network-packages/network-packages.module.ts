import { Module } from '@nestjs/common';
import { NetworkPackagesController } from './network-packages.controller';
import { NetworkPackagesService } from './network-packages.service';

@Module({
  controllers: [NetworkPackagesController],
  providers: [NetworkPackagesService]
})
export class NetworkPackagesModule {}
