import { Module } from '@nestjs/common';
import { CategoryModule } from './category/module';
import { ColorModule } from './color/module';
import { NavModule } from './nav/module';
import { ProductModule } from './product/module';
import { SeriesModule } from './series/module';
import { SubCategoryModule } from './subCategory/module';
import { SubProductModule } from './subProduct/module';

@Module({
    imports: [
        CategoryModule,
        ColorModule,
        NavModule,
        ProductModule,
        SeriesModule,
        SubCategoryModule,
        SubProductModule,
    ],
})

export class TableModule { }
