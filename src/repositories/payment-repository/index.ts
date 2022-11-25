import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}

async function create(data: CreatePaymentParams) {
  return prisma.payment.create({
    data,
  });
}

export type CreatePaymentParams = Pick<Payment, "ticketId" | "value" | "cardIssuer" | "cardLastDigits">;

const paymentsRepository = {
  findByTicketId,  
  create
};
  
export default paymentsRepository;
