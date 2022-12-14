import { Ticket } from "@prisma/client";
import Joi from "joi";

export const createTicketSchema = Joi.object<CreateTicketWithTicketTypeId>({
  ticketTypeId: Joi.number().integer().required()
});

export type CreateTicketWithTicketTypeId = Pick<Ticket, "ticketTypeId">;
