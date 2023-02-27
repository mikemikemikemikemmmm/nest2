import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DBModule } from './core/db/module';
import { GetApiModule } from './core/getApi/getModule';
import { TableModule } from './core/table/table';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthApiModule } from './core/authApi/module';
import { AuthMiddleware } from './core/middleware/auth';
@Module({
  imports: [
    GetApiModule,
    AuthApiModule,
    TableModule,
    DBModule,
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static/'

    }),],


})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('authController/(.*)', 'getClientController/(.*)', 'static/(.*)')
      .forRoutes("*");
  }
}