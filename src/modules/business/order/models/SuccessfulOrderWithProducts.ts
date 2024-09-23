import { ProductWithPossiblyUpdatedStock } from '../../product/models/ProductWithPossiblyUpdatedStock';
import { orderDbSchema } from '../orderDbSchema';

export type SuccessfulOrderWithProducts =
    Pick<typeof orderDbSchema.$inferSelect, `orderId`> & {
        products: ProductWithPossiblyUpdatedStock[]
    }