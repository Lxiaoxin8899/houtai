import { Module } from '@nestjs/common';
import { AdminModule as AdminJsModule, ExpressLoader } from '@adminjs/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { AllConfigType } from '../../config/config.type';
import AdminJS from 'adminjs';
import {
  Database as TypeormDatabase,
  Resource as TypeormResource,
} from '@adminjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/persistence/relational/entities/user.entity';
import { SessionEntity } from '../../session/infrastructure/persistence/relational/entities/session.entity';
import { buildAdminModuleOptions } from '../admin-panel.helpers';
import {
  sessionResourceOptions,
  userResourceOptions,
} from '../admin-panel.resources';

AdminJS.registerAdapter({
  Database: TypeormDatabase,
  Resource: TypeormResource,
});

@Module({
  imports: [
    AdminJsModule.createAdminAsync({
      imports: [ConfigModule, UsersModule],
      inject: [ConfigService, UsersService, DataSource],
      customLoader: ExpressLoader,
      useFactory: (
        configService: ConfigService<AllConfigType>,
        usersService: UsersService,
        dataSource: DataSource,
      ) => {
        [UserEntity, SessionEntity].forEach((entity) =>
          entity.useDataSource(dataSource),
        );

        const resources = [
          { resource: UserEntity, options: userResourceOptions },
          { resource: SessionEntity, options: sessionResourceOptions },
        ];

        return buildAdminModuleOptions({
          resources,
          configService,
          usersService,
        });
      },
    }),
  ],
})
export class AdminPanelRelationalModule {}
