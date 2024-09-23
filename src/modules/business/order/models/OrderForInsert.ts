import { ProductForStockUpdate } from '../../product/models/ProductForStockUpdate';
import { orderDbSchema } from '../orderDbSchema';

export type OrderForInsert = Omit<typeof orderDbSchema.$inferInsert, `orderId`> &
    Omit<ProductForStockUpdate, `id`>;