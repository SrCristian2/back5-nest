import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import categorySchema, { Category } from './entities/category.entity';
import productSchema, { Product } from 'src/product/entities/product.entity';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: categorySchema,
      },
      {
        name: Product.name,
        schema: productSchema,
      },
    ]),
  ],
})
export class CategoryModule {}
