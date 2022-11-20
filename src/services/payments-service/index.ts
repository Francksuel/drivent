import { notFoundError } from "@/errors";
import paymentsRepository from "@/repositories/payments-repository";
import { Payment } from "@prisma/client";

async function getOneByTicketId(ticketId: number): Promise<Payment> {
  const payment = await paymentsRepository.findByTicketId(ticketId);
  
  if (!payment.id) throw notFoundError();
  
  return payment;
}

async function createPayment(ticketId: number, value: number, cardIssuer: string, cardLastDigits: string): Promise<Payment> {
  const data = {
    ticketId,
    value,
    cardIssuer,
    cardLastDigits
  };
  return paymentsRepository.create(data);
}

const paymentsService = {    
  getOneByTicketId,
  createPayment   
};
    
export default paymentsService;
