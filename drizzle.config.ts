import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
    schema: [
        `./src/modules/business/order/orderDbSchema.ts`,
        `./src/modules/business/product/productDbSchema.ts`
    ],
    out: env.DRIZZLE_LOCATION,
    dialect: 'sqlite'
});