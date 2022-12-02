import { requestError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import ticketsService from "../tickets-service";

async function getManyHotels(enrollmentId: number) { 
  const ticket = await ticketsService.getOneByEnrollmentId(enrollmentId); 
  if (!(ticket.TicketType.isRemote === false && 
    ticket.TicketType.includesHotel === true && 
    ticket.status === "PAID")) {    
    throw requestError(400, "BAD_REQUEST");
  }
  
  const hotels = await hotelRepository.findManyHotels();     
  return hotels;
}

async function getRoomsByHotelId(hotelId: number, enrollmentId: number) { 
  const ticket = await ticketsService.getOneByEnrollmentId(enrollmentId);
  if (!(ticket.TicketType.isRemote === false && 
    ticket.TicketType.includesHotel === true && 
    ticket.status === "PAID")) {    
    throw requestError(400, "BAD_REQUEST");
  }  
  const hotel = await hotelRepository.findHotelById(hotelId);  
  return hotel;
}
const hotelsService = {
  getManyHotels,
  getRoomsByHotelId,
};
  
export default hotelsService;
