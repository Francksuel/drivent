import { notFoundError, requestError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsService from "../tickets-service";

async function getManyHotels(enrollmentId: number) { 
  const ticket = await ticketsService.getOneByEnrollmentId(enrollmentId);
  if(!ticket.id) {    
    throw notFoundError();
  }   
  if (!(ticket.TicketType.isRemote === false && 
    ticket.TicketType.includesHotel === true && 
    ticket.status === "PAID")) {    
    throw requestError(400, "BAD_REQUEST");
  }
  
  const hotels = await hotelRepository.findManyHotels();     
  return hotels;
}

const hotelsService = {
  getManyHotels
};
  
export default hotelsService;
