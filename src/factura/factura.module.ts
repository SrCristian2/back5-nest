import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import facturaSchema, { Factura } from './entities/factura.entity';
import productSchema, { Product } from 'src/product/entities/product.entity';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Factura.name,
        schema: facturaSchema,
      },
      {
        name: Product.name,
        schema: productSchema,
      },
    ]),
  ],
})
export class FacturaModule {}
