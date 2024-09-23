import { ProductForStockUpdate } from './ProductForStockUpdate';
import { orderDbSchema } from '../../order/orderDbSchema';

export type ProductFromOrder = Omit<typeof orderDbSchema.$inferInsert, `orderId`> &
    Omit<ProductForStockUpdate, `id`>;