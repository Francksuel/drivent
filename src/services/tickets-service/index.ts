import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/tickets-repository";
import { Ticket, TicketStatus, TicketType } from "@prisma/client";
import enrollmentsService from "../enrollments-service";

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

async function createTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  const data = {
    enrollmentId: enrollment.id,
    ticketTypeId,
    status: TicketStatus.RESERVED
  };
  return ticketRepository.create(data);
}

const ticketsService = {
  getTicketTypes,
  getOneByEnrollmentId,
  createTicket
};
  
export default ticketsService;
