import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }  
}

export async function getTicketByEnrollmentId(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;

  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsService.getOneByEnrollmentId(enrollment.id);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
