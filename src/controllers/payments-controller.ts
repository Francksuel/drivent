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

export async function postCreatePayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;
  const { userId } = req;
  const cardLastDigits = cardData.number.slice(11); 
  const cardIssuer = cardData.issuer; 
  try {    
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsService.getOneByTicketId(ticketId);
    if (ticket.enrollmentId !== enrollment.id) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const ticketWithTicketType = await ticketsService.getOneByEnrollmentId(enrollment.id);  
   
    const value =  ticketWithTicketType.TicketType.price;
    const payment =  await paymentsService.createPayment(
      ticketId,
      value,
      cardIssuer,        
      cardLastDigits,    
    );
    await ticketsService.updateTicketStatus(ticketId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
