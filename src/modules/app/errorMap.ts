import httpStatus from "http-status";

export const errorMap: { [status in number]: Function } = {
    [httpStatus.NOT_FOUND]: (fieldName: string) => `${fieldName} not found`,
}