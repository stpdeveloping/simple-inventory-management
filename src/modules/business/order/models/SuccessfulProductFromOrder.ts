import { productDbSchema } from '../../product/productDbSchema';
import { orderDbSchema } from '../orderDbSchema';

export type SuccessfulProductFromOrder =
    (Omit<typeof orderDbSchema.$inferSelect, `customerId`> &
    Pick<typeof productDbSchema.$inferSelect, `stock`>) | null;