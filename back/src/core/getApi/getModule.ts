import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetClientController } from './clientController';
import { GetStaffController } from './staffController'
@Module({
    imports: [ConfigModule],
    controllers: [GetStaffController, GetClientController],
})
export class GetApiModule { }
