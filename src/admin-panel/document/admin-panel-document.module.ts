import { Module } from '@nestjs/common';
import { AdminModule as AdminJsModule, ExpressLoader } from '@adminjs/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { AllConfigType } from '../../config/config.type';
import AdminJS from 'adminjs';
import {
  Database as MongooseDatabase,
  Resource as MongooseResource,
} from '@adminjs/mongoose';
import {
  sessionResourceOptions,
  userResourceOptions,
} from '../admin-panel.resources';
import { buildAdminModuleOptions } from '../admin-panel.helpers';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserSchema,
  UserSchemaClass,
  UserSchemaDocument,
} from '../../users/infrastructure/persistence/document/entities/user.schema';
import {
  SessionSchema,
  SessionSchemaClass,
  SessionSchemaDocument,
} from '../../session/infrastructure/persistence/document/entities/session.schema';

AdminJS.registerAdapter({
  Database: MongooseDatabase,
  Resource: MongooseResource,
});

@Module({
  imports: [
    AdminJsModule.createAdminAsync({
      imports: [
        ConfigModule,
        UsersModule,
        MongooseModule.forFeature([
          { name: UserSchemaClass.name, schema: UserSchema },
          { name: SessionSchemaClass.name, schema: SessionSchema },
        ]),
      ],
      inject: [
        ConfigService,
        UsersService,
        getModelToken(UserSchemaClass.name),
        getModelToken(SessionSchemaClass.name),
      ],
      customLoader: ExpressLoader,
      useFactory: (
        configService: ConfigService<AllConfigType>,
        usersService: UsersService,
        userModel: Model<UserSchemaDocument>,
        sessionModel: Model<SessionSchemaDocument>,
      ) => {
        const resources = [
          { resource: userModel, options: userResourceOptions },
          { resource: sessionModel, options: sessionResourceOptions },
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
export class AdminPanelDocumentModule {}
