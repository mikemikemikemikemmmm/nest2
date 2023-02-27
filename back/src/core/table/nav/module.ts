import { Module } from '@nestjs/common';
import { NavController } from './controller';
import { NavService } from './service';

@Module({
  controllers: [NavController],
  providers: [NavService],
})
export class NavModule { }
