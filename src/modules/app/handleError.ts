import { errors } from "@vinejs/vine";
import { ErrorRequestHandler } from "express";
import { ExpressError } from "./ExpressError";
import { errorMap } from "./errorMap";
import httpStatus from "http-status";

export const handleError: ErrorRequestHandler =
    ((err: typeof errors.E_VALIDATION_ERROR | ExpressError, _, res, _2) => {
        if (err instanceof errors.E_VALIDATION_ERROR)
            res.status(err.status).send(err.messages);
        else {
            const { status, body } = err as ExpressError;
            res.status(status ?? httpStatus.INTERNAL_SERVER_ERROR).send([{
                message: errorMap[status]?.(body) ?? body ??
                    httpStatus[`500_MESSAGE`]
            }]);
        }
    });