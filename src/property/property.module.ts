import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PropertyService } from './property.service'; // Updated to PropertyService
import { PropertyController } from './property.controller'; // Updated to PropertyController
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from 'src/shared/schema/property'; // Updated to Property
import { Users, UserSchema } from 'src/shared/schema/users';
import config from 'config';
import { AuthMiddleware } from 'src/shared/middleware/auth';
import { PropertyRepository } from 'src/shared/repositories/property.repository'; // Updated to PropertyRepository
import { UserRepository } from 'src/shared/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/shared/middleware/roles.guard';
import { License, LicenseSchema } from 'src/shared/schema/license';
import { Orders, OrderSchema } from 'src/shared/schema/orders';
import { OrdersRepository } from 'src/shared/repositories/order.repository';
import Stripe from 'stripe';

@Module({
  controllers: [PropertyController], // Updated to PropertyController
  providers: [
    PropertyService, // Updated to PropertyService
    PropertyRepository, // Updated to PropertyRepository
    UserRepository,
    OrdersRepository,
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(config.get('stripe.secret_key'), {
          apiVersion: '2025-01-27.acacia'
        });
      },
    },
  ],
  imports: [
    MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema }]), // Updated to Property
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
    MongooseModule.forFeature([{ name: Orders.name, schema: OrderSchema }]),
  ],
})
export class PropertyModule implements NestModule { // Updated to PropertyModule
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: `${config.get('appPrefix')}/properties`, // Updated to properties
          method: RequestMethod.GET,
        },
        {
          path: `${config.get('appPrefix')}/properties/:id`, // Updated to properties
          method: RequestMethod.GET,
        },
      )
      .forRoutes(PropertyController); // Updated to PropertyController
  }
}