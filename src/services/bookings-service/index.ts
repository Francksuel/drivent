import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getBookingByUserId(userId: number) { 
  const booking = await bookingRepository.findBookingByUserId(userId);    
  if(!booking.id) {    
    throw notFoundError();
  }  
  return booking;
}

const bookingsService = {
  getBookingByUserId
};
  
export default bookingsService;
