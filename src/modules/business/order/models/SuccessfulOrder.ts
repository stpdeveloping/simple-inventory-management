import { productDbSchema } from '../../product/productDbSchema';
import { orderDbSchema } from './../orderDbSchema';

export type SuccessfulOrder =
    Omit<typeof orderDbSchema.$inferSelect, `customerId`> &
    Pick<typeof productDbSchema.$inferSelect, `stock`>;