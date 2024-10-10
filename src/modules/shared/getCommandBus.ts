import { cqrs } from "../app/cqrs";

export const getCommandBus = () => cqrs.buses.commandsBus;