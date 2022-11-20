import { getTicketByEnrollmentId, getTicketTypes } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicketByEnrollmentId);

export { ticketsRouter };
