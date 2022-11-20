import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findManyTicketTypes();     
  return ticketTypes;
}

async function getOneByEnrollmentId(enrollmentId: number): Promise<Ticket & {
  TicketType: TicketType;
}> {
  const ticket = await ticketRepository.findByEnrollmentId(enrollmentId);

  if (!ticket.id) throw notFoundError();

  return ticket;
}

const ticketsService = {
  getTicketTypes,
  getOneByEnrollmentId
};
  
export default ticketsService;
