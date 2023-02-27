import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { DBService } from "src/core/db/service";
import * as JWT from 'jsonwebtoken'
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt'
import { sendError } from "../utils";
import { Request } from "express";

@Controller('getStaffController')
export class GetStaffController {
  constructor(private dbService: DBService, private configService: ConfigService) { }

  @Get('login/:password')
  async login(@Param('password') password: string) {
    const { result, error } = await this.dbService.queryByRawSql<{ password: string, permission: string }>(`
      select password,permission
      from admin_user
      limit 1 
    `)
    if (error || typeof result[0] === 'number') {
      return sendError('error')
    }
    const hashedPassword = result[0].password
    const permission = result[0].permission
    const isPass = await bcrypt.compare(password, hashedPassword)
    if (!isPass) {
      return sendError('密碼不符')
    }
    const payload = {
      permission
    }
    const secret = this.configService.get('JWT_SECRET')
    const token = JWT.sign(payload, secret)
    return {
      result: {
        token
      }
    }
  }
  //colorPage
  @Get('getAllColorsApi')
  async getAllColorsApi() {
    const str = `
            select id ,name
            from color
        `
    return await this.dbService.queryByRawSql(str)
  }
  @Get('getColorsBySearchNameApi/:name')
  async getColorsBySearchNameApi(@Param('name') name: string) {
    const str = `
        select id ,name
        from color
        where name = %${name}%
    `
    return await this.dbService.queryByRawSql(str)
  }
  @Get('getProductCardDataByColorIdApi/:colorId')
  async getProductCardDataByColorIdApi(@Param('colorId') colorId: number) {
    const str = `
    WITH summary AS (
      SELECT 
        p.id, 
        p.name,
        sp.id as sp_id,
        ROW_NUMBER() OVER(
          PARTITION BY p.id   
          ORDER BY sp.sort DESC) AS rank
        FROM sub_product sp
        inner join product p  
        on sp.product_id  =p.id
        where sp.color_id = ${colorId}
      )
    SELECT id,name,sp_id as first_subproduct_id
    FROM summary
    WHERE rank = 1
    `
    return await this.dbService.queryByRawSql(str)
  }


