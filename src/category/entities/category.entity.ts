import { Document } from 'mongoose';
import { Schema } from '@nestjs/mongoose';

import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';

@Schema({
  timestamps: true,
  methods: {
    setImg(this: CategoryDocument, secure_url: string, public_id: string) {
      this.imgUrl = secure_url;
      this.public_id = public_id;
    },
  },
})
export class Category extends Document {
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

type CategoryDocument = Category;

const categorySchema = SchemaFactory.createForClass(Category);

export default categorySchema;
