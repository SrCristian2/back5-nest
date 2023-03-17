import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import userSchema, { User } from './entities/user.entity';
import { JwtStrategy } from './estrategy/jwt.estrategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),

    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '6d' },
    }),
  ],
})
export class UserModule {}
