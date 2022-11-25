import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {    
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);         
    const hotels = await hotelsService.getManyHotels(enrollment.id);
    
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send({});
    }  
    return res.status(httpStatus.BAD_REQUEST).send({});
  }
}
export async function getRooms(_req: AuthenticatedRequest, res: Response) {
  //const { userId } = req;
  try {    
    //const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);         
    // const hotels = await hotelsService.getManyHotels(enrollment.id);
    
    return res.status(httpStatus.OK).send();
  } catch (error) { 
    res.status(httpStatus.BAD_REQUEST).send({});
  }
}
