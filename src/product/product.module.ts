import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import productSchema, { Product } from './entities/product.entity';
import facturaSchema, { Factura } from 'src/factura/entities/factura.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: productSchema,
      },
      {
        name: Factura.name,
        schema: facturaSchema,
      },
    ]),
  ],
})
export class ProductModule {}
