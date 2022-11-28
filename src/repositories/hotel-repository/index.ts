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

const hotelRepository = {
  findManyHotels,
  findHotelById,
};

export default hotelRepository;
