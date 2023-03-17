import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { compareSync, hashSync } from 'bcrypt';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  methods: {
    matchPassword(this: UserDocument, password: string) {
      return compareSync(password, this.password);
    },
  },
})
export class User extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  lastname: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  matchPassword: (password: string) => boolean;
}

type UserDocument = User;

const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', function () {
  this.password = hashSync(this.password, 10);
});

export default userSchema;
