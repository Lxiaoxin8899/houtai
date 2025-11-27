import { Module } from '@nestjs/common';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';
import { AdminPanelRelationalModule } from './relational/admin-panel-relational.module';
import { AdminPanelDocumentModule } from './document/admin-panel-document.module';

// <database-block>
const infrastructureAdminPanelModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? AdminPanelDocumentModule
  : AdminPanelRelationalModule;
// </database-block>

@Module({
  imports: [infrastructureAdminPanelModule],
})
export class AdminPanelModule {}
