import httpStatus from "http-status";

export const errorMap: { [status in number]: (...params: string[]) => string } = {
    [httpStatus.NOT_FOUND]: (fieldName: string) => `${fieldName} not found`,
}