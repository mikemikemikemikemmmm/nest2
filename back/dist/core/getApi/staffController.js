"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStaffController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../db/service");
const JWT = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const utils_1 = require("../utils");
let GetStaffController = class GetStaffController {
    constructor(dbService, configService) {
        this.dbService = dbService;
        this.configService = configService;
    }
    async login(password) {
        const { result, error } = await this.dbService.queryByRawSql(`
      select password,permission
      from admin_user
      limit 1 
    `);
        if (error || typeof result[0] === 'number') {
            return (0, utils_1.sendError)('error');
        }
        const hashedPassword = result[0].password;
        const permission = result[0].permission;
        const isPass = await bcrypt.compare(password, hashedPassword);
        if (!isPass) {
            return (0, utils_1.sendError)('密碼不符');
        }
        const payload = {
            permission
        };
        const secret = this.configService.get('JWT_SECRET');
        const token = JWT.sign(payload, secret);
        return {
            result: {
                token
            }
        };
    }
    async getAllColorsApi() {
        const str = `
            select id ,name
            from color
        `;
        return await this.dbService.queryByRawSql(str);
    }
    async getColorsBySearchNameApi(name) {
        const str = `
        select id ,name
        from color
        where name = %${name}%
    `;
        return await this.dbService.queryByRawSql(str);
    }
    async getProductCardDataByColorIdApi(colorId) {
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
    `;
        return await this.dbService.queryByRawSql(str);
    }
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
        return await this.dbService.queryByRawSql(str);
    }
    async getProductCardDataBySeriesIdApi(series_id) {
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
        return await this.dbService.queryByRawSql(str);
    }
    async getProductBySearchNameApi(name) {
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
    `;
        return await this.dbService.queryByRawSql(sql);
    }
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
    `;
        return await this.dbService.queryByRawSql(sql);
    }
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
    `);
    }
    async getProductDetailDataByProductIdApi(productId) {
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
    `);
        const getColor = await this.dbService.queryByRawSql(`
    select id, name
    from color
    `);
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

    `);
        return {
            result: {
                colors: getColor.result,
                series: getSeries.result,
                product: getProductDetail.result
            }
        };
    }
    async getProductIdBySeriesIdAndNameApi(seriesId, name) {
        const sql = `
      select id
      from product
      where series_id =${seriesId} and name ='${name}'
    `;
        return await this.dbService.queryByRawSql(sql);
    }
};
__decorate([
    (0, common_1.Get)('login/:password'),
    __param(0, (0, common_1.Param)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('getAllColorsApi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getAllColorsApi", null);
__decorate([
    (0, common_1.Get)('getColorsBySearchNameApi/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getColorsBySearchNameApi", null);
__decorate([
    (0, common_1.Get)('getProductCardDataByColorIdApi/:colorId'),
    __param(0, (0, common_1.Param)('colorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductCardDataByColorIdApi", null);
__decorate([
    (0, common_1.Get)('getAllNavDataForCategoryPageApi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getAllNavDataForCategoryPageApi", null);
__decorate([
    (0, common_1.Get)('getProductCardDataBySeriesIdApi/:series_id'),
    __param(0, (0, common_1.Param)('series_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductCardDataBySeriesIdApi", null);
__decorate([
    (0, common_1.Get)('getProductBySearchNameApi/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductBySearchNameApi", null);
__decorate([
    (0, common_1.Get)('getProductsForProductPageApi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductsForProductPageApi", null);
__decorate([
    (0, common_1.Get)('getSeriesDataForCreateProductApi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getSeriesDataForCreateProductApi", null);
__decorate([
    (0, common_1.Get)('getProductDetailDataByProductIdApi/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductDetailDataByProductIdApi", null);
__decorate([
    (0, common_1.Get)('getProductIdBySeriesIdAndNameApi/:seriesId/:name'),
    __param(0, (0, common_1.Param)('seriesId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], GetStaffController.prototype, "getProductIdBySeriesIdAndNameApi", null);
GetStaffController = __decorate([
    (0, common_1.Controller)('getStaffController'),
    __metadata("design:paramtypes", [service_1.DBService, config_1.ConfigService])
], GetStaffController);
exports.GetStaffController = GetStaffController;
//# sourceMappingURL=staffController.js.map