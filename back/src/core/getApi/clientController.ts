import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Request } from "@nestjs/common";
import { DBService } from "src/core/db/service";

@Controller('getClientController')
export class GetClientController {
  constructor(private dbService: DBService) { }
  // @Get('test')
  // test() {
  //   throw Error
  // }
  @Get('getAllNavApi')
  async getAllNavApi() {
    const str = `
    with sc_nest as (
      select 
        sc.name ,
        sc.route  ,
        sc.category_id ,
        sc.id,
        sc.sort,
        case when jsonb_agg(s.id) = '[null]' ::jsonb
        then '[]'::jsonb
        else jsonb_agg(
          jsonb_build_object(
            'name',s.name , 
            'id',s.id,
            'sub_category_id',s.sub_category_id
          ) order by s.sort DESC
        ) end as children
      from sub_category sc 
      left join series s ON s.sub_category_id =sc.id 
      group by sc.id
    ),
    c_nest as (
      select 
        c.id,
        c.name ,
        c.route ,
        c.sort,
        c.nav_id,
        case when jsonb_agg(sc_nest.id) = '[null]' ::jsonb
        then '[]'::jsonb
        else jsonb_agg(
          jsonb_build_object(
            'category_id',sc_nest.category_id,
            'name',sc_nest.name,
            'route',sc_nest.route,
            'id',sc_nest.id,
            'children',sc_nest.children
          ) order by sc_nest.sort DESC
        ) end 
        as children
      from category c
      left join sc_nest ON sc_nest.category_id  =c.id 
      group by c.id
    ),
    n_nest as (
      select 
        n.name,
        n.route,
        n.id,
        n.sort,
        case when jsonb_agg(c_nest.id) = '[null]' ::jsonb
        then '[]'::jsonb
        else jsonb_agg(
          jsonb_build_object(
            'id',c_nest.id,
            'nav_id',c_nest.nav_id,
            'name',c_nest.name,
            'route',c_nest.route,
            'children',c_nest.children              
            ) order by c_nest.sort DESC
        ) end
     as children
      from nav n
      left join c_nest on c_nest.nav_id =n.id
      group by n.id  
    )
    select *
    from n_nest
    order by sort DESC
            `;
    return await this.dbService.queryByRawSql(str)
  }
  @Get('getProductCardDataOnNavIndexApi/:navRoute')
  async getProductCardDataOnNavIndexApi(@Param('navRoute') navRoute: string) {
    const sql = `
        select 
        p."name" ,
        p.id,
        jsonb_agg(
          jsonb_build_object(
            'price',sp.price ,
            'id',sp.id ,
            'color_id',c2.id ,
            'color_name',c2."name" 
          )  order by sp.sort 
        ) as subproducts
      from nav n
      inner join category c 
      on c.nav_id =n.id and n.route = '${navRoute}'
      inner join sub_category sc 
      on sc.category_id =c.id 
      inner join series s 
      on s.sub_category_id =sc.id 
      inner join product p 
      on p.series_id =s.id 
      inner join sub_product sp 
      on sp.product_id =p.id 
      inner join color c2 
      on sp.color_id =c2.id 
      group by p.id,n.route 
  `
    return await this.dbService.queryByRawSql(sql)
  }
  @Get('getSeriesDataByRouteApi/:navRoute/:categoryRoute/:subcategoryRoute') //TODO
  async getSeriesDataByRouteApi(
    @Param('subcategoryRoute') subcategoryRoute: string,
    @Param('categoryRoute') categoryRoute: string,
    @Param('navRoute') navRoute: string,
  ) {
    const sql = `    
    with get_subproducts as(
      select 
      p."name" ,
      p.id,
      p.sort,
      series_id,
      jsonb_agg(
        jsonb_build_object(
          'id',sp.id,
          'price',sp.price ,
          'color_id',c2.id ,
          'color_name',c2."name" 
        ) order by sp.sort 
      ) as subproducts
      from product p
      inner join sub_product sp		
      on p.id =sp.product_id 
      inner join color c2 
      on sp.color_id =c2.id
      group by p.id
    )
    select 
    s.id ,
    s."name" ,
    jsonb_agg(
      jsonb_build_object(
          'id',gs.id,
          'name',gs.name ,
          'subproducts',gs.subproducts 
      ) order by gs.sort 
    ) as products
    from nav n
    inner join category c 
    on c.nav_id =n.id and n.route = '${navRoute}' and c.route = '${categoryRoute}'
    inner join sub_category sc 
    on sc.category_id =c.id and sc.route = '${subcategoryRoute}'
    inner join series s 
    on s.sub_category_id =sc.id 
    inner join get_subproducts gs 
    on gs.series_id = s.id 
    group by s.id
    order by s.sort 
        `
    return await this.dbService.queryByRawSql(sql)
  }
  @Get('getProductDetailByProductIdApi/:productId')
  async getProductDetailByProductIdApi(@Param('productId', ParseIntPipe) productId: number) {
    const sql = `
    select
      p.id,
      p."name" ,
      p.series_id ,
      (
        select n.route
        from nav n
        inner join category c
        on c.nav_id = n.id
        inner join sub_category sc
        on sc.category_id = c.id
        inner join series s
        on s.id = p.series_id and s.sub_category_id = sc.id
      ) as nav_route,
      case when jsonb_agg(sp.id) = '[null]' ::jsonb
      then '[]'::jsonb
      else jsonb_agg(
        jsonb_build_object(
          'id',sp.id,
          'price',sp.price ,
          'color_name',c."name" ,
          'color_id',c.id ,
          'size_l',sp.size_l,
          'size_m',sp.size_m,
          'size_s',sp.size_s
        ) order by sp.sort
      )  end as subproducts
    from product p 
    inner join sub_product sp
    on sp.product_id = p.id  and p.id = ${productId}
    inner join color c 
    on c.id  = sp.color_id
    group by p.id
        `
    return await this.dbService.queryByRawSql(sql)
  }
}
