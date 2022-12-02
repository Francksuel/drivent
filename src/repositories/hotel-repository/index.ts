import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return prisma.hotel.findFirst({
    where: { id },
    include: {
      Rooms: {
        where: { hotelId: id },
      },
    },
  });
}

async function findRoomById(id: number) {
  return prisma.room.findFirst({
    where: { id },   
  });
}

const hotelRepository = {
  findManyHotels,
  findHotelById,
  findRoomById
};

export default hotelRepository;
