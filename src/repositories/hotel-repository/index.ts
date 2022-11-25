import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany();
}

const hotelRepository = {
  findManyHotels,
};

export default hotelRepository;
