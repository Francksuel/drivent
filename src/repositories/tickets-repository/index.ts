import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findManyTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findByTicketId(id: number) {
  return prisma.ticket.findFirst({
    where: { id },    
  });
}

async function findByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}

async function create(data: CreateTicketParams) {
  return prisma.ticket.create({
    data,
  });
}

export type CreateTicketParams = Pick<Ticket, "ticketTypeId" | "enrollmentId" | "status">;

const ticketRepository = {
  findManyTicketTypes,
  findByEnrollmentId,
  findByTicketId,
  create
};

export default ticketRepository;
