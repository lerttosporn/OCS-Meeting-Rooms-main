import 'dotenv/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { RoomRatesModule } from './room-rates/room-rates.module';
import { CartsModule } from './carts/carts.module';
import { PaymentsModule } from './payments/payments.module';
import { ToolsModule } from './tools/tools.module';
import { ToolMaintenanceModule } from './tool-maintenance/tool-maintenance.module';
import { CateringModule } from './catering/catering.module';
import { NetworkPackagesModule } from './network-packages/network-packages.module';
import { BookingPenaltiesModule } from './booking-penalties/booking-penalties.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { BookingDetailsModule } from './booking-details/booking-details.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationsModule,
    UsersModule,
    RoomTypesModule,
    RoomsModule,
    BookingsModule,
    RoomRatesModule,
    CartsModule,
    PaymentsModule,
    ToolsModule,
    ToolMaintenanceModule,
    CateringModule,
    NetworkPackagesModule,
    BookingPenaltiesModule,
    CartItemsModule,
    BookingDetailsModule,
  ],
})
export class AppModule {}
