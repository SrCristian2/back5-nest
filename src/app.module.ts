import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist';

import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.MONGO_URI),

    UserModule,

    CategoryModule,

    ProductModule,

    FacturaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
