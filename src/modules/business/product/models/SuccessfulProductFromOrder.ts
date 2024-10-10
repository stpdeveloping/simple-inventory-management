import { productDbSchema } from '../productDbSchema';
import { orderDbSchema } from '../../order/orderDbSchema';

export type SuccessfulProductFromOrder =
    (Omit<typeof orderDbSchema.$inferSelect, `customerId`> &
    Pick<typeof productDbSchema.$inferSelect, `stock`>) | null;