import { getCommandBus } from "../../shared/getCommandBus";
import { router } from "../../shared/router";
import { createOrderWithProductsCommandName } from "./command-names/createOrderWithProductsCommandName";
import { OrderWithProducts } from "./models/OrderWithProducts";
import { SuccessfulOrderWithProducts } from "./models/SuccessfulOrderWithProducts";
import { moduleRoute } from "./moduleRoute";
import { Request } from 'express';
import { orderWithProductsValidator } from "./validation/orderWithProductsValidator";

export const addOrderRoutes = () => {
    router.post(`${moduleRoute}`, async ({ body }:
        Request<never, SuccessfulOrderWithProducts, OrderWithProducts>, rsp) => {
        await orderWithProductsValidator.validate(body);
        const successfulOrders = await getCommandBus().execute({
            name: createOrderWithProductsCommandName,
            payload: body
        });
        rsp.send(successfulOrders);
    });
}