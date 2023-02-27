import { Module } from '@nestjs/common';
import { SubProductController } from './controller';
import { SubProductService } from './service';

@Module({
  imports: [],
  controllers: [SubProductController],
  providers: [SubProductService],
})
export class SubProductModule { }
