import mongoose, { Document } from 'mongoose';
import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Schema({
  timestamps: true,
  methods: {
    setImg(this: ProductDocument, secure_url: string, public_id: string) {
      this.imgUrl = secure_url;
      this.public_id = public_id;
    },
  },
})
export class Product extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
  })
  rate: number;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
  })
  stock: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: String,
    default: null,
  })
  imgUrl: string;

  @Prop({
    type: String,
    default: null,
  })
  public_id: string;

  setImg: (secure_url: string, public_id: string) => void;
}

type ProductDocument = Product;

const productSchema = SchemaFactory.createForClass(Product);

export default productSchema;
