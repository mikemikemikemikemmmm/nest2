export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});

export const newSubProductIdStart = 999999999
export const subproductImgWidth = 500
export const subproductImgHeight = 500
export const colorImgWidth = 48
export const colorImgHeight = 48
