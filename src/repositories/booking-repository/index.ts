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

const bookingRepository = {
  findBookingByUserId,
};

export default bookingRepository;
