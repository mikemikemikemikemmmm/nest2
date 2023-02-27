import { Module } from '@nestjs/common';
import { SeriesController } from './controller';
import { SeriesService } from './service';

@Module({
  imports: [],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule { }
