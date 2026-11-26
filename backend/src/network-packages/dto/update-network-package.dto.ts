import { PartialType } from '@nestjs/swagger';
import { CreateNetworkPackageDto } from './create-network-package.dto';

export class UpdateNetworkPackageDto extends PartialType(CreateNetworkPackageDto) {}
