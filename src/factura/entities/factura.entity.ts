import mongoose, { Document } from 'mongoose';
import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Factura extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;
  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  })
  user: User;
  @Prop({
    type: Number,
    default: 0,
  })
  total: number;
}

const facturaSchema = SchemaFactory.createForClass(Factura);

export default facturaSchema;
