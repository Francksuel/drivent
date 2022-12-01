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
