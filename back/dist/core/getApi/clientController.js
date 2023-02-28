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
exports.GetClientController = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../db/service");
let GetClientController = class GetClientController {
    constructor(dbService) {
        this.dbService = dbService;
    }
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
        return await this.dbService.queryByRawSql(str);
    }
    async getProductCardDataOnNavIndexApi(navRoute) {
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
  `;
        return await this.dbService.queryByRawSql(sql);
    }
    async getSeriesDataByRouteApi(subcategoryRoute, categoryRoute, navRoute) {
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
        `;
        return await this.dbService.queryByRawSql(sql);
    }
    async getProductDetailByProductIdApi(productId) {
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
        `;
        return await this.dbService.queryByRawSql(sql);
    }
};
__decorate([
    (0, common_1.Get)('getAllNavApi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GetClientController.prototype, "getAllNavApi", null);
__decorate([
    (0, common_1.Get)('getProductCardDataOnNavIndexApi/:navRoute'),
    __param(0, (0, common_1.Param)('navRoute')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetClientController.prototype, "getProductCardDataOnNavIndexApi", null);
__decorate([
    (0, common_1.Get)('getSeriesDataByRouteApi/:navRoute/:categoryRoute/:subcategoryRoute'),
    __param(0, (0, common_1.Param)('subcategoryRoute')),
    __param(1, (0, common_1.Param)('categoryRoute')),
    __param(2, (0, common_1.Param)('navRoute')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GetClientController.prototype, "getSeriesDataByRouteApi", null);
__decorate([
    (0, common_1.Get)('getProductDetailByProductIdApi/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GetClientController.prototype, "getProductDetailByProductIdApi", null);
GetClientController = __decorate([
    (0, common_1.Controller)('getClientController'),
    __metadata("design:paramtypes", [service_1.DBService])
], GetClientController);
exports.GetClientController = GetClientController;
//# sourceMappingURL=clientController.js.map