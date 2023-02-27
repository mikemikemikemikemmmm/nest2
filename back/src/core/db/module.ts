import { Global, Module } from '@nestjs/common/decorators';
import { DBService } from './service';
import { ConfigModule, ConfigService } from '@nestjs/config';
const DBProvider = {
  provide: DBService,
  useFactory: async (configService: ConfigService) => {
    const dbUrl = configService.get('DB_URL');
    const db = new DBService(dbUrl);
    await db.ensureConnect()
    return db;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBProvider],
  exports: [DBProvider],
})
export class DBModule { }
