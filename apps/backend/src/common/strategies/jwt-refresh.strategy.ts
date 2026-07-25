import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret'),
    });
  }

  async validate(payload: any) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: payload.jti },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.is_revoked || refreshToken.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: refreshToken.user.id },
      relations: ['organization', 'department', 'user_roles', 'user_roles.role', 'user_roles.role.permissions'],
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException();
    }

    return user;
  }
}
