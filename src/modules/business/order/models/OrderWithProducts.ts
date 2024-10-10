import { ProductForStockUpdate } from '../../product/models/ProductForStockUpdate';
import { orderDbSchema } from '../orderDbSchema';
 
export type OrderWithProducts = Pick<typeof orderDbSchema.$inferInsert, `customerId`> & {
    products: ProductForStockUpdate[];
}