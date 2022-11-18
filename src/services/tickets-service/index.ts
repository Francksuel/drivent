import ticketRepository from "@/repositories/tickets-repository";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findManyTicketTypes();     
  return ticketTypes;
}

const ticketsService = {
  getTicketTypes,
};
  
export default ticketsService;
