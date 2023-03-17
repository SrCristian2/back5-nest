import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc123',
    });
  }

  async validate(payload: JwtPayload) {
    const { _id } = payload;
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new UnauthorizedException('invalid token');
    }
    return user;
  }
}
