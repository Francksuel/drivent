import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
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

async function getOneByTicketId(ticketId: number): Promise<Ticket> {
  const ticket = await ticketRepository.findByTicketId(ticketId);

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

async function updateTicketStatus(ticketId: number) {
  return ticketRepository.update(ticketId);
}

const ticketsService = {
  getTicketTypes,
  getOneByEnrollmentId,
  getOneByTicketId,
  createTicket,
  updateTicketStatus
};
  
export default ticketsService;
