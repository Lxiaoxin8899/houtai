import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { AdminConfig } from './admin-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  ADMIN_PANEL_ROOT_PATH: string;

  @IsString()
  @IsOptional()
  ADMIN_PANEL_COOKIE_NAME: string;

  @IsString()
  @IsOptional()
  ADMIN_PANEL_COOKIE_PASSWORD: string;
}

export default registerAs<AdminConfig>('admin', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const cookiePassword =
    process.env.ADMIN_PANEL_COOKIE_PASSWORD ?? process.env.AUTH_JWT_SECRET;

  if (!cookiePassword) {
    throw new Error(
      'ADMIN_PANEL_COOKIE_PASSWORD or AUTH_JWT_SECRET must be provided',
    );
  }

  return {
    rootPath: process.env.ADMIN_PANEL_ROOT_PATH || '/admin',
    cookieName: process.env.ADMIN_PANEL_COOKIE_NAME || 'adminjs',
    cookiePassword,
  };
});
