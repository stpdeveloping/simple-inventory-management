import { cqrs } from "../app/cqrs";

export const getQueryBus = () => cqrs.buses.queriesBus;