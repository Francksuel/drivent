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

async function findManyByUserId(userId: number) {
  return prisma.booking.findMany({  
    where: { userId },  
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

async function update(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  findManyByUserId,
  findManyByRoomId,
  create,
  update
};

export default bookingRepository;
