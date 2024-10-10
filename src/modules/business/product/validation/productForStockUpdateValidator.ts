import vine from '@vinejs/vine';
import { getProductForStockUpdateValidationSchema } from './getProductForStockUpdateValidationSchema';

export const productForStockUpdateValidator = vine.compile(
    getProductForStockUpdateValidationSchema());