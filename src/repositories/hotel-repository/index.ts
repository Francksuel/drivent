import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return prisma.hotel.findFirst({
    where: { id }
  });
}

async function findManyRoomsByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId }
  });
}

const hotelRepository = {
  findManyHotels,
  findHotelById,
  findManyRoomsByHotelId
};

export default hotelRepository;
