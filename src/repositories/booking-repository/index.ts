import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({  
    where: { userId }, 
    select: {
      id: true,            
      Room: {}
    } 
  });
}

async function findManyByRoomId(roomId: number) {
  return prisma.booking.findMany({  
    where: { roomId }   
  });
}

async function create(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findManyByRoomId,
  create
};

export default bookingRepository;
