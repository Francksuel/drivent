import { getTicketByEnrollmentId, getTicketTypes, postCreateTicket } from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicketByEnrollmentId)
  .post("/", validateBody(createTicketSchema), postCreateTicket);

export { ticketsRouter };
