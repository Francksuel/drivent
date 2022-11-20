import { prisma } from "@/config";

async function findManyTicketTypes() {
  return prisma.ticketType.findMany();
}
async function findByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}
const ticketRepository = {
  findManyTicketTypes,
  findByEnrollmentId,
};

export default ticketRepository;
