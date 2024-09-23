export type ExpressError<TBody> = {
    expose: boolean;
    statusCode: number;
    status: number;
    body: TBody;
    type: string;
}