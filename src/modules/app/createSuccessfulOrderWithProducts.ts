import { ProductWithPossiblyUpdatedStock } from '../business/product/models/ProductWithPossiblyUpdatedStock';
import { SuccessfulProductFromOrder } from '../business/product/models/SuccessfulProductFromOrder';
import { ExpressError } from './ExpressError';
import httpStatus from 'http-status';
import { SuccessfulOrderWithProducts } from '../business/order/models/SuccessfulOrderWithProducts';

export const createSuccessfulOrderWithProducts = (
    successfulProductFromOrder: SuccessfulProductFromOrder,
    productsWithPossiblyUpdatedStock: ProductWithPossiblyUpdatedStock[]) => {
    if (!successfulProductFromOrder) {
        throw <ExpressError<object>>{
          status: httpStatus.UNPROCESSABLE_ENTITY,
          body: productsWithPossiblyUpdatedStock
        }
      }
      return <SuccessfulOrderWithProducts>{
        orderId: successfulProductFromOrder.orderId,
        products: productsWithPossiblyUpdatedStock
      }
}