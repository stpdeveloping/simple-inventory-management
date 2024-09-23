import httpStatus from 'http-status';
import { ExpressError } from '../../app/ExpressError';
import { db } from '../../shared/db';
import { ProductToFind } from './models/ProductToFind';
import { productDbSchema } from './productDbSchema';
import { eq } from "drizzle-orm";

export const getProduct = async (product: ProductToFind) => {
    const queryResult = await db.select().from(productDbSchema).where(
        eq(productDbSchema.id, product.id));
    const selectedProduct = queryResult[0];
    if (!selectedProduct)
        throw <ExpressError>{ status: httpStatus.NOT_FOUND, body: `Product` }
    return selectedProduct;
}