import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import paymentsService from "@/services/payments-service";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentFromTicketId(req: AuthenticatedRequest, res: Response) {
  const ticketId  = Number(req.query.ticketId as Record<string, string>);
  const { userId } = req;
  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }    
  try {
    const ticket = await ticketsService.getOneByTicketId(ticketId);        
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
     
    if (ticket.enrollmentId !== enrollment.id) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const payment = await paymentsService.getOneByTicketId(ticketId);
          
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {     
    return res.sendStatus(httpStatus.NOT_FOUND);      
  }
}
