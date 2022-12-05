import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentsService from "../enrollments-service";
import ticketsService from "../tickets-service";

async function getBookingByUserId(userId: number) { 
  const booking = await bookingRepository.findBookingByUserId(userId);    
  if(!booking.id) {    
    throw notFoundError();
  }  
  return booking;
}

async function createBooking(userId: number, roomId: number) { 
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  const ticket = await ticketsService.getOneByEnrollmentId(enrollment.id);   
  if (!(ticket.TicketType.isRemote === false && 
    ticket.TicketType.includesHotel === true && 
    ticket.status === "PAID")) {    
    throw forbiddenError();
  } 
  const room = await hotelRepository.findRoomById(roomId);  
  const bookingsReserved = await bookingRepository.findManyByRoomId(roomId);
  if (room.capacity === bookingsReserved.length) {
    throw forbiddenError();
  }  
  const userBooking = await bookingRepository.findManyByUserId(userId);
  if (userBooking.length > 0) {
    throw forbiddenError();
  }
  const booking = await bookingRepository.create(userId, roomId);  
  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) { 
  const userBookings = await bookingRepository.findManyByUserId(userId); 
  if (!userBookings.length || userBookings[0].id !== bookingId) {
    throw forbiddenError();
  } 
  const room = await hotelRepository.findRoomById(roomId);  
  const bookingsReserved = await bookingRepository.findManyByRoomId(roomId);
  if (room.capacity === bookingsReserved.length) {
    throw forbiddenError();
  }  
  await bookingRepository.update(userBookings[0].id, roomId);  
  return userBookings[0];
}

const bookingsService = {
  getBookingByUserId,
  createBooking,
  updateBooking
};
  
export default bookingsService;
