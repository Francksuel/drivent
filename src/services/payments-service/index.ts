import { notFoundError } from "@/errors";
import paymentsRepository from "@/repositories/payments-repository";
import { Payment } from "@prisma/client";

async function getOneByTicketId(ticketId: number): Promise<Payment> {
  const payment = await paymentsRepository.findByTicketId(ticketId);
  
  if (!payment.id) throw notFoundError();
  
  return payment;
}

const paymentsService = {    
  getOneByTicketId,   
};
    
export default paymentsService;
