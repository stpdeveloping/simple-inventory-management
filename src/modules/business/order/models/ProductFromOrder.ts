import { ProductForStockUpdate } from '../../product/models/ProductForStockUpdate';
import { orderDbSchema } from '../orderDbSchema';

export type ProductFromOrder = Omit<typeof orderDbSchema.$inferInsert, `orderId`> &
    Omit<ProductForStockUpdate, `id`>;