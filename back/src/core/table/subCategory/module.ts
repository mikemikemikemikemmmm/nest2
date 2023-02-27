import { Module } from '@nestjs/common';
import { SubCategoryController } from './controller';
import { SubCategoryService } from './service';

@Module({
  imports: [],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
