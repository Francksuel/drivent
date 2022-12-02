import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBookingWithRoom(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;  
  try {              
    const booking = await bookingsService.getBookingByUserId(userId);    
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {     
    return res.status(httpStatus.NOT_FOUND).send({});  
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;    
  try {          
    const roomId = Number(req.body.roomId);        
    const booking = await bookingsService.createBooking(userId, roomId);   
    return res.status(httpStatus.OK).send({ id: booking.id });
  } catch (error) { 
    if (error.name === "ForbiddenError") {
      return res.status(httpStatus.FORBIDDEN).send({});
    }     
    return res.status(httpStatus.NOT_FOUND).send({});  
  }
}