  //navPage
  @Get('getAllNavDataForCategoryPageApi')
  async getAllNavDataForCategoryPageApi() {
    const str = `
    with sc_nest as (
        select 
          sc.name ,
          sc.route  ,
          sc.category_id ,
          sc.sort ,
          sc.id,
          'subCategory' as type ,
          case when jsonb_agg(s.id) = '[null]' ::jsonb
          then '[]'::jsonb
          else jsonb_agg(
            jsonb_build_object(
              'name',s.name ,
              'id',s.id,
              'type','series',
              'sub_category_id',s.sub_category_id,
              'sort',s.sort
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
          c.nav_id,
          c.sort,
          'category' as type,
          case when jsonb_agg(sc_nest.id) = '[null]' ::jsonb
          then '[]'::jsonb
          else jsonb_agg(
            jsonb_build_object(
              'name',sc_nest.name,
              'route',sc_nest.route,
              'id',sc_nest.id,
              'type',sc_nest.type,
              'sort',sc_nest.sort,
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
          'nav' as type,
          case when jsonb_agg(c_nest.id) = '[null]' ::jsonb
          then '[]'::jsonb
          else jsonb_agg(
            jsonb_build_object(
              'id',c_nest.id,
              'type', c_nest.type,
              'name',c_nest.name,
              'route',c_nest.route,
              'sort',c_nest.sort,
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
  @Get('getProductCardDataBySeriesIdApi/:series_id') //TODO
  async getProductCardDataBySeriesIdApi(@Param('series_id') series_id: number) {
    const str = `
        WITH summary AS (
          SELECT 
            p.id, 
            p.name,
            p.series_id,
            sp.id as sp_id,
            ROW_NUMBER() OVER(
              PARTITION BY p.id   
              ORDER BY sp.sort DESC) AS rank
            FROM product p
            left join sub_product sp 
            on sp.product_id  =p.id
          )
        SELECT id,name,sp_id as first_subproduct_id
        FROM summary
        WHERE rank = 1 and series_id = ${series_id}
        `;
    return await this.dbService.queryByRawSql(str)
  }

  //ProductPage
  @Get('getProductBySearchNameApi/:name')
  async getProductBySearchNameApi(@Param('name') name: string) {
    const sql = `
    WITH summary AS (
      SELECT p.id, 
      p.name,
      sp.id as sp_id,
      ROW_NUMBER() OVER(
        PARTITION BY p.id   
        ORDER BY sp.sort DESC) AS rank
        FROM product p
        where p.name = %${name}%
        inner join sub_product sp 
        on sp.product_id  =p.id
      )
    SELECT id,name,sp_id as first_subproduct_id
    FROM summary
    WHERE rank = 1
    `
    return await this.dbService.queryByRawSql(sql)
  }
  @Get('getProductsForProductPageApi')
  async getProductsForProductPageApi() {
    const sql = `
    WITH summary AS (
      SELECT p.id, 
      p.name,
      sp.id as sp_id,
      ROW_NUMBER() OVER(
        PARTITION BY p.id   
        ORDER BY sp.sort DESC) AS rank
        FROM product p
        left join sub_product sp 
        on sp.product_id  =p.id
      )
    SELECT id,name,sp_id as first_subproduct_id
    FROM summary
    WHERE rank = 1
    `
    return await this.dbService.queryByRawSql(sql)
  }

  //detailPage
  @Get('getSeriesDataForCreateProductApi') //TODO
  async getSeriesDataForCreateProductApi() {

    return await this.dbService.queryByRawSql(`
    select
      s.id,
      concat(n.name, '-', c.name, '-', sc.name, '-', s.name) as name
    from series s
    inner join sub_category sc
    on sc.id = s.sub_category_id
    inner join category c
    on sc.category_id = c.id
    inner join nav n
    on c.nav_id = n.id
    `)
  }
  @Get('getProductDetailDataByProductIdApi/:productId') //TODO
  async getProductDetailDataByProductIdApi(@Param('productId', ParseIntPipe) productId: number) {

    const getSeries = await this.dbService.queryByRawSql(`
    select
      s.id,
      concat(n.name, '-', c.name, '-', sc.name, '-', s.name) as name
    from series s
    inner join sub_category sc
    on sc.id = s.sub_category_id
    inner join category c
    on sc.category_id = c.id
    inner join nav n
    on c.nav_id = n.id
    `)
    const getColor = await this.dbService.queryByRawSql(`
    select id, name
    from color
    `)
    const getProductDetail = await this.dbService.queryByRawSql(` select  
    p.id,
    p.name,
    p.series_id,
    p.sort,
    false as has_error,
    case 
      when jsonb_agg(sp.id) = '[null]' :: jsonb
      then '[]' :: json
      else json_agg(
        json_build_object(
          'product_id',p.id,
          'id', sp.id,
          'price',sp.price,
          'sort', sp.sort,
          'color_id', sp.color_id,
          'size_s', sp.size_s,
          'size_m', sp.size_m,
          'size_l', sp.size_l,
          'is_new',false,
          'is_deleted',false
        ) order by sp.sort desc
        )
        end as sub_products
    from product p
    left join sub_product sp
    on sp.product_id = ${productId}
    where p.id = ${productId}
    group by p.id
    order by p.sort DESC

    `)
    return {
      result: {
        colors: getColor.result,
        series: getSeries.result,
        product: getProductDetail.result
      }
    }
  }
  @Get('getProductIdBySeriesIdAndNameApi/:seriesId/:name')
  async getProductIdBySeriesIdAndNameApi(@Param('seriesId', ParseIntPipe) seriesId: number, @Param('name') name: string) {
    const sql = `
      select id
      from product
      where series_id =${seriesId} and name ='${name}'
    `
    return await this.dbService.queryByRawSql(sql)
  }
}
