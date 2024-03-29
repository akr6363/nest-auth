import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtPayload } from '@auth/interfaces';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async save(user: Partial<User>) {
    const hashedPassword = user?.password
      ? this.hashPassword(user.password)
      : null;

    const savedUser = await this.prismaService.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        provider: user?.provider ?? undefined,
        password: hashedPassword ?? undefined,
        roles: user?.roles ?? undefined,
        isBlocked: user?.isBlocked ?? undefined,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
        provider: user.provider,
      },
    });

    await this.cacheManager.set(savedUser.id, savedUser);
    await this.cacheManager.set(savedUser.email, savedUser);

    return savedUser;
  }

  async findOne(idOrEmail: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(idOrEmail);
    }
    const cachedUser: User = await this.cacheManager.get(idOrEmail);
    if (cachedUser) return cachedUser;
    console.log('findOne');
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
    await this.cacheManager.set(
      idOrEmail,
      user,
      convertToSecondsUtil(this.configService.get('JWT_EXP')),
    );

    return user;
  }

  delete(id: string, user: JwtPayload) {
    if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
      console.log(user.id);
      console.log(id);
      throw new ForbiddenException();
    }
    return this.prismaService.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
