"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorImgHeight = exports.colorImgWidth = exports.subproductImgHeight = exports.subproductImgWidth = exports.newSubProductIdStart = void 0;
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
});
exports.newSubProductIdStart = 999999999;
exports.subproductImgWidth = 500;
exports.subproductImgHeight = 500;
exports.colorImgWidth = 48;
exports.colorImgHeight = 48;
//# sourceMappingURL=index.js.map