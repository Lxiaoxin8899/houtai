import { ConfigService } from '@nestjs/config';
import { AdminModuleOptions } from '@adminjs/nestjs';
import { AdminJSOptions, CurrentAdmin } from 'adminjs';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { RoleEnum } from '../roles/roles.enum';

type BuildAdminModuleOptionsParams = {
  resources: AdminJSOptions['resources'];
  configService: ConfigService<AllConfigType>;
  usersService: UsersService;
};

export const buildAdminModuleOptions = ({
  resources,
  configService,
  usersService,
}: BuildAdminModuleOptionsParams): AdminModuleOptions => {
  const adminConfig = configService.getOrThrow('admin', { infer: true });
  const appConfig = configService.getOrThrow('app', { infer: true });

  return {
    adminJsOptions: {
      rootPath: adminConfig.rootPath,
      resources,
      branding: {
        companyName: appConfig.name,
        withMadeWithLove: false,
      },
    },
    auth: {
      authenticate: createAdminAuthenticate(usersService),
      cookieName: adminConfig.cookieName,
      cookiePassword: adminConfig.cookiePassword,
    },
    sessionOptions: {
      secret: adminConfig.cookiePassword,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        httpOnly: true,
        secure: appConfig.nodeEnv === 'production',
      },
      name: adminConfig.cookieName,
    },
  };
};

const createAdminAuthenticate =
  (usersService: UsersService) =>
  async (email: string, password: string): Promise<CurrentAdmin | null> => {
    if (!email || !password) {
      return null;
    }

    const user = await usersService.findByEmail(email);

    if (
      !user ||
      !user.password ||
      !user.role ||
      String(user.role.id) !== String(RoleEnum.admin)
    ) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      email: user.email ?? '',
      title: fullName || user.role?.name || 'Administrator',
      id: user.id ? String(user.id) : undefined,
    };
  };
