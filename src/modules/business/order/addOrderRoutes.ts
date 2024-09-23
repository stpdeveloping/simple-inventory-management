import { getCommandBus } from "../../shared/getCommandBus";
import { router } from "../../shared/router";
import { createOrderCommandName } from "./command-names/createOrderCommandName";
import { OrderForInsert } from "./models/OrderForInsert";
import { SuccessfulOrder } from "./models/SuccessfulOrder";
import { moduleRoute } from "./moduleRoute";
import { Request } from 'express';
import { orderForInsertValidator } from "./validation/orderForInsertValidator";

export const addOrderRoutes = () => {
    router.post(`${moduleRoute}`, async ({ body }:
        Request<never, SuccessfulOrder, OrderForInsert>, rsp) => {
        await orderForInsertValidator.validate(body);
        const successfulOrder = await getCommandBus().execute({
            name: createOrderCommandName,
            payload: body
        });
        rsp.send(successfulOrder);
    });
}